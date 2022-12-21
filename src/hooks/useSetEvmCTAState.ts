import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import {
  isEvmWalletEligible,
  tezosAccountHasTransactions,
  tezosWalletHasAirdrop,
} from "../api/airdrop";
import { useAppDispatch, useAppSelector } from "../redux";
import { setEvmCTAState, setTextDisplayState } from "../redux/airdrop/state";
import { setReceiptsCallFrom } from "../redux/airdrop/transactions";
import { EvmCTAState, ReceiptsCallFrom, TextType } from "../redux/airdrop/types";

const useSetEvmCTAState = () => {
  const dispatch = useAppDispatch();
  /* Hooks provided by wagami for getting account, connection, network and chain related info */
  const { isConnected: isEvmConnected, address: ethAddress } = useAccount();
  const { chain: ethChain } = useNetwork();
  const userTezosAddress = useAppSelector((state) => state.wallet.address);
  const signaturesData = useAppSelector((state) => state.airdropTransactions.signaturesData);

  // Set the state of CTA
  useEffect(() => {
    const setCTAStatus = async () => {
      try {
        dispatch(
          setReceiptsCallFrom({
            tezosAddress: userTezosAddress,
            receiptsCallFrom: ReceiptsCallFrom.TEZOS,
          })
        );
        dispatch(
          setTextDisplayState({
            isVisible: false,
            textType: TextType.NONE,
            textData: undefined,
          })
        );
        dispatch(setEvmCTAState(EvmCTAState.LOADING));
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
          // dispatch(setEvmCTAState(EvmCTAState.LOADING));
          const eligiblity = await isEvmWalletEligible(ethAddress);
          if (!eligiblity.eligible) {
            dispatch(setEvmCTAState(EvmCTAState.NOT_ELIGIBLE));
          } else {
            if (!userTezosAddress || userTezosAddress.length === 0) {
              dispatch(setEvmCTAState(EvmCTAState.TEZOS_DISCONNECTED));
            } else {
              // dispatch(setEvmCTAState(EvmCTAState.LOADING));
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
                const signed = signaturesData[ethAddress] ? true : false;
                if (!signed) {
                  dispatch(setEvmCTAState(EvmCTAState.NOT_SIGNED));
                  dispatch(
                    setTextDisplayState({
                      isVisible: true,
                      textType: TextType.INFO,
                      textData: `You have chosen to receive your airdrop at ${userTezosAddress}`,
                    })
                  );
                } else {
                  // dispatch(setEvmCTAState(EvmCTAState.LOADING));
                  const tezosAddressHasTransactions = await tezosAccountHasTransactions(
                    userTezosAddress
                  );
                  if (!tezosAddressHasTransactions) {
                    dispatch(setEvmCTAState(EvmCTAState.NO_TRANSACTIONS));
                    dispatch(
                      setTextDisplayState({
                        isVisible: true,
                        textType: TextType.INFO,
                        textData: `You have chosen to receive your airdrop at ${userTezosAddress}`,
                      })
                    );
                  } else {
                    dispatch(setEvmCTAState(EvmCTAState.ELIGIBLE));
                    dispatch(
                      setTextDisplayState({
                        isVisible: true,
                        textType: TextType.INFO,
                        textData: `You have chosen to receive your airdrop at ${userTezosAddress}`,
                      })
                    );
                    dispatch(
                      setReceiptsCallFrom({
                        tezosAddress: userTezosAddress,
                        receiptsCallFrom: ReceiptsCallFrom.EVM,
                      })
                    );
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    setCTAStatus();
  }, [isEvmConnected, userTezosAddress, ethAddress, signaturesData, ethChain]);
};

export { useSetEvmCTAState };