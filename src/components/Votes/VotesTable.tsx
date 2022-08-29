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
import { MyVotesValue } from "./MyVotesValue";

export function VotesTable(props: IVotesTableProps) {
  const { valueFormat } = useTableNumberUtils();

  const votesArray = Object.entries(props.voteData);

  const votedataArray = React.useMemo(() => {
    return votesArray.map((data) => ({
      amm: data[0],
      votes: data[1],
    }));
  }, [votesArray.length]);

  const [votedata, setVotedata] = React.useState(votedataArray);

  React.useEffect(() => {
    if (votedataArray.length !== 0) setVotedata(votedataArray);
    else setVotedata([]);
  }, [votedataArray.length]);
  React.useEffect(() => {
    if (props.searchValue && props.searchValue.length) {
      const _votesTableData = votedataArray.filter((e: any) => {
        return (
          e.votes.tokenA.toLowerCase().includes(props.searchValue.toLowerCase()) ||
          e.votes.tokenB.toLowerCase().includes(props.searchValue.toLowerCase())
        );
      });
      setVotedata(_votesTableData);
    } else {
      setVotedata(votedataArray);
    }
  }, [props.searchValue]);

  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  const tEZorCTEZtoUppercase = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;

  const mobilecolumns = React.useMemo<Column<IVotePageData>[]>(
    () => [
      {
        Header: "Pools",
        id: "pools",
        showOnMobile: true,
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center">
              <Image src={getImagesPath(x.votes.tokenA)} width={"20px"} height={"20px"} />
            </div>
            <div className="w-[24px] relative -left-2 bg-card-600 rounded-full h-[24px] flex justify-center items-center">
              <Image src={getImagesPath(x.votes.tokenB)} width={"20px"} height={"20px"} />
            </div>
            <div>
              <div className="font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.votes.tokenA.toString())}/
                {tEZorCTEZtoUppercase(x.votes.tokenB.toString())}
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
        accessor: (x: any) => <RewardsData bribes={x.votes.bribes} fees={x.votes.fees} />,
      },
      {
        Header: "My votes",
        id: "Myvotess",
        isToolTipEnabled: true,
        canShort: true,
        accessor: (x: any) => (
          <MyVotes
            isMobile={true}
            tokenA={tEZorCTEZtoUppercase(x.votes.tokenA.toString())}
            tokenB={tEZorCTEZtoUppercase(x.votes.tokenB.toString())}
            setSelectedPools={props.setSelectedPools}
            selectedPools={props.selectedPools}
            setTotalVotingPower={props.setTotalVotingPower}
            totalVotingPower={props.totalVotingPower}
            amm={x.amm}
            setVotes={props.setVotes}
            votes={props.votes}
            selectedDropDown={props.selectedDropDown}
            totalVotesPercentage={Number(x.votes.totalVotesPercentage)}
            isCurrentEpoch={props.isCurrentEpoch}
          />
        ),
      },
    ],
    [valueFormat]
  );

  const desktopcolumns = React.useMemo<Column<IVotePageData>[]>(
    () => [
      {
        Header: "Pools",
        id: "pools",
        showOnMobile: true,
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
              <Image src={getImagesPath(x.votes.tokenA)} width={"24px"} height={"24px"} />
            </div>
            <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
              <Image src={getImagesPath(x.votes.tokenB)} width={"24px"} height={"24px"} />
            </div>
            <div>
              <div className="font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.votes.tokenA.toString())}/
                {tEZorCTEZtoUppercase(x.votes.tokenB.toString())}
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
        accessor: (x: any) => <RewardsData bribes={x.votes.bribes} fees={x.votes.fees} />,
      },
      {
        Header: "Total votes",
        id: "Total votes",
        isToolTipEnabled: true,
        accessor: (x: any) => (
          <TotalVotes
            totalvotes={Number(x.votes.totalVotes)}
            totalVotesPercentage={Number(x.votes.totalVotesPercentage)}
          />
        ),
      },
      {
        Header: "My votes",
        id: "Myvotes",

        isToolTipEnabled: true,
        canShort: true,
        accessor: (x: any) => (
          <MyVotesValue
            myVotes={Number(x.votes.myVotes)}
            myVotesPercentage={Number(x.votes.myVotesPercentage)}
          />
        ),
      },
      {
        Header: "My votes",
        id: "Myvotess",
        isToolTipEnabled: true,
        canShort: true,
        accessor: (x: any) => (
          <MyVotes
            isMobile={false}
            tokenA={tEZorCTEZtoUppercase(x.votes.tokenA.toString())}
            tokenB={tEZorCTEZtoUppercase(x.votes.tokenB.toString())}
            setSelectedPools={props.setSelectedPools}
            selectedPools={props.selectedPools}
            setTotalVotingPower={props.setTotalVotingPower}
            totalVotingPower={props.totalVotingPower}
            amm={x.amm}
            votes={props.votes}
            setVotes={props.setVotes}
            selectedDropDown={props.selectedDropDown}
            totalVotesPercentage={Number(x.votes.totalVotesPercentage)}
            isCurrentEpoch={props.isCurrentEpoch}
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
