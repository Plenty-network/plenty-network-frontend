import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import HeadInfo from "../../src/components/HeadInfo";

import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { useInterval } from "../../src/hooks/useInterval";
import { AppDispatch, useAppSelector } from "../../src/redux";
import { createGaugeConfig, getConfig } from "../../src/redux/config/config";
import { getEpochData } from "../../src/redux/epoch/epoch";
import { getTotalVotingPower } from "../../src/redux/pools";
import { getLpTokenPrice, getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import { fetchWallet } from "../../src/redux/wallet/wallet";
import { USERADDRESS } from "../../src/constants/localStorage";
import clsx from "clsx";

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
  const tokenPrices = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const amm = useAppSelector((state) => state.config.AMMs);
  const [showLiquidityModal, setShowLiquidityModal] = React.useState(false);
  const initialPriceCall = React.useRef<boolean>(true);
  const initialLpPriceCall = React.useRef<boolean>(true);
  const handleCloseManagePopup = (val: boolean) => {
    setShowLiquidityModal(val);
  };
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
  // useEffect(() => {
  //   if (!initialLpPriceCall.current) {
  //     Object.keys(tokenPrices).length !== 0 && dispatch(getLpTokenPrice(tokenPrices));
  //   } else {
  //     initialLpPriceCall.current = false;
  //   }
  // }, [tokenPrices]);
  useEffect(() => {
    Object.keys(amm).length !== 0 && dispatch(createGaugeConfig());
  }, [amm]);
  const [searchValue, setSearchValue] = React.useState("");
  const [isbanner, setisBanner] = React.useState(true);
  const [showNewPoolPopup, setShowNewPoolPopup] = React.useState(false);
  const handleNewPool = () => {
    setShowNewPoolPopup(true);
  };
  const [reFetchPool, setReFetchPool] = React.useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [show, setShow] = useState(true);
  return (
    <>
      <SideBarHOC>
        <Tutorial show={show} setShow={setShow} />
        {false && <PoolsV3 />}
      </SideBarHOC>
    </>
  );
}
