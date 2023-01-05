import { useEffect, useState } from "react";
import { IClaimDataResponse } from "../api/airdrop/types";
import { AppDispatch, useAppSelector } from "../redux";
import { BigNumber } from "bignumber.js";
import { getTezosClaimData } from "../api/airdrop";
import { setFlashMessage } from "../redux/flashMessage";
import { useDispatch } from "react-redux";
import { Flashtype } from "../components/FlashScreen";
import { AIRDROP_ERROR_MESSAGES } from "../constants/airdrop";

export const useAirdropClaimData = () => {
  const userTezosAddress = useAppSelector((state) => state.wallet.address);
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
  const [fetching, setFetching] = useState<boolean>(true);

  const getAirdropClaimData = async () => {
    setFetching(true);
    getTezosClaimData(userTezosAddress).then((res) => {
      setAirDropClaimData(res);

      setFetching(false);
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
  };

  useEffect(() => {
    if(userTezosAddress) {
      getAirdropClaimData();
    } else {
      setFetching(false);
    }
  }, [
    userTezosAddress,
    claimed,
    operationsuccesful,
  ]);

  return { airdropClaimData: airdropClaimData, setClaimed: setClaimed, fetching: fetching };
};
