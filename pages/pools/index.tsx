import * as React from "react";
import { useEffect, useState } from "react";
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
import { getAllPoolsData, getMyPoolsData } from "../../src/api/pools";
import {
  IAllPoolsData,
  IAllPoolsDataResponse,
  IMyPoolsData,
  IMyPoolsDataResponse,
} from "../../src/api/pools/types";
import { MyPoolTable } from "../../src/components/Pools/MyPoolTable";
export interface IIndexProps {}
export enum POOL_TYPE {
  VOLATILE = "VOLATILE",
  STABLE = "STABLE",
  MYPOOLS = "My pools",
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
  useEffect(() => {
    if (!initialLpPriceCall.current) {
      Object.keys(tokenPrices).length !== 0 && dispatch(getLpTokenPrice(tokenPrices));
    } else {
      initialLpPriceCall.current = false;
    }
  }, [tokenPrices]);
  useEffect(() => {
    Object.keys(amm).length !== 0 && dispatch(createGaugeConfig());
  }, [amm]);
  const [searchValue, setSearchValue] = React.useState("");
  const [isbanner, setisBanner] = React.useState(false);
  const [showNewPoolPopup, setShowNewPoolPopup] = React.useState(false);
  const handleNewPool = () => {
    setShowNewPoolPopup(true);
  };
  const [reFetchPool, setReFetchPool] = React.useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFetchingMyPool, setIsFetchingMyPool] = useState(false);

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
            videoLink="HtDOhje7Y5A"
          />
          <div className="my-2 mx-3">
            <InputSearchBox
              className={clsx("md:hidden")}
              value={searchValue.toString().trim()}
              onChange={setSearchValue}
            />
          </div>
          <div className="sticky top-[-1px] z-10">
            <CardHeader
              activeStateTab={activeStateTab}
              setActiveStateTab={setActiveStateTab}
              className="md:px-3"
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          </div>
          {/* {isbanner && (
            <div className="py-1.5 md:h-[42px] mx-4 md:mx-[23px] px-2 rounded-lg mt-3 flex items-center bg-info-500/[0.1]">
              <p className="relative top-0.5">
                <Image src={info} />
              </p>
              <p className="font-body2 text-info-500 px-3 sm:w-auto w-[280px]">
                APR for the for the first two epochs will be 0%. Emissions begin on 19th Jan.
              </p>
              <p
                className="ml-auto relative top-[7px] cursor-pointer"
                onClick={() => setisBanner(false)}
              >
                <Image src={close} />
              </p>
            </div>
          )} */}
          {activeStateTab === PoolsCardHeader.All && (
            <PoolsTable
              className="md:pl-5 md:py-4  pl-2 py-4"
              searchValue={searchValue}
              activeStateTab={activeStateTab}
              setShowLiquidityModalPopup={setShowLiquidityModal}
              setActiveStateTab={setActiveStateTab}
              setShowLiquidityModal={handleCloseManagePopup}
              showLiquidityModal={showLiquidityModal}
              reFetchPool={reFetchPool}
              isFetching={isFetching}
              isError={isError}
            />
          )}
          {activeStateTab === PoolsCardHeader.Stable && (
            <PoolsTable
              className="md:pl-5 md:py-4  pl-2 py-4"
              poolsFilter={POOL_TYPE.STABLE}
              searchValue={searchValue}
              activeStateTab={activeStateTab}
              setShowLiquidityModalPopup={setShowLiquidityModal}
              setActiveStateTab={setActiveStateTab}
              setShowLiquidityModal={handleCloseManagePopup}
              showLiquidityModal={showLiquidityModal}
              reFetchPool={reFetchPool}
              isFetching={isFetching}
              isError={isError}
            />
          )}
          {activeStateTab === PoolsCardHeader.Volatile && (
            <PoolsTable
              className="md:pl-5 md:py-4  pl-2 py-4"
              poolsFilter={POOL_TYPE.VOLATILE}
              searchValue={searchValue}
              activeStateTab={activeStateTab}
              setShowLiquidityModalPopup={setShowLiquidityModal}
              setActiveStateTab={setActiveStateTab}
              setShowLiquidityModal={handleCloseManagePopup}
              showLiquidityModal={showLiquidityModal}
              reFetchPool={reFetchPool}
              isFetching={isFetching}
              isError={isError}
            />
          )}
          {activeStateTab === PoolsCardHeader.Mypools && (
            <MyPoolTable
              className="md:pl-5 md:py-4  pl-2 py-4"
              poolsFilter={POOL_TYPE.MYPOOLS}
              isConnectWalletRequired={true}
              searchValue={searchValue}
              activeStateTab={activeStateTab}
              setShowLiquidityModalPopup={setShowLiquidityModal}
              setActiveStateTab={setActiveStateTab}
              setShowLiquidityModal={handleCloseManagePopup}
              showLiquidityModal={showLiquidityModal}
              reFetchPool={reFetchPool}
              isFetchingMyPool={isFetchingMyPool}
            />
          )}
          <NewPool
            show={showNewPoolPopup}
            setShow={setShowNewPoolPopup}
            setShowLiquidityModal={handleCloseManagePopup}
            showLiquidityModal={showLiquidityModal}
            setReFetchPool={setReFetchPool}
            reFetchPool={reFetchPool}
            setShowLiquidityModalPopup={setShowLiquidityModal}
          />
          {/* poolsTable */}
        </div>
      </SideBarHOC>
    </>
  );
}
