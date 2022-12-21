import { useConnectModal, useChainModal } from "@rainbow-me/rainbowkit";
import { useCallback, useMemo } from "react";
import { useAccount, useSigner, useSignMessage } from "wagmi";
import { AIRDROP_EVM_CTA_TEXTS } from "../../constants/airdrop";
import { useSetEvmCTAState } from "../../hooks/useSetEvmCTAState";
import { useAppDispatch, useAppSelector } from "../../redux";
import { addSignature } from "../../redux/airdrop/transactions";
import { EvmCTAState, IEvmSignatureData } from "../../redux/airdrop/types";
import { switchWallet, walletConnection } from "../../redux/wallet/wallet";
import Button from "../Button/Button";
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
        //TODO: add message to env file
        const messageToSign: string = `${process.env.NEXT_PUBLIC_EVM_SIGNING_MESSAGE}${userTezosAddress}`;
        const evmAddress = ethAddress as string;
        const signedMessage: string = await signMessageAsync({ message: messageToSign });

        const signatureData: IEvmSignatureData = {
          message: messageToSign,
          signature: signedMessage,
        };
        dispatch(addSignature({ evmAddress, signatureData }));
        //TODO: handle else & catch(when not connected or signer is undefined) appropriately with some error message
      } else {
        throw new Error("Missing wallet connections");
      }
    } catch (error) {
      console.log(error);
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
      case EvmCTAState.NO_TRANSACTIONS:
        return (
          <Button
            color="primary"
            onClick={() => window.open("https://tezos.com/tez/#buy-tez", "_blank")}
            width="w-full"
          >
            {AIRDROP_EVM_CTA_TEXTS[EvmCTAState.NO_TRANSACTIONS]}
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
    }
  }, [evmCTAState]);

  return <>{EvmChainsCTA}</>;
};
export default EvmWalletButton;
