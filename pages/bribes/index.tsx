import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getPoolsDataForBribes, getUserBribeData } from "../../src/api/bribes";
import { IPoolsForBribesResponse, IUserBribeData } from "../../src/api/bribes/types";
import Landing from "../../src/components/Bribes/LandingPage";
import { useInterval } from "../../src/hooks/useInterval";
import { createGaugeConfig, getConfig } from "../../src/redux/config/config";
import { getEpochData } from "../../src/redux/epoch/epoch";
import { AppDispatch, store, useAppSelector } from "../../src/redux/index";
import { getTotalVotingPower } from "../../src/redux/pools";
import { getLpTokenPrice, getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import { fetchWallet, walletConnection } from "../../src/redux/wallet/wallet";

const Bribes: NextPage = () => {
  const userAddress = useAppSelector((state) => state.wallet.address);
  const token = useAppSelector((state) => state.config.tokens);
  const totalVotingPowerError = useAppSelector((state) => state.pools.totalVotingPowerError);
  const epochError = useAppSelector((state) => state.epoch).epochFetchError;
  const tokenPrices = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const amm = useAppSelector((state) => state.config.AMMs);
  const dispatch = useDispatch<AppDispatch>();
  const epoch = store.getState().epoch.currentEpoch;

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
    if (userAddress) {
      dispatch(getTotalVotingPower());
    }
  }, [userAddress]);
  useEffect(() => {
    if (userAddress && totalVotingPowerError) {
      dispatch(getTotalVotingPower());
    }
  }, [totalVotingPowerError]);
  useEffect(() => {
    Object.keys(token).length !== 0 && dispatch(getTokenPrice());
  }, [token]);
  useEffect(() => {
    Object.keys(tokenPrices).length !== 0 && dispatch(getLpTokenPrice(tokenPrices));
  }, [tokenPrices]);
  useEffect(() => {
    Object.keys(amm).length !== 0 && dispatch(createGaugeConfig());
  }, [amm]);
  const [isBribesMain, setBribesMain] = useState(false);

  const tokenPrice = store.getState().tokenPrice.tokenPrice;
  useEffect(() => {
    if (Object.keys(tokenPrice).length !== 0)
      getUserBribeData(userAddress, tokenPrice).then((res) => {
        setBribesArr({ data: res.userBribesData, isfetched: true });
      });
  }, [userAddress, tokenPrice]);
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
  }, [epoch?.epochNumber, tokenPrice]);

  return <>{!isBribesMain && <Landing setBribesMain={setBribesMain} />}</>;
};

export default Bribes;
