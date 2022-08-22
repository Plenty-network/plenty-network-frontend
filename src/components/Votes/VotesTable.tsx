import * as React from "react";

import Image from "next/image";
import { Column } from "react-table";
import { usePoolsMain } from "../../api/pools/query/poolsmain.query";
import { IPoolsDataWrapperResponse } from "../../api/pools/types";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { isMobile } from "react-device-detect";
import { IManageBtnProps, IVotesTableProps } from "./types";
import { CircularImageInfo } from "../Pools/Component/CircularImageInfo";
import { RewardsData } from "./RewardsData";
import { TotalVotes } from "./TotalVotes";

export function VotesTable(props: IVotesTableProps) {
  const { valueFormat } = useTableNumberUtils();

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
          <div className="flex gap-1 items-center max-w-[153px]">
            <CircularImageInfo
              className="w-7 h-7"
              imageArray={[getImagesPath("ctez"), getImagesPath("tez")]}
            />
            <div className="flex flex-col gap-[2px]">
              <span className="text-f14 text-white ">
                {x.tokenA}/{x.tokenB}
              </span>
              <span className="text-f12 text-text-500">Stable Pool</span>
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
        accessor: (x: any) => "2334",
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
                {x.tokenA}/{x.tokenB}
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
        accessor: (x) => "--",
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
