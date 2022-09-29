import * as React from "react";
import Image from "next/image";
import { Column } from "react-table";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { IVotesTableProps } from "./types";
import { RewardsData } from "./RewardsData";
import { TotalVotes } from "./TotalVotes";
import { MyVotes } from "./MyVotes";
import { IVotePageData, IVotesData } from "../../api/votes/types";
import { MyVotesValue } from "./MyVotesValue";
import { compareNumericString } from "../../utils/commonUtils";

export function VotesTable(props: IVotesTableProps) {
  const { valueFormat } = useTableNumberUtils();

  const votesArray = Object.entries(props.voteData);
  const [totalVotes1, setTotalVotes1] = React.useState<number[]>(
    new Array(votesArray.length).fill(0)
  );
  const [noSearchResult, setNoSearchResult] = React.useState(false);
  const votedataArray = React.useMemo(() => {
    votesArray.map((data, index) => {
      totalVotes1[index] = Number(data[1].myVotesPercentage.toFixed(0));
    });

    return votesArray.map((data, index) => ({
      index: index,
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
          e.votes.tokenB.toLowerCase().includes(props.searchValue.toLowerCase()) ||
          (props.searchValue.toLowerCase() === "xtz" &&
            e.votes.tokenA.toLowerCase().search(/\btez\b/) >= 0) ||
          (props.searchValue.toLowerCase() === "xtz" &&
            e.votes.tokenB.toLowerCase().search(/\btez\b/) >= 0)
        );
      });
      if (_votesTableData.length === 0) {
        setNoSearchResult(true);
      } else {
        setNoSearchResult(false);
      }
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
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "votes.tokenA", true),
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center">
              <Image
                alt={"alt"}
                src={getImagesPath(x.votes.tokenA)}
                width={"20px"}
                height={"20px"}
              />
            </div>
            <div className="w-[24px] relative -left-2 bg-card-600 rounded-full h-[24px] flex justify-center items-center">
              <Image
                alt={"alt"}
                src={getImagesPath(x.votes.tokenB)}
                width={"20px"}
                height={"20px"}
              />
            </div>
            <div>
              <div className="font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.votes.tokenA.toString())}/
                {tEZorCTEZtoUppercase(x.votes.tokenB.toString())}
              </div>
              <div className="font-subtitle1 text-text-500">{x.votes.poolType} Pool</div>
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
        sortType: (a: any, b: any) => compareNumericString(a, b, "votes.bribes"),
        accessor: (x: any) => (
          <RewardsData
            bribes={x.votes.bribes}
            fees={x.votes.fees}
            token1Name={tEZorCTEZtoUppercase(x.votes.tokenA.toString())}
            token2Name={tEZorCTEZtoUppercase(x.votes.tokenB.toString())}
            fees1={Number(x.votes.feesTokenA)}
            fees2={Number(x.votes.feesTokenB)}
            bribesData={x.votes.bribesData}
          />
        ),
      },
      {
        Header: "Votes",
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
            totalVotesPercentage={Number(x.votes.myVotesPercentage)}
            isCurrentEpoch={props.isCurrentEpoch}
            index={x.index}
            votedata={votedata}
            totalVotes1={totalVotes1}
            sumOfVotes={props.sumOfVotes}
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
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "votes.tokenA", true),
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
              <Image
                alt={"alt"}
                src={getImagesPath(x.votes.tokenA)}
                width={"24px"}
                height={"24px"}
              />
            </div>
            <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
              <Image
                alt={"alt"}
                src={getImagesPath(x.votes.tokenB)}
                width={"24px"}
                height={"24px"}
              />
            </div>
            <div>
              <div className="font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.votes.tokenA.toString())}/
                {tEZorCTEZtoUppercase(x.votes.tokenB.toString())}
              </div>
              <div className="font-subtitle1 text-text-500">{x.votes.poolType} Pool</div>
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
        sortType: (a: any, b: any) => compareNumericString(a, b, "votes.bribes"),
        accessor: (x: any) => (
          <RewardsData
            bribes={x.votes.bribes}
            fees={x.votes.fees}
            token1Name={tEZorCTEZtoUppercase(x.votes.tokenA.toString())}
            token2Name={tEZorCTEZtoUppercase(x.votes.tokenB.toString())}
            fees1={Number(x.votes.feesTokenA)}
            fees2={Number(x.votes.feesTokenB)}
            bribesData={x.votes.bribesData}
          />
        ),
      },
      {
        Header: "Total votes",
        id: "Total votes",
        canShort: true,
        isToolTipEnabled: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "votes.totalVotesPercentage"),
        accessor: (x: any) => (
          <TotalVotes
            totalvotes={x.votes.totalVotes}
            totalVotesPercentage={x.votes.totalVotesPercentage}
          />
        ),
      },
      {
        Header: "My votes",
        id: "Myvotes",
        sortType: (a: any, b: any) => compareNumericString(a, b, "votes.myVotesPercentage"),
        isToolTipEnabled: true,
        canShort: true,

        accessor: (x: any) => (
          <MyVotesValue myVotes={x.votes.myVotes} myVotesPercentage={x.votes.myVotesPercentage} />
        ),
      },
      {
        Header: "Votes",
        id: "Myvotess",
        isToolTipEnabled: true,
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "votes.totalVotes"),

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
            totalVotesPercentage={Number(x.votes.myVotesPercentage)}
            isCurrentEpoch={props.isCurrentEpoch}
            index={x.index}
            votedata={votedata}
            totalVotes1={totalVotes1}
            sumOfVotes={props.sumOfVotes}
          />
        ),
      },
    ],
    [valueFormat]
  );

  return (
    <>
      <div className={`overflow-x-auto  ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={votedata}
          noSearchResult={noSearchResult}
          shortby="Myvotes"
          isFetched={!noSearchResult && votedata.length === 0 ? false : true}
          isConnectWalletRequired={props.isConnectWalletRequired}
          isVotesTable={true}
          TableName="votesTable"
          TableWidth="md:min-w-[805px]"
        />
      </div>
    </>
  );
}
