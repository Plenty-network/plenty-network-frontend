import * as React from "react";
import Image from "next/image";
import { Column } from "react-table";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { IVotePageData, IVotesData } from "../../api/votes/types";
import { IManageBtnProps, IPoolsTablePosition } from "./types";
import { ManageLiquidity } from "../Pools/ManageLiquidity";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { ActiveLiquidity } from "../Pools/ManageLiquidityHeader";
import { IPositionsData } from "../../api/portfolio/types";
import { YourLiquidity } from "./YourLiquidity";
import { StakePercentage } from "./StakedPercentage";
import { BoostValue } from "./BoostValue";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux";
import { getTotalVotingPower } from "../../redux/pools";

export function PoolsTablePosition(props: IPoolsTablePosition) {
  const dispatch = useDispatch<AppDispatch>();
  const { valueFormat } = useTableNumberUtils();
  const [showLiquidityModal, setShowLiquidityModal] = React.useState(false);

  const [activeState, setActiveState] = React.useState<ActiveLiquidity | string>(
    ActiveLiquidity.Liquidity
  );
  const [noSearchResult, setNoSearchResult] = React.useState(false);

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

  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  const tEZorCTEZtoUppercase = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;

  const mobilecolumns = React.useMemo<Column<IPositionsData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pools",
        showOnMobile: true,
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center">
              <Image alt={"alt"} src={getImagesPath(x.tokenA)} width={"20px"} height={"20px"} />
            </div>
            <div className="w-[24px] relative -left-2 bg-card-600 rounded-full h-[24px] flex justify-center items-center">
              <Image alt={"alt"} src={getImagesPath(x.tokenB)} width={"20px"} height={"20px"} />
            </div>
            <div>
              <div className="font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.tokenA.toString())}/
                {tEZorCTEZtoUppercase(x.tokenB.toString())}
              </div>
              <div className="font-subtitle1 text-text-500">{x.ammType} Pool</div>
            </div>
          </div>
        ),
      },
      {
        Header: "Your liquidity",
        id: "your liquidity",
        isToolTipEnabled: true,
        canShort: true,
        accessorFn: (x: any) => x.totalLiquidityAmount,
        showOnMobile: true,
        accessor: (x: any) => <YourLiquidity value={x.totalLiquidityAmount} />,
      },
      {
        Header: "",
        id: "manage",
        minWidth: 151,
        accessor: (x) => (
          <ManageBtn
            isManage={Number(x.stakedPercentage) > 0}
            tokenA={x.tokenA.toString()}
            tokenB={x.tokenB.toString()}
          />
        ),
      },
    ],
    [valueFormat]
  );

  const desktopcolumns = React.useMemo<Column<IPositionsData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pool",
        showOnMobile: true,
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
              <Image alt={"alt"} src={getImagesPath(x.tokenA)} width={"24px"} height={"24px"} />
            </div>
            <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
              <Image alt={"alt"} src={getImagesPath(x.tokenB)} width={"24px"} height={"24px"} />
            </div>
            <div>
              <div className="font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.tokenA.toString())}/
                {tEZorCTEZtoUppercase(x.tokenB.toString())}
              </div>
              <div className="font-subtitle1 text-text-500">{x.ammType} Pool</div>
            </div>
          </div>
        ),
      },
      {
        Header: "Your liquidity",
        id: "Your liquidity",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => <YourLiquidity value={x.totalLiquidityAmount} />,
      },
      {
        Header: `Staked percentage`,
        id: "Staked percentage",

        canShort: true,
        isToolTipEnabled: true,
        accessor: (x: any) => <StakePercentage value={x.stakedPercentage} />,
      },
      {
        Header: "your APR",
        id: "your APR",

        isToolTipEnabled: true,
        canShort: true,
        accessor: (x: any) => <StakePercentage value={x.userAPR} />,
      },
      {
        Header: "Boost",
        id: "Boost",
        isToolTipEnabled: true,
        canShort: true,
        accessor: (x: any) => <BoostValue value={x.boostValue} />,
      },
      {
        Header: "",
        id: "manage",
        minWidth: 151,
        accessor: (x) => (
          <ManageBtn
            isManage={Number(x.stakedPercentage) > 0}
            tokenA={x.tokenA.toString()}
            tokenB={x.tokenB.toString()}
          />
        ),
      },
    ],
    [valueFormat]
  );
  function ManageBtn(props: IManageBtnProps): any {
    if (props.isManage) {
      return (
        <div
          className="bg-primary-500/10 md:w-[151px] w-[115px] cursor-pointer  text-primary-500 hover:opacity-90  font-subtitle4 rounded-lg flex items-center h-[40px] justify-center"
          onClick={() => {
            setShowLiquidityModal(true);
            dispatch(getTotalVotingPower());
            props.isManage
              ? setActiveState(ActiveLiquidity.Liquidity)
              : setActiveState(ActiveLiquidity.Staking);

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
    } else {
      return (
        <div
          className="bg-primary-500 md:w-[151px] w-[115px] cursor-pointer font-subtitle4 text-black hover:opacity-90  rounded-lg flex items-center justify-center h-[40px]"
          onClick={() => {
            setShowLiquidityModal(true);
            dispatch(getTotalVotingPower());
            props.isManage
              ? setActiveState(ActiveLiquidity.Liquidity)
              : setActiveState(ActiveLiquidity.Staking);

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
          Stake
        </div>
      );
    }
  }
  return (
    <>
      <div className={` overflow-x-auto inner ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={props.poolsPosition}
          noSearchResult={noSearchResult}
          shortby="Myvotes"
          isFetched={props.poolsPosition.length === 0 ? false : true}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableName="poolsPosition"
          TableWidth="md:min-w-[900px]"
        />
      </div>
      {showLiquidityModal && (
        <ManageLiquidity
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          closeFn={setShowLiquidityModal}
          setActiveState={setActiveState}
          activeState={activeState}
        />
      )}
    </>
  );
}
