import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import info from "../../../src/assets/icon/pools/InfoBlue.svg";
import close from "../../../src/assets/icon/pools/closeBlue.svg";
import Image from "next/image";
import clsx from "clsx";
import HeadInfo from "../HeadInfo";
import { USERADDRESS } from "../../constants/localStorage";
import { InputSearchBox } from "../Pools/Component/SearchInputBox";
import { CardHeaderV3, PoolsCardHeaderV3 } from "./pools/CardHeaderv3";
import { PoolsTableV3 } from "./pools/poolsTableV3";
import { MyPoolTablev3 } from "./pools/MyPoolsV3";
import { NewPoolv3 } from "./NewPoolV3";
import { AppDispatch, useAppSelector } from "../../redux";

export interface IIndexProps {}
export enum POOL_TYPE {
  MYPOOLS = "My pools",
}
export default function PoolsV3(props: IIndexProps) {
  const [activeStateTab, setActiveStateTab] = React.useState<PoolsCardHeaderV3 | string>(
    PoolsCardHeaderV3.All
  );

  const dispatch = useDispatch<AppDispatch>();
  const [showLiquidityModal, setShowLiquidityModal] = React.useState(false);
  const handleCloseManagePopup = (val: boolean) => {
    setShowLiquidityModal(val);
  };

  const walletAddress = useAppSelector((state) => state.wallet.address);
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);
  const [searchValue, setSearchValue] = React.useState("");
  const [isbanner, setisBanner] = React.useState(true);
  const [showNewPoolPopup, setShowNewPoolPopup] = React.useState(false);
  const handleNewPool = () => {
    setShowNewPoolPopup(true);
  };
  const [reFetchPool, setReFetchPool] = React.useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <>
      {!showLiquidityModal && (
        <div>
          <HeadInfo
            className="px-2 md:px-3"
            title="Pools"
            toolTipContent="Watch how to add liquidity to a V3 pool."
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            isFirst={walletAddress !== null && localStorage.getItem(USERADDRESS) !== walletAddress}
            onClick={handleNewPool}
            videoLink="lchYETZED_Y"
          />
          <div className="my-2 mx-3">
            <InputSearchBox
              className={clsx("md:hidden")}
              value={searchValue.toString().trim()}
              onChange={setSearchValue}
            />
          </div>
          <div className="sticky top-[-1px] z-10">
            <CardHeaderV3
              activeStateTab={activeStateTab}
              setActiveStateTab={setActiveStateTab}
              className="md:px-3"
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          </div>
          {isbanner && (
            <div className="py-1.5 md:h-[42px] mx-4 md:mx-[23px] px-2 rounded-lg mt-3 flex items-center bg-info-500/[0.1]">
              <p className="relative top-0.5">
                <Image src={info} />
              </p>
              <p className="font-body2 text-info-500 px-3 sm:w-auto w-[280px]">
                PLY incentivisation is not available for v3 pools
              </p>
              <p
                className="ml-auto relative top-[7px] cursor-pointer"
                onClick={() => setisBanner(false)}
              >
                <Image src={close} />
              </p>
            </div>
          )}
          {activeStateTab === PoolsCardHeaderV3.All && (
            <PoolsTableV3
              className="md:pl-5 md:mr-5 mr-2 md:py-4  pl-2 py-4"
              searchValue={searchValue}
              activeStateTab={activeStateTab}
              setActiveStateTab={setActiveStateTab}
              reFetchPool={reFetchPool}
              isFetching={isFetching}
              isError={isError}
            />
          )}

          {activeStateTab === PoolsCardHeaderV3.Mypools && (
            <MyPoolTablev3
              className="md:pl-5 md:mr-5 mr-2 md:py-4  pl-2 py-4"
              poolsFilter={POOL_TYPE.MYPOOLS}
              isConnectWalletRequired={true}
              searchValue={searchValue}
              setActiveStateTab={setActiveStateTab}
              activeStateTab={activeStateTab}
              reFetchPool={reFetchPool}
              isFetching={false}
              isError={false}
            />
          )}
          <NewPoolv3
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
      )}
    </>
  );
}
