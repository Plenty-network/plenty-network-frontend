import * as React from "react";

import Image from "next/image";
import { Column } from "react-table";
import { usePoolsMain } from "../../api/pools/query/poolsmain.query";
import { IPoolsDataWrapperResponse } from "../../api/pools/types";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { isMobile } from "react-device-detect";
import { IVotesTableProps } from "./types";
import { RewardsData } from "./RewardsData";
import { TotalVotes } from "./TotalVotes";
import { MyVotes } from "./MyVotes";
import { IVotePageData, IVotesData } from "../../api/votes/types";

export function VotesTable(props: IVotesTableProps) {
  const { valueFormat } = useTableNumberUtils();

  //const data: IVotePageData[] = Object.values(props.voteData);
  const { data: poolTableData = [] } = usePoolsMain();
  const [votedata, setVotedata] = React.useState(poolTableData);

  React.useEffect(() => {
    if (poolTableData.length !== 0) setVotedata(poolTableData);
  }, [poolTableData]);
  React.useEffect(() => {
    if (props.searchValue && props.searchValue.length) {
      const _poolsTableData = poolTableData.filter((e: any) => {
        return (
          e.tokenA.toLowerCase().includes(props.searchValue.toLowerCase()) ||
          e.tokenB.toLowerCase().includes(props.searchValue.toLowerCase())
        );
      });
      setVotedata(_poolsTableData);
    } else {
      setVotedata(poolTableData);
    }
  }, [props.searchValue]);

  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  const tEZorCTEZtoUppercase = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;
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
  const mobilecolumns = React.useMemo<Column<IPoolsDataWrapperResponse>[]>(
    () => [
      {
        Header: "Pools",
        id: "pools",
        showOnMobile: true,
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center">
              <Image src={getImagesPath(x.tokenA)} width={"20px"} height={"20px"} />
            </div>
            <div className="w-[24px] relative -left-2 bg-card-600 rounded-full h-[24px] flex justify-center items-center">
              <Image src={getImagesPath(x.tokenB)} width={"20px"} height={"20px"} />
            </div>
            <div>
              <div className="font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.tokenA.toString())}/
                {tEZorCTEZtoUppercase(x.tokenB.toString())}
              </div>
              <div className="font-subtitle1 text-text-500">Stable Pool</div>
            </div>
          </div>
        ),
      },
      {
        Header: "Rewards",
        id: "Rewards",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => <RewardsData />,
      },
      {
        Header: "My votes",
        id: "Myvotess",
        isToolTipEnabled: true,
        canShort: true,
        accessor: (x) => (
          <MyVotes
            isMobile={true}
            tokenA={tEZorCTEZtoUppercase(x.tokenA.toString())}
            tokenB={tEZorCTEZtoUppercase(x.tokenB.toString())}
            setSelectedPools={props.setSelectedPools}
            selectedPools={props.selectedPools}
            setTotalVotingPower={props.setTotalVotingPower}
            totalVotingPower={props.totalVotingPower}
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
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
              <Image src={getImagesPath(x.tokenA)} width={"24px"} height={"24px"} />
            </div>
            <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
              <Image src={getImagesPath(x.tokenB)} width={"24px"} height={"24px"} />
            </div>
            <div>
              <div className="font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.tokenA.toString())}/
                {tEZorCTEZtoUppercase(x.tokenB.toString())}
              </div>
              <div className="font-subtitle1 text-text-500">Stable Pool</div>
            </div>
          </div>
        ),
      },
      {
        Header: "Rewards",
        id: "Rewards",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => <RewardsData />,
      },
      {
        Header: "Total votes",
        id: "Total votes",
        isToolTipEnabled: true,
        accessor: (x) => <TotalVotes />,
      },
      {
        Header: "My votes",
        id: "Myvotes",

        isToolTipEnabled: true,
        canShort: true,
        accessor: (x) => "-",
      },
      {
        Header: "My votes",
        id: "Myvotess",
        isToolTipEnabled: true,
        canShort: true,
        accessor: (x) => (
          <MyVotes
            isMobile={false}
            tokenA={tEZorCTEZtoUppercase(x.tokenA.toString())}
            tokenB={tEZorCTEZtoUppercase(x.tokenB.toString())}
            setSelectedPools={props.setSelectedPools}
            selectedPools={props.selectedPools}
            setTotalVotingPower={props.setTotalVotingPower}
            totalVotingPower={props.totalVotingPower}
          />
        ),
      },
    ],
    [valueFormat]
  );

  return (
    <>
      <div className={`w-full  ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={votedata}
          shortby="Myvotes"
          isFetched={votedata.length === 0 ? false : true}
          isConnectWalletRequired={props.isConnectWalletRequired}
        />
      </div>
    </>
  );
}
