import { BigNumber } from "bignumber.js";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { isEvmWalletEligible, tezosWalletHasAirdrop } from "../api/airdrop";
import { useAppDispatch, useAppSelector } from "../redux";
import { setEthClaimAmount, setEvmCTAState, setTextDisplayState } from "../redux/airdrop/state";
import { EvmCTAState, TextType } from "../redux/airdrop/types";

const useSetEvmCTAState = () => {
  const dispatch = useAppDispatch();
  /* Hooks provided by wagami for getting account, connection, network and chain related info */
  const { isConnected: isEvmConnected, address: ethAddress } = useAccount();
  const { chain: ethChain } = useNetwork();
  const userTezosAddress = useAppSelector((state) => state.wallet.address);
  const reloadTrigger = useAppSelector((state) => state.airdropState.reloadTrigger);

  // Set the state of CTA
  useEffect(() => {
    const setCTAStatus = async () => {
      try {
        dispatch(
          setTextDisplayState({
            isVisible: false,
            textType: TextType.NONE,
            textData: undefined,
          })
        );
        dispatch(setEvmCTAState(EvmCTAState.LOADING));
        dispatch(setEthClaimAmount(new BigNumber(0)));
        if (ethChain?.unsupported) {
          dispatch(setEvmCTAState(EvmCTAState.WRONG_NETWORK));
          dispatch(
            setTextDisplayState({
              isVisible: true,
              textType: TextType.WARNING,
              textData: "Unsupported chain selected. Please switch network.",
            })
          );
          return;
        }
        if (!isEvmConnected || !ethAddress) {
          dispatch(setEvmCTAState(EvmCTAState.EVM_DISCONNECTED));
        } else {
          const eligiblity = await isEvmWalletEligible(ethAddress);
          if (!eligiblity.eligible) {
            dispatch(setEvmCTAState(EvmCTAState.NOT_ELIGIBLE));
          } else {
            dispatch(setEthClaimAmount(eligiblity.value));
            if (eligiblity.tzAddress) {
              dispatch(setEvmCTAState(EvmCTAState.ELIGIBLE));
              dispatch(
                setTextDisplayState({
                  isVisible: true,
                  textType: TextType.INFO,
                  textData: `You have chosen to receive your airdrop at ${eligiblity.tzAddress}`,
                })
              );
            } else {
              if (!userTezosAddress || userTezosAddress.length === 0) {
                dispatch(setEvmCTAState(EvmCTAState.TEZOS_DISCONNECTED));
              } else {
                const tezosHasAirdrop = await tezosWalletHasAirdrop(userTezosAddress);
                if (tezosHasAirdrop) {
                  dispatch(setEvmCTAState(EvmCTAState.HAS_AIRDROP_SWITCH));
                  dispatch(
                    setTextDisplayState({
                      isVisible: true,
                      textType: TextType.WARNING,
                      textData: `${userTezosAddress} already has an assigned airdrop, please choose another address`,
                    })
                  );
                } else {
                  dispatch(setEvmCTAState(EvmCTAState.NOT_SIGNED));
                  dispatch(
                    setTextDisplayState({
                      isVisible: true,
                      textType: TextType.INFO,
                      textData: `You have chosen to receive your airdrop at ${userTezosAddress}`,
                    })
                  );
                }
              }
            }
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
    };
    setCTAStatus();
  }, [isEvmConnected, userTezosAddress, ethAddress, ethChain, reloadTrigger]);
};

export { useSetEvmCTAState };