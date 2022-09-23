import * as React from "react";
import Image from "next/image";
import { Column } from "react-table";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { IVotePageData, IVotesData } from "../../api/votes/types";
import { ManageLiquidity } from "../Pools/ManageLiquidity";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { ActiveLiquidity } from "../Pools/ManageLiquidityHeader";
import { IPoolsTableRewards } from "./types";
import { IManageBtnProps } from "../PoolsPosition/types";
import ClaimPly from "./ClaimPopup";
import { IPoolsRewardsData } from "../../api/portfolio/types";
import { PLYEmission } from "./PLYEmisiion";
import { Boost } from "./Boost";

export function PoolsTableRewards(props: IPoolsTableRewards) {
  console.log(props.poolsData);
  const { valueFormat } = useTableNumberUtils();
  const [showLiquidityModal, setShowLiquidityModal] = React.useState(false);
  const [showClaimPly, setShowClaimPly] = React.useState(false);

  //const votesArray = Object.entries(props.voteData);
  // const [totalVotes1, setTotalVotes1] = React.useState<number[]>(
  //   new Array(votesArray.length).fill(0)
  // );
  const [activeState, setActiveState] = React.useState<ActiveLiquidity | string>(
    ActiveLiquidity.Liquidity
  );
  const [noSearchResult, setNoSearchResult] = React.useState(false);
  // const votedataArray = React.useMemo(() => {
  //   votesArray.map((data, index) => {
  //     totalVotes1[index] = Number(data[1].myVotesPercentage.toFixed(0));
  //   });

  //   return votesArray.map((data, index) => ({
  //     index: index,
  //     amm: data[0],
  //     votes: data[1],
  //   }));
  // }, [votesArray.length]);
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
  //const [votedata, setVotedata] = React.useState(votedataArray);
  // React.useEffect(() => {
  //   if (votedataArray.length !== 0) setVotedata(votedataArray);
  //   else setVotedata([]);
  // }, [votedataArray.length]);
  // React.useEffect(() => {
  //   if (props.searchValue && props.searchValue.length) {
  //     const _votesTableData = votedataArray.filter((e: any) => {
  //       return (
  //         e.votes.tokenA.toLowerCase().includes(props.searchValue.toLowerCase()) ||
  //         e.votes.tokenB.toLowerCase().includes(props.searchValue.toLowerCase()) ||
  //         (props.searchValue.toLowerCase() === "xtz" &&
  //           e.votes.tokenA.toLowerCase().search(/\btez\b/) >= 0) ||
  //         (props.searchValue.toLowerCase() === "xtz" &&
  //           e.votes.tokenB.toLowerCase().search(/\btez\b/) >= 0)
  //       );
  //     });
  //     if (_votesTableData.length === 0) {
  //       setNoSearchResult(true);
  //     } else {
  //       setNoSearchResult(false);
  //     }
  //     setVotedata(_votesTableData);
  //   } else {
  //     setVotedata(votedataArray);
  //   }
  // }, [props.searchValue]);

  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  const tEZorCTEZtoUppercase = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;

  const mobilecolumns = React.useMemo<Column<IPoolsRewardsData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pools",
        showOnMobile: true,
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center">
              <Image src={getImagesPath(x.tokenOneSymbol)} width={"20px"} height={"20px"} />
            </div>
            <div className="w-[24px] relative -left-2 bg-card-600 rounded-full h-[24px] flex justify-center items-center">
              <Image src={getImagesPath(x.tokenTwoSymbol)} width={"20px"} height={"20px"} />
            </div>
            <div>
              <div className="font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.tokenOneSymbol.toString())}/
                {tEZorCTEZtoUppercase(x.tokenTwoSymbol.toString())}
              </div>
              <div className="font-subtitle1 text-text-500">{x.ammType} Pool</div>
            </div>
          </div>
        ),
      },
      {
        Header: "PLY emissions",
        id: "PLY emissions",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => <PLYEmission value={x.gaugeEmission} />,
      },
    ],
    [valueFormat]
  );

  const desktopcolumns = React.useMemo<Column<IPoolsRewardsData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pool",
        showOnMobile: true,
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
              <Image src={getImagesPath(x.tokenOneSymbol)} width={"24px"} height={"24px"} />
            </div>
            <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
              <Image src={getImagesPath(x.tokenTwoSymbol)} width={"24px"} height={"24px"} />
            </div>
            <div>
              <div className="font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.tokenOneSymbol.toString())}/
                {tEZorCTEZtoUppercase(x.tokenTwoSymbol.toString())}
              </div>
              <div className="font-subtitle1 text-text-500">{x.ammType} Pool</div>
            </div>
          </div>
        ),
      },
      {
        Header: "Reward",
        id: "Reward",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => <PLYEmission value={x.gaugeEmission} />,
      },

      {
        Header: "Boost",
        id: "Boost",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => <Boost value={x.boostValue} />,
      },
    ],
    [valueFormat]
  );

  return (
    <>
      <div className={` overflow-x-auto inner ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={props.poolsData}
          noSearchResult={noSearchResult}
          shortby="Myvotes"
          isFetched={props.poolsData?.length === 0 ? false : true}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableName="poolsRewards"
          TableWidth=""
        />
      </div>
      {showClaimPly && <ClaimPly show={showClaimPly} setShow={setShowClaimPly} />}
    </>
  );
}
