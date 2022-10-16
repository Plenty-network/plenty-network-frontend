import * as React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import HeadInfo from "../../src/components/HeadInfo";
import { CardHeader, PoolsCardHeader } from "../../src/components/Pools/Cardheader";
import { ShortCard as PoolsTable } from "../../src/components/Pools/ShortCard";
import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { useInterval } from "../../src/hooks/useInterval";
import { AppDispatch, useAppSelector } from "../../src/redux";
import { createGaugeConfig, getConfig } from "../../src/redux/config/config";
import { getEpochData } from "../../src/redux/epoch/epoch";
import { getTotalVotingPower } from "../../src/redux/pools";
import { getLpTokenPrice, getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import { fetchWallet } from "../../src/redux/wallet/wallet";
export interface IIndexProps {}
export enum AMM_TYPE {
  VOLATILE = "VOLATILE",
  STABLE = "STABLE",
  MYPOOS = "MyPools",
}
export default function Pools(props: IIndexProps) {
  const [activeStateTab, setActiveStateTab] = React.useState<PoolsCardHeader | string>(
    PoolsCardHeader.All
  );

  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.config.tokens);
  const totalVotingPowerError = useAppSelector((state) => state.pools.totalVotingPowerError);
  const epochError = useAppSelector((state) => state.epoch).epochFetchError;
  const tokenPrices = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const amm = useAppSelector((state) => state.config.AMMs);

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
      localStorage.setItem("pool", walletAddress);
      dispatch(getTotalVotingPower());
    }
  }, [walletAddress]);
  useEffect(() => {
    if (walletAddress && totalVotingPowerError) {
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
  const [searchValue, setSearchValue] = React.useState("");
  return (
    <>
      <SideBarHOC>
        {/* className='' */}
        <div>
          <HeadInfo
            className="px-2 md:px-3"
            title="Pools"
            toolTipContent="Watch how to add liquidity, stake, and earn PLY. "
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            isFirst={localStorage.getItem("pool") !== walletAddress}
          />
          <div className="sticky top-0 z-10">
            <CardHeader
              activeStateTab={activeStateTab}
              setActiveStateTab={setActiveStateTab}
              className="md:px-3"
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          </div>
          {activeStateTab === PoolsCardHeader.All && (
            <PoolsTable
              className="md:px-5 md:py-4  px-2 py-4"
              searchValue={searchValue}
              setActiveStateTab={setActiveStateTab}
            />
          )}
          {activeStateTab === PoolsCardHeader.Stable && (
            <PoolsTable
              className="md:px-5 md:py-4  px-2 py-4"
              poolsFilter={AMM_TYPE.STABLE}
              searchValue={searchValue}
              setActiveStateTab={setActiveStateTab}
            />
          )}
          {activeStateTab === PoolsCardHeader.Volatile && (
            <PoolsTable
              className="md:px-5 md:py-4  px-2 py-4"
              poolsFilter={AMM_TYPE.VOLATILE}
              searchValue={searchValue}
              setActiveStateTab={setActiveStateTab}
            />
          )}
          {activeStateTab === PoolsCardHeader.Mypools && (
            <PoolsTable
              className="md:px-5 md:py-4  px-2 py-4"
              poolsFilter={AMM_TYPE.MYPOOS}
              isConnectWalletRequired={true}
              searchValue={searchValue}
              setActiveStateTab={setActiveStateTab}
            />
          )}

          {/* poolsTable */}
        </div>
      </SideBarHOC>
    </>
  );
}
