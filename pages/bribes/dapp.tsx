import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getPoolsDataForBribes, getUserBribeData } from "../../src/api/bribes";
import { IPoolsForBribesResponse, IUserBribeData } from "../../src/api/bribes/types";
import BribesMain from "../../src/components/Bribes";

import { useInterval } from "../../src/hooks/useInterval";
import { createGaugeConfig, getConfig } from "../../src/redux/config/config";
import { getEpochData } from "../../src/redux/epoch/epoch";
import { AppDispatch, store, useAppSelector } from "../../src/redux/index";
import { getTotalVotingPower } from "../../src/redux/pools";
import { getLpTokenPrice, getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import { fetchWallet } from "../../src/redux/wallet/wallet";
import { getRewardsAprEstimate } from "../../src/redux/rewardsApr";

const Dapp: NextPage = () => {
  const userAddress = useAppSelector((state) => state.wallet.address);
  const token = useAppSelector((state) => state.config.tokens);
  const totalVotingPowerError = useAppSelector((state) => state.pools.totalVotingPowerError);
  const epochError = useAppSelector((state) => state.epoch).epochFetchError;
  const tokenPrices = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const amm = useAppSelector((state) => state.config.AMMs);
  const dispatch = useDispatch<AppDispatch>();
  const epoch = useAppSelector((state) => state.epoch.currentEpoch);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const initialPriceCall = useRef<boolean>(true);
  const initialLpPriceCall = useRef<boolean>(true);
  const initialRewardsAprCall = useRef<boolean>(true);
  const currentTotalVotingPower = useAppSelector((state) => state.pools.totalVotingPower);
  const rewardsAprEstimateError = useAppSelector((state) => state.rewardsApr.rewardsAprEstimateError);

  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
  }, []);
  useEffect(() => {
    if (epochError) {
      dispatch(getEpochData());
    }
  }, [epochError]);

  useInterval(() => {
    dispatch(getEpochData());
  }, 60000);
  useEffect(() => {
    dispatch(getTotalVotingPower());
  }, [userAddress]);
  useEffect(() => {
    if (totalVotingPowerError) {
      dispatch(getTotalVotingPower());
    }
  }, [totalVotingPowerError]);
  const [isOperationComplete, setIsOperationComplete] = useState(false);
  useEffect(() => {
    if(!initialPriceCall.current) {
      Object.keys(token).length !== 0 && dispatch(getTokenPrice());
    } else {
      initialPriceCall.current = false;
    }
  }, [token]);
  useEffect(() => {
    if(!initialLpPriceCall.current) {
      Object.keys(tokenPrices).length !== 0 && dispatch(getLpTokenPrice(tokenPrices));
    } else {
      initialLpPriceCall.current = false;
    }
  }, [tokenPrices]);
  useEffect(() => {
    Object.keys(amm).length !== 0 && dispatch(createGaugeConfig());
  }, [amm]);
  useEffect(() => {
    if (!initialRewardsAprCall.current) {
      if (Object.keys(tokenPrices).length !== 0) {
        dispatch(
          getRewardsAprEstimate({
            totalVotingPower: currentTotalVotingPower,
            tokenPrices,
          })
        );
      }
    } else {
      initialRewardsAprCall.current = false;
    }
  }, [currentTotalVotingPower, tokenPrices]);
  useEffect(() => {
    if (rewardsAprEstimateError && Object.keys(tokenPrices).length !== 0) {
      dispatch(
        getRewardsAprEstimate({
          totalVotingPower: currentTotalVotingPower,
          tokenPrices,
        })
      );
    }
  }, [rewardsAprEstimateError]);

  const [poolsArr, setPoolsArr] = useState<{
    data: IPoolsForBribesResponse;
    isfetched: boolean;
  }>({ data: {} as IPoolsForBribesResponse, isfetched: false });
  const [bribesArr, setBribesArr] = useState<{
    data: IUserBribeData[];
    isfetched: boolean;
  }>({ data: [] as IUserBribeData[], isfetched: false });
  useEffect(() => {
    if (Object.keys(tokenPrice).length !== 0) {
      getPoolsDataForBribes(epoch?.epochNumber, tokenPrice).then((res) => {
        setPoolsArr({ data: res, isfetched: true });
      });
    }
  }, [epoch?.epochNumber, isOperationComplete, tokenPrice]);
  useEffect(() => {
    if (Object.keys(tokenPrice).length !== 0)
      getUserBribeData(userAddress, tokenPrice).then((res) => {
        setBribesArr({ data: res.userBribesData, isfetched: true });
      });
  }, [userAddress, tokenPrice, isOperationComplete]);

  return (
    <>
      {
        <BribesMain
          poolsArr={poolsArr}
          bribesArr={bribesArr}
          setIsOperationComplete={setIsOperationComplete}
          isOperationComplete={isOperationComplete}
        />
      }
    </>
  );
};

export default Dapp;
