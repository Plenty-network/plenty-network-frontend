import * as React from "react";
import { Column } from "react-table";
import { usePoolsMain } from "../../api/pools/query/poolsmain.query";
import { IPoolsDataWrapperResponse } from "../../api/pools/types";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { CircularImageInfo } from "./Component/CircularImageInfo";
import { ManageLiquidity } from "./ManageLiquidity";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { AprInfo } from "./Component/AprInfo";
import { PoolsText, PoolsTextWithTooltip } from "./Component/PoolsText";
import { isMobile } from "react-device-detect";
import { AMM_TYPE } from "../../../pages/pools";
import { usePoolsTableFilter } from "../../hooks/usePoolsTableFilter";
import { usePoolsTableSearch } from "../../hooks/usePoolsTableSearch";
import { ActiveLiquidity } from "./ManageLiquidityHeader";
import { AppDispatch } from "../../redux";
import { useDispatch } from "react-redux";
import { getTotalVotingPower } from "../../redux/pools";

export interface IShortCardProps {
  className?: string;
  poolsFilter?: AMM_TYPE;
  isConnectWalletRequired?: boolean;
  searchValue: string;
  setSearchValue?: Function;
}
export interface IManageBtnProps {
  isLiquidityAvailable: boolean;
  isStakeAvailable: boolean;
  tokenA: string;
  tokenB: string;
}
function compareNumericString(inp:any,inp2:any) {

  console.log("hello world -1",inp);
 const rowA=inp;
 const rowB=inp[1];
 const id='volume';
 const desc=false;
  let a = Number.parseFloat(rowA.original[id]);
  let b = Number.parseFloat(rowB.original[id]);
  if (Number.isNaN(a)) {  // Blanks and non-numeric strings to bottom
      a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (Number.isNaN(b)) {
      b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (a > b) return 1; 
  if (a < b) return -1;
  return 0;
}
export function ShortCard(props: IShortCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { valueFormat } = useTableNumberUtils();
  const { data: poolTableData = [], isFetched: isFetch = false } = usePoolsTableFilter(
    props.poolsFilter,
    ""
  );
  const [poolsTableData, isFetched] = usePoolsTableSearch(
    poolTableData,
    props.searchValue,
    isFetch
  );
  const [activeState, setActiveState] = React.useState<ActiveLiquidity | string>(
    ActiveLiquidity.Liquidity
  );
  const [showLiquidityModal, setShowLiquidityModal] = React.useState(false);
  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  const [tokenIn, setTokenIn] = React.useState<tokenParameterLiquidity>({
    name: "USDC.e",
    image: `/assets/tokens/USDC.e.png`,
    symbol: "USDC.e",
  });
  const [tokenOut, setTokenOut] = React.useState<tokenParameterLiquidity>({
    name: "USDT.e",
    image: `/assets/tokens/USDT.e.png`,
    symbol: "USDT.e",
  });
  const tEZorCTEZtoUppercase = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;

  const mobilecolumns = React.useMemo<Column<IPoolsDataWrapperResponse>[]>(
    () => [
      {
        Header: "Pools",
        id: "pools",
        showOnMobile: true,
        accessor: (x) => (
          <div className="flex gap-1 items-center max-w-[153px]">
            <CircularImageInfo
              isSecoundIconBorder
              className="w-7 h-7"
              imageArray={[getImagesPath(x.tokenA.toString()), getImagesPath(x.tokenB.toString())]}
            />
            <div className="flex flex-col gap-[2px]">
              <span className="md:text-f14 text-f12 text-white ">
                {tEZorCTEZtoUppercase(x.tokenA.toString())}/
                {tEZorCTEZtoUppercase(x.tokenB.toString())}
              </span>
              <span className="text-f12 text-text-500">{x.poolType} Pool</span>
            </div>
          </div>
        ),
      },
      {
        Header: "APR",
        id: "apr",
        subText: "current Epoch",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        accessorFn:(x:any)=>parseInt(x.arp),
        accessor: (x) => (
          <AprInfo
            currentApr={x.apr.toString()}
            previousApr={x.prevApr.toString()}
            boostedApr={x.boostedApr.toString()}
            isMobile={true}
          />
        ),
      },
      {
        Header: "",
        id: "lools",
        minWidth: 151,
        accessor: (x) => (
          <ManageBtn
            isLiquidityAvailable={x.isLiquidityAvailable}
            isStakeAvailable={x.isStakeAvailable}
            tokenA={x.tokenA.toString()}
            tokenB={x.tokenB.toString()}
          />
        ),
      },
    ],
    [valueFormat]
  );
  const desktopcolumns = React.useMemo<Column<IPoolsDataWrapperResponse>[]>(
    () => [
      {
        Header: "Pools",
        id: "pools",
        showOnMobile: true,
        accessor: (x) => (
          <div className="flex gap-2 items-center max-w-[153px]">
            <CircularImageInfo
            isSecoundIconBorder
              imageArray={[getImagesPath(x.tokenA.toString()), getImagesPath(x.tokenB.toString())]}
            />
            <div className="flex flex-col gap-[2px]">
              <span className="md:text-f14 text-f12 text-white ">
                {tEZorCTEZtoUppercase(x.tokenA.toString())}/
                {tEZorCTEZtoUppercase(x.tokenB.toString())}
              </span>
              <span className="text-f12 text-text-500 progTitle">{x.poolType} Pool</span>
            </div>
          </div>
        ),
      },
      {
        Header: "APR",
        id: "apr",
        subText: "current Epoch",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => (
          <AprInfo
            currentApr={valueFormat(x.apr, { percentChange: true }).toString()}
            previousApr={x.prevApr.toString()}
            boostedApr={valueFormat(x.boostedApr, { percentChange: true }).toString()}
          />
        ),
      },
      {
        Header: "Volume",
        id: "Volume24h",
        subText: "24h",
        isToolTipEnabled: true,
        canShort: true,
        sortType:(a:any,b:any)=>compareNumericString(a,b),
        accessor: (x:any) => (
          <PoolsTextWithTooltip
            text={valueFormat(x.volume.toNumber())}
            token1={x.volumeTokenA.toString()}
            token2={x.volumeTokenB.toString()}
            token1Name={x.tokenA.toString()}
            token2Name={x.tokenB.toString()}
          />
        ),
      },
      {
        Header: "TVL",
        id: "TVL",
        isToolTipEnabled: true,
        canShort: true,
        accessor: (x) => (
          <PoolsTextWithTooltip
            text={valueFormat(x.tvl.toNumber())}
            token1={x.tvlTokenA.toString()}
            token2={x.tvlTokenB.toString()}
            token1Name={x.tokenA.toString()}
            token2Name={x.tokenB.toString()}
          />
        ),
      },
      {
        Header: "Fees",
        id: "fees",
        subText: "current epoch",
        isToolTipEnabled: true,
        canShort: true,
        accessor: (x) => (
          <PoolsTextWithTooltip
            text={valueFormat(x.fees.toNumber())}
            token1={x.feesTokenA.toString()}
            token2={x.feesTokenB.toString()}
            token1Name={x.tokenA.toString()}
            token2Name={x.tokenB.toString()}
          />
        ),
      },
      {
        Header: "Bribes",
        id: "Bribes",
        isToolTipEnabled: true,
        accessor: (x) => <PoolsText text={valueFormat(x.bribeUSD.toNumber())} />,
      },
      {
        Header: "",
        id: "lools",
        minWidth: 151,
        accessor: (x) => (
          <ManageBtn
            isLiquidityAvailable={x.isLiquidityAvailable}
            isStakeAvailable={x.isStakeAvailable}
            tokenA={x.tokenA.toString()}
            tokenB={x.tokenB.toString()}
          />
        ),
      },
    ],
    [valueFormat]
  );

  function ManageBtn(props: IManageBtnProps): any {
    return (
      <div
        className="bg-primary-500/10 hover:bg-primary-500/20 cursor-pointer  text-primary-500 px-7 py-2 rounded-lg"
        onClick={() => {
          dispatch(getTotalVotingPower());
          props.isLiquidityAvailable
            ? props.isStakeAvailable
              ? setActiveState(ActiveLiquidity.Rewards)
              : setActiveState(ActiveLiquidity.Staking)
            : setActiveState(ActiveLiquidity.Liquidity);
          setShowLiquidityModal(true);
          setTokenIn({
            name: props.tokenA,
            image: getImagesPath(props.tokenA.toString()),
            symbol: props.tokenA,
          });
          setTokenOut({
            name: props.tokenB,
            image: getImagesPath(props.tokenB.toString()),
            symbol: props.tokenB,
          });
        }}
      >
        Manage
      </div>
    );
  }
  return (
    <>
      {showLiquidityModal && (
        <ManageLiquidity
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          closeFn={setShowLiquidityModal}
          setActiveState={setActiveState}
          activeState={activeState}
        />
      )}
      <div className={` overflow-x-auto inner ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={[...poolsTableData,...poolsTableData,...poolsTableData,...poolsTableData,...poolsTableData,...poolsTableData]}
          shortby="fees"
          isFetched={isFetched}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableWidth="md:min-w-[1032px]"
        />
      </div>
    </>
  );
}
