import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { IClaimDataResponse } from "../api/airdrop/types";
import { AppDispatch, useAppSelector } from "../redux";
import { BigNumber } from "bignumber.js";
import { ReceiptsCallFrom } from "../redux/airdrop/types";
import { getTezosClaimData, getEvmClaimData } from "../api/airdrop";
import { setFlashMessage } from "../redux/flashMessage";
import { useDispatch } from "react-redux";
import { Flashtype } from "../components/FlashScreen";
import { AIRDROP_ERROR_MESSAGES } from "../constants/airdrop";

export const useAirdropClaimData = () => {
  const { address: ethAddress } = useAccount();
  const userTezosAddress = useAppSelector((state) => state.wallet.address);
  const signaturesData = useAppSelector((state) => state.airdropTransactions.signaturesData);
  const receiptsCallFrom = useAppSelector((state) => state.airdropTransactions.receiptsCallFrom);
  const tweetedAccounts = useAppSelector((state) => state.airdropTransactions.tweetedAccounts);
  const operationsuccesful = useAppSelector((state) => state.walletLoading.operationSuccesful);

  const dispatch = useDispatch<AppDispatch>();
  const [airdropClaimData, setAirDropClaimData] = useState<IClaimDataResponse>({
    success: false,
    eligible: false,
    message: "",
    perMissionAmount: new BigNumber(0),
    totalClaimableAmount: new BigNumber(0),
    pendingClaimableAmount: new BigNumber(0),
    claimData: [],
  });
  const [claimed, setClaimed] = useState<boolean>(false);

  const getAirdropClaimData = async () => {
    if (
      receiptsCallFrom[userTezosAddress] === undefined ||
      receiptsCallFrom[userTezosAddress] === ReceiptsCallFrom.TEZOS
    ) {
      getTezosClaimData(userTezosAddress).then((res) => {
        console.log("hello1", res);
        setAirDropClaimData(res);

        if (res.success === false && res.message) {
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Info,
              headerText: "Info",
              trailingText: `${AIRDROP_ERROR_MESSAGES[res.message]}`,
              linkText: "",
              isLoading: true,
              transactionId: "",
            })
          );
        }
      });

      // Call getTezosClaimData and set it as airdropClaimData
      // While using this data if response is eligible and success true, then only for the first mission
      // i.e. Mission.ELIGIBLE, check tweetedAccounts.
      /*
          if(tweetedAccounts.includes(userTezosAddress)) {
            mark that mission as completed or claimed based on claim field in the api response.
          } else {
            Take action CTA and onclick of it should call react-share tweet.
            On successful click, call -> dispatch(addTweetedAccount(userTezosAddress));
            Mark that tweet CTA as completed.
            Check with Anshu if without tweet can user try other action and claim,
            if not then disable the other CTAs till tweet is successful. Enabled CTA will have
            pendingClaimAmount as amount.

            Later on as and how user wishes he can complete tasks and claim. On click of claim,
            call claimAirdrop() operation under /operations/airdrop.ts with claimedData[] from api
            response as first argument and rest all relevant modal related arguments. On successful claim 
            set the setClaimed to reload this effect and check or any other way preferred.
          }
        */
    } else if (receiptsCallFrom[userTezosAddress] === ReceiptsCallFrom.EVM) {
      if (!ethAddress) {
        dispatch(
          setFlashMessage({
            flashType: Flashtype.Info,
            headerText: "Info",
            trailingText: `switch to Other chain and connect to Eth wallet.`,
            linkText: "",
            isLoading: true,
            transactionId: "",
          })
        );
        // Display flash message to switch to Other chain and connect to Eth wallet.
      } else {
        const signed = signaturesData[ethAddress] ? true : false;
        if (!signed) {
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Info,
              headerText: "Info",
              trailingText: `switch to Other chain and Confirm Tezos address (sign)`,
              linkText: "",
              isLoading: true,
              transactionId: "",
            })
          );
          // Display flash message to user to switch to Other chain and Confirm Tezos address (sign).
        } else {
          const signedData = signaturesData[ethAddress];
          getEvmClaimData(signedData.message, signedData.signature).then((res) => {
            setAirDropClaimData(res);
            console.log("hello2", res);
          });

          //Call getEvmClaimedData(signedData.message, signedData.signature)
          // While using this data if response is eligible and success true, then only for the first mission
          // i.e. Mission.ELIGIBLE, check tweetedAccounts.
          /*
              if(tweetedAccounts.includes(userTezosAddress)) {
                mark that mission as completed or claimed based on claim field in the api response.
              } else {
                Take action CTA and onclick of it should call react-share tweet.
                On successful click, call -> dispatch(addTweetedAccount(userTezosAddress));
                Mark that tweet CTA as completed.
                Check with Anshu if without tweet can user try other action and claim,
                if not then disable the other CTAs till tweet is successful Enabled CTA will have
                pendingClaimAmount as amount.

                Later on as and how user wishes he can complete tasks and claim. On click of claim,
                call claimAirdrop() operation under /operations/airdrop.ts with claimedData[] from api
                response as first argument and rest all relevant modal related arguments. On successful claim 
                set the setClaimed to reload this effect and check or any other way preferred.
              }
            */
        }
      }
    }
  };

  useEffect(() => {
    getAirdropClaimData();
  }, [
    ethAddress,
    userTezosAddress,
    signaturesData,
    receiptsCallFrom,
    tweetedAccounts,
    claimed,
    operationsuccesful,
  ]);

  return { airdropClaimData: airdropClaimData, setClaimed: setClaimed };
};
