import * as React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import HeadInfo from "../../src/components/HeadInfo";
import { CardHeader, PoolsCardHeader } from "../../src/components/Pools/Cardheader";
import { ShortCard as PoolsTable } from "../../src/components/Pools/poolsTable";
import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { useInterval } from "../../src/hooks/useInterval";
import { AppDispatch, useAppSelector } from "../../src/redux";
import { createGaugeConfig, getConfig } from "../../src/redux/config/config";
import { getEpochData } from "../../src/redux/epoch/epoch";
import { getTotalVotingPower } from "../../src/redux/pools";
import { getLpTokenPrice, getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import { fetchWallet } from "../../src/redux/wallet/wallet";
import info from "../../src/assets/icon/pools/InfoBlue.svg";
import close from "../../src/assets/icon/pools/closeBlue.svg";
import Image from "next/image";
import { USERADDRESS } from "../../src/constants/localStorage";
import { NewPool } from "../../src/components/Pools/NewPool";
import { InputSearchBox } from "../../src/components/Pools/Component/SearchInputBox";
import clsx from "clsx";
import { poolsDataWrapper } from "../../src/api/pools";
import { IPoolsDataWrapperResponse } from "../../src/api/pools/types";
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
  const [showLiquidityModal, setShowLiquidityModal] = React.useState(false);
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
    Object.keys(token).length !== 0 && dispatch(getTokenPrice());
  }, [token]);
  useEffect(() => {
    Object.keys(tokenPrices).length !== 0 && dispatch(getLpTokenPrice(tokenPrices));
  }, [tokenPrices]);
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
  const [poolsData, setPoolsData] = React.useState<{
    success: boolean;
    data: IPoolsDataWrapperResponse[];
  }>({} as { success: boolean; data: IPoolsDataWrapperResponse[] });
  useEffect(() => {
    setPoolsData({ success: false, data: [] as IPoolsDataWrapperResponse[] });
    if (Object.keys(tokenPrices).length !== 0) {
      poolsDataWrapper(walletAddress ? walletAddress : undefined, tokenPrices).then((res) => {
        setPoolsData({ success: true, data: Object.values(res.allData) });
      });
    }
  }, [walletAddress, tokenPrices, reFetchPool]);
  return (
    <>
      <SideBarHOC>
        <div>
          <HeadInfo
            className="px-2 md:px-3"
            title="Pools"
            toolTipContent="Watch how to add liquidity, stake, and earn PLY. "
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            isFirst={walletAddress !== null && localStorage.getItem(USERADDRESS) !== walletAddress}
            onClick={handleNewPool}
          />
          <div className="my-2 mx-3">
            <InputSearchBox
              className={clsx("md:hidden")}
              value={searchValue}
              onChange={setSearchValue}
            />
          </div>
          <div className="sticky top-0 z-10">
            <CardHeader
              activeStateTab={activeStateTab}
              setActiveStateTab={setActiveStateTab}
              className="md:px-3"
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          </div>
          {isbanner && (
            <div className="h-[42px] mx-4 md:mx-[23px] px-2 rounded-lg mt-3 flex items-center bg-info-500/[0.1]">
              <p className="relative top-0.5">
                <Image src={info} />
              </p>
              <p className="font-body2 text-info-500 px-3 md:w-auto w-[249px]">
                APR for the first week will be 0%. Emissions begin in the second week.
              </p>
              <p
                className="ml-auto relative top-[7px] cursor-pointer"
                onClick={() => setisBanner(false)}
              >
                <Image src={close} />
              </p>
            </div>
          )}
          {activeStateTab === PoolsCardHeader.All && (
            <PoolsTable
              className="md:pl-5 md:py-4  pl-2 py-4"
              searchValue={searchValue}
              activeStateTab={activeStateTab}
              setActiveStateTab={setActiveStateTab}
              setShowLiquidityModal={setShowLiquidityModal}
              showLiquidityModal={showLiquidityModal}
              reFetchPool={reFetchPool}
              data={poolsData}
            />
          )}
          {activeStateTab === PoolsCardHeader.Stable && (
            <PoolsTable
              className="md:pl-5 md:py-4  pl-2 py-4"
              poolsFilter={AMM_TYPE.STABLE}
              searchValue={searchValue}
              activeStateTab={activeStateTab}
              setActiveStateTab={setActiveStateTab}
              setShowLiquidityModal={setShowLiquidityModal}
              showLiquidityModal={showLiquidityModal}
              reFetchPool={reFetchPool}
              data={poolsData}
            />
          )}
          {activeStateTab === PoolsCardHeader.Volatile && (
            <PoolsTable
              className="md:pl-5 md:py-4  pl-2 py-4"
              poolsFilter={AMM_TYPE.VOLATILE}
              searchValue={searchValue}
              activeStateTab={activeStateTab}
              setActiveStateTab={setActiveStateTab}
              setShowLiquidityModal={setShowLiquidityModal}
              showLiquidityModal={showLiquidityModal}
              reFetchPool={reFetchPool}
              data={poolsData}
            />
          )}
          {activeStateTab === PoolsCardHeader.Mypools && (
            <PoolsTable
              className="md:pl-5 md:py-4  pl-2 py-4"
              poolsFilter={AMM_TYPE.MYPOOS}
              isConnectWalletRequired={true}
              searchValue={searchValue}
              activeStateTab={activeStateTab}
              setActiveStateTab={setActiveStateTab}
              setShowLiquidityModal={setShowLiquidityModal}
              showLiquidityModal={showLiquidityModal}
              reFetchPool={reFetchPool}
              data={poolsData}
            />
          )}
          <NewPool
            show={showNewPoolPopup}
            setShow={setShowNewPoolPopup}
            setShowLiquidityModal={setShowLiquidityModal}
            showLiquidityModal={showLiquidityModal}
            setReFetchPool={setReFetchPool}
            reFetchPool={reFetchPool}
          />
          {/* poolsTable */}
        </div>
      </SideBarHOC>
    </>
  );
}
