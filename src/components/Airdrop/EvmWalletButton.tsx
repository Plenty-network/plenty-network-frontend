import { useConnectModal, useChainModal } from "@rainbow-me/rainbowkit";
import { useCallback, useMemo } from "react";
import { useAccount, useSigner, useSignMessage } from "wagmi";
import { submitSignatureData } from "../../api/airdrop";
import Config from "../../config/config";
import { AIRDROP_ERROR_MESSAGES, AIRDROP_EVM_CTA_TEXTS } from "../../constants/airdrop";
import { useSetEvmCTAState } from "../../hooks/useSetEvmCTAState";
import { useAppDispatch, useAppSelector } from "../../redux";
import { setEvmCTAState, setReloadTrigger, setTextDisplayState } from "../../redux/airdrop/state";
import { EvmCTAState, IEvmSignatureData, TextType } from "../../redux/airdrop/types";
import { setFlashMessage } from "../../redux/flashMessage";
import { switchWallet, walletConnection } from "../../redux/wallet/wallet";
import Button from "../Button/Button";
import { Flashtype } from "../FlashScreen";
import { ChainAirdrop } from "./Disclaimer";

interface IEvmWalletButton {
  setChain: React.Dispatch<React.SetStateAction<ChainAirdrop>>;
}

/**
 *  Create a custom wallet connect button by extending the ConnectButton component provided by RainbowKit.
 */
const EvmWalletButton = (props: IEvmWalletButton): JSX.Element => {
  const { setChain } = props;
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const dispatch = useAppDispatch();
  const evmCTAState = useAppSelector((state) => state.airdropState.evmCTAState);
  /* Hooks provided by wagami for getting account, connection, network and chain related info */
  const { isConnected: isEvmConnected, address: ethAddress } = useAccount();
  const { data: ethSigner } = useSigner();
  const { signMessageAsync } = useSignMessage();
  const userTezosAddress = useAppSelector((state) => state.wallet.address);

  //Status related
  useSetEvmCTAState();

  const signMessage = useCallback(async () => {
    try {
      if (isEvmConnected && ethSigner && userTezosAddress) {
        const messageToSign: string = `${Config.AIRDROP_ETH_MESSAGE_PREFIX}${userTezosAddress}`;
        const signedMessage: string = await signMessageAsync({ message: messageToSign });

        const signatureData: IEvmSignatureData = {
          message: messageToSign,
          signature: signedMessage,
        };
        // dispatch(addSignature({ evmAddress, signatureData }));
        const signSubmitResponse = await submitSignatureData(
          signatureData.message,
          signatureData.signature
        );
        // Success message as of now as set in api.
        if(signSubmitResponse === "SUBMITED_TEZOS_ADDRESS") {
          dispatch(setReloadTrigger());
        } else {
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Warning,
              headerText: "Info",
              trailingText: `${AIRDROP_ERROR_MESSAGES[signSubmitResponse]}`,
              linkText: "",
              isLoading: true,
              transactionId: "",
            })
          );
        }
      } else {
        dispatch(
          setTextDisplayState({
            isVisible: false,
            textType: TextType.NONE,
            textData: undefined,
          })
        );
        if (!isEvmConnected || !ethSigner) {
          dispatch(setEvmCTAState(EvmCTAState.EVM_DISCONNECTED));
        } else if (!userTezosAddress || userTezosAddress.length <= 0) {
          dispatch(setEvmCTAState(EvmCTAState.TEZOS_DISCONNECTED));
        } else {
          throw new Error("Internal error");
        }
      }
    } catch (error) {
      console.log(error);
      dispatch(setEvmCTAState(EvmCTAState.RELOAD));
      dispatch(
        setTextDisplayState({
          isVisible: true,
          textType: TextType.WARNING,
          textData: "Internal error, please reload!",
        })
      );
    }
  }, [isEvmConnected, ethSigner, userTezosAddress, ethAddress]);

  // CTA related
  const connectTezosWallet = () => {
    dispatch(walletConnection());
  };
  const switchTezosWallet = () => {
    dispatch(switchWallet());
  };

  const EvmChainsCTA = useMemo<JSX.Element>((): JSX.Element => {
    switch (evmCTAState) {
      case EvmCTAState.EVM_DISCONNECTED:
        return (
          <Button color="primary" onClick={openConnectModal} width="w-full">
            {AIRDROP_EVM_CTA_TEXTS[EvmCTAState.EVM_DISCONNECTED]}
          </Button>
        );
      case EvmCTAState.NOT_ELIGIBLE:
        return (
          <Button color="disabled" width="w-full">
            {AIRDROP_EVM_CTA_TEXTS[EvmCTAState.NOT_ELIGIBLE]}
          </Button>
        );
      case EvmCTAState.TEZOS_DISCONNECTED:
        return (
          <Button color="primary" onClick={connectTezosWallet} width="w-full">
            {AIRDROP_EVM_CTA_TEXTS[EvmCTAState.TEZOS_DISCONNECTED]}
          </Button>
        );
      case EvmCTAState.HAS_AIRDROP_SWITCH:
        return (
          <Button color="primary" onClick={switchTezosWallet} width="w-full">
            {AIRDROP_EVM_CTA_TEXTS[EvmCTAState.HAS_AIRDROP_SWITCH]}
          </Button>
        );
      case EvmCTAState.NOT_SIGNED:
        return (
          <Button color="primary" onClick={signMessage} width="w-full">
            {AIRDROP_EVM_CTA_TEXTS[EvmCTAState.NOT_SIGNED]}
          </Button>
        );
      case EvmCTAState.ELIGIBLE:
        return (
          <Button color="primary" onClick={() => setChain(ChainAirdrop.Tezos)} width="w-full">
            {AIRDROP_EVM_CTA_TEXTS[EvmCTAState.ELIGIBLE]}
          </Button>
        );
      case EvmCTAState.WRONG_NETWORK:
        return (
          <Button color="primary" onClick={openChainModal} width="w-full">
            {AIRDROP_EVM_CTA_TEXTS[EvmCTAState.WRONG_NETWORK]}
          </Button>
        );
      case EvmCTAState.LOADING:
        return (
          <Button color="disabled" width="w-full">
            {AIRDROP_EVM_CTA_TEXTS[EvmCTAState.LOADING]}
          </Button>
        );
      case EvmCTAState.RELOAD:
        return (
          <Button color="primary" onClick={() => dispatch(setReloadTrigger())} width="w-full">
            {AIRDROP_EVM_CTA_TEXTS[EvmCTAState.RELOAD]}
          </Button>
        );
    }
  }, [evmCTAState]);

  return <>{EvmChainsCTA}</>;
};
export default EvmWalletButton;
