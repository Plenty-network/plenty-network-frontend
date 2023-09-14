import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { useInterval } from "../../src/hooks/useInterval";
import { AppDispatch, useAppSelector } from "../../src/redux";
import { createGaugeConfig, getConfig } from "../../src/redux/config/config";
import { getEpochData } from "../../src/redux/epoch/epoch";
import { getTotalVotingPower } from "../../src/redux/pools";
import { getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import { fetchWallet } from "../../src/redux/wallet/wallet";
import { FIRST_TIME_TUTORIAL, USERADDRESS } from "../../src/constants/localStorage";

import { PoolsCardHeaderV3 } from "../../src/components/v3/pools/CardHeaderv3";
import PoolsV3 from "../../src/components/v3";
import Tutorial from "../../src/components/Tutorial";

export interface IIndexProps {}
export enum POOL_TYPE {
  MYPOOLS = "My pools",
}
export default function Pools(props: IIndexProps) {
  const [activeStateTab, setActiveStateTab] = React.useState<PoolsCardHeaderV3 | string>(
    PoolsCardHeaderV3.All
  );

  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.config.tokens);

  const totalVotingPowerError = useAppSelector((state) => state.pools.totalVotingPowerError);
  const epochError = useAppSelector((state) => state.epoch).epochFetchError;

  const amm = useAppSelector((state) => state.config.AMMs);

  const initialPriceCall = React.useRef<boolean>(true);

  useEffect(() => {
    if (epochError) {
      dispatch(getEpochData());
    }
  }, [epochError]);

  useInterval(() => {
    dispatch(getEpochData());
  }, 60000);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
  }, []);
  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem(USERADDRESS, walletAddress);
      dispatch(getTotalVotingPower());
    }
  }, [walletAddress]);
  useEffect(() => {
    if (walletAddress && totalVotingPowerError) {
      dispatch(getTotalVotingPower());
    }
  }, [totalVotingPowerError]);
  useEffect(() => {
    if (!initialPriceCall.current) {
      Object.keys(token).length !== 0 && dispatch(getTokenPrice());
    } else {
      initialPriceCall.current = false;
    }
  }, [token]);

  useEffect(() => {
    Object.keys(amm).length !== 0 && dispatch(createGaugeConfig());
  }, [amm]);

  const [show, setShow] = useState(true);
  return (
    <>
      <SideBarHOC>
        {localStorage.getItem(FIRST_TIME_TUTORIAL) !== "true" ? (
          <Tutorial show={show} setShow={setShow} />
        ) : (
          <PoolsV3 />
        )}
      </SideBarHOC>
    </>
  );
}
