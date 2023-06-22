import Image from "next/image";
import * as React from "react";
import { isMobile, isTablet } from "react-device-detect";
import { Column } from "react-table";
import {
  changeSource,
  nFormatterWithLesserNumber,
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";
import { IVotePageData } from "../../api/votes/types";
import { tokenIcons } from "../../constants/tokensList";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import { useAppSelector } from "../../redux";
import { compareNumericString, compareNumericStringRewards } from "../../utils/commonUtils";
import Table from "../Table/Table";
import { MyVotes } from "./MyVotes";
import { MyVotesValue } from "./MyVotesValue";
import { RewardsData } from "./RewardsData";
import { TotalVotes } from "./TotalVotes";
import { IVotesTableProps } from "./types";

export function VotesTable(props: IVotesTableProps) {
  const { valueFormat } = useTableNumberUtils();
  const tokens = useAppSelector((state) => state.config.tokens);
  const currentEpoch = useAppSelector((state) => state.epoch.currentEpoch);
  const epochData = useAppSelector((state) => state.epoch.epochData);
  const selectedEpoch = useAppSelector((state) => state.epoch.selectedEpoch);
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
          e.votes.tokenA.toLowerCase().includes(props.searchValue.trim().toLowerCase()) ||
          e.votes.tokenB.toLowerCase().includes(props.searchValue.trim().toLowerCase()) ||
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
      setNoSearchResult(false);
      setVotedata(votedataArray);
    }
  }, [props.searchValue]);

  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };

  const mobilecolumns = React.useMemo<Column<IVotePageData>[]>(
    () => [
      {
        Header: "Pools",
        id: "pools",
        columnWidth: "w-[150px]",
        showOnMobile: true,
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "votes.tokenA", true),
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center">
              <img
                alt={"alt"}
                src={
                  tEZorCTEZtoUppercase(x.votes.tokenA) === "CTEZ"
                    ? tokenIcons[x.votes.tokenB]
                      ? tokenIcons[x.votes.tokenB].src
                      : tokens[x.votes.tokenB]?.iconUrl
                      ? tokens[x.votes.tokenB].iconUrl
                      : `/assets/Tokens/fallback.png`
                    : tokenIcons[x.votes.tokenA]
                    ? tokenIcons[x.votes.tokenA].src
                    : tokens[x.votes.tokenA]?.iconUrl
                    ? tokens[x.votes.tokenA].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"20px"}
                height={"20px"}
                onError={changeSource}
              />
            </div>
            <div className="w-[24px] relative -left-2 bg-card-600 rounded-full h-[24px] flex justify-center items-center">
              <img
                alt={"alt"}
                src={
                  tEZorCTEZtoUppercase(x.votes.tokenA) === "CTEZ"
                    ? tokenIcons[x.votes.tokenA]
                      ? tokenIcons[x.votes.tokenA].src
                      : tokens[x.votes.tokenA]?.iconUrl
                      ? tokens[x.votes.tokenA].iconUrl
                      : `/assets/Tokens/fallback.png`
                    : tokenIcons[x.votes.tokenB]
                    ? tokenIcons[x.votes.tokenB].src
                    : tokens[x.votes.tokenB]?.iconUrl
                    ? tokens[x.votes.tokenB].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"20px"}
                height={"20px"}
                onError={changeSource}
              />
            </div>
            <div>
              <div className="font-body2 md:font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.votes.tokenA) === "CTEZ"
                  ? ` ${tEZorCTEZtoUppercase(x.votes.tokenB?.toString())} / ${tEZorCTEZtoUppercase(
                      x.votes.tokenA?.toString()
                    )}`
                  : ` ${tEZorCTEZtoUppercase(x.votes.tokenA?.toString())} / ${tEZorCTEZtoUppercase(
                      x.votes.tokenB?.toString()
                    )}`}
              </div>
              <div className="font-subtitle1 text-text-500">{x.votes.poolType} Pool</div>
            </div>
          </div>
        ),
      },
      {
        Header: "Rewards",
        id: "Rewards",
        columnWidth: "w-[130px] flex-1 pr-2.5",
        isToolTipEnabled: true,
        tooltipMessage:
          "Trading fees and bribes to be distributed across the voters of this pool. The reward may increase as the epoch progresses.",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) =>
          compareNumericStringRewards(a, b, "votes.bribes", "votes.fees"),
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
        sortType: (a: any, b: any) => compareNumericString(a, b, "votes.totalVotes"),
        columnWidth: "w-[100px] ml-auto mr-2",
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
  const desktopcolumnsNFT = React.useMemo<Column<IVotePageData>[]>(
    () => [
      {
        Header: "Pools",
        id: "pools",
        showOnMobile: true,
        columnWidth: "w-[190px]",
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "votes.tokenA", true),
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center overflow-hidden">
              <img
                alt={"alt"}
                src={
                  tEZorCTEZtoUppercase(x.votes.tokenA) === "CTEZ"
                    ? tokenIcons[x.votes.tokenB]
                      ? tokenIcons[x.votes.tokenB].src
                      : tokens[x.votes.tokenB]?.iconUrl
                      ? tokens[x.votes.tokenB].iconUrl
                      : `/assets/Tokens/fallback.png`
                    : tokenIcons[x.votes.tokenA]
                    ? tokenIcons[x.votes.tokenA].src
                    : tokens[x.votes.tokenA]?.iconUrl
                    ? tokens[x.votes.tokenA].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"24px"}
                height={"24px"}
                onError={changeSource}
              />
            </div>
            <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center overflow-hidden">
              <img
                alt={"alt"}
                src={
                  tEZorCTEZtoUppercase(x.votes.tokenA) === "CTEZ"
                    ? tokenIcons[x.votes.tokenA]
                      ? tokenIcons[x.votes.tokenA].src
                      : tokens[x.votes.tokenA]?.iconUrl
                      ? tokens[x.votes.tokenA].iconUrl
                      : `/assets/Tokens/fallback.png`
                    : tokenIcons[x.votes.tokenB]
                    ? tokenIcons[x.votes.tokenB].src
                    : tokens[x.votes.tokenB]?.iconUrl
                    ? tokens[x.votes.tokenB].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"24px"}
                height={"24px"}
                onError={changeSource}
              />
            </div>
            <div>
              <div className="font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.votes.tokenA) === "CTEZ"
                  ? ` ${tEZorCTEZtoUppercase(x.votes.tokenB?.toString())} / ${tEZorCTEZtoUppercase(
                      x.votes.tokenA?.toString()
                    )}`
                  : ` ${tEZorCTEZtoUppercase(x.votes.tokenA?.toString())} / ${tEZorCTEZtoUppercase(
                      x.votes.tokenB?.toString()
                    )}`}
              </div>
              <div className="font-subtitle1 text-text-500">{x.votes.poolType} Pool</div>
            </div>
          </div>
        ),
      },
      {
        Header: "Rewards",
        id: "Rewards",
        columnWidth: "w-[112px]",
        tooltipMessage:
          "Trading fees and bribes to be distributed across the voters of this pool. The reward may increase as the epoch progresses.",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) =>
          compareNumericStringRewards(a, b, "votes.bribes", "votes.fees"),
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
        columnWidth: "w-[112px]",
        canShort: true,
        tooltipMessage: "Total votes received by the pool in the current epoch.",
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
        Header: "Max reward",
        id: "Max rewards",
        columnWidth: "w-[122px] pr-2.5",
        tooltipMessage: "Maximum possible reward if you vote entirely for the pool.",
        isToolTipEnabled: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "votes.expectedRewards"),
        canShort: true,

        accessor: (x: any) => (
          <span className="font-subtitle4">
            {props.selectedDropDown.tokenId === ""
              ? "-"
              : `$${nFormatterWithLesserNumber(x.votes.expectedRewards)}`}{" "}
          </span>
        ),
      },

      {
        Header: "Votes",
        id: "Myvotess",
        columnWidth: "w-[237px] ml-auto",
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
    [valueFormat, props]
  );
  const desktopcolumns = React.useMemo<Column<IVotePageData>[]>(
    () => [
      {
        Header: "Pools",
        id: "pools",
        showOnMobile: true,
        columnWidth: "w-[190px]",
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "votes.tokenA", true),
        accessor: (x: any) => (
          <div className=" flex justify-center items-center">
            <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center overflow-hidden">
              <img
                alt={"alt"}
                src={
                  tEZorCTEZtoUppercase(x.votes.tokenA) === "CTEZ"
                    ? tokenIcons[x.votes.tokenB]
                      ? tokenIcons[x.votes.tokenB].src
                      : tokens[x.votes.tokenB]?.iconUrl
                      ? tokens[x.votes.tokenB].iconUrl
                      : `/assets/Tokens/fallback.png`
                    : tokenIcons[x.votes.tokenA]
                    ? tokenIcons[x.votes.tokenA].src
                    : tokens[x.votes.tokenA]?.iconUrl
                    ? tokens[x.votes.tokenA].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"24px"}
                height={"24px"}
                onError={changeSource}
              />
            </div>
            <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center overflow-hidden">
              <img
                alt={"alt"}
                src={
                  tEZorCTEZtoUppercase(x.votes.tokenA) === "CTEZ"
                    ? tokenIcons[x.votes.tokenA]
                      ? tokenIcons[x.votes.tokenA].src
                      : tokens[x.votes.tokenA]?.iconUrl
                      ? tokens[x.votes.tokenA].iconUrl
                      : `/assets/Tokens/fallback.png`
                    : tokenIcons[x.votes.tokenB]
                    ? tokenIcons[x.votes.tokenB].src
                    : tokens[x.votes.tokenB]?.iconUrl
                    ? tokens[x.votes.tokenB].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                width={"24px"}
                height={"24px"}
                onError={changeSource}
              />
            </div>
            <div>
              <div className="font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.votes.tokenA) === "CTEZ"
                  ? ` ${tEZorCTEZtoUppercase(x.votes.tokenB?.toString())} / ${tEZorCTEZtoUppercase(
                      x.votes.tokenA?.toString()
                    )}`
                  : ` ${tEZorCTEZtoUppercase(x.votes.tokenA?.toString())} / ${tEZorCTEZtoUppercase(
                      x.votes.tokenB?.toString()
                    )}`}
              </div>
              <div className="font-subtitle1 text-text-500">{x.votes.poolType} Pool</div>
            </div>
          </div>
        ),
      },
      {
        Header: "Rewards",
        id: "Rewards",
        columnWidth: "w-[112px]",
        tooltipMessage:
          "Trading fees and bribes to be distributed across the voters of this pool. The reward may increase as the epoch progresses.",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) =>
          compareNumericStringRewards(a, b, "votes.bribes", "votes.fees"),
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
        columnWidth: "w-[112px]",
        canShort: true,
        tooltipMessage: "Total votes received by the pool in the current epoch.",
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
        columnWidth: "w-[112px] pr-2.5",
        tooltipMessage: "Number of votes given through the selected veNFT to this pool.",
        isToolTipEnabled: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "votes.myVotesPercentage"),
        canShort: true,

        accessor: (x: any) => (
          <MyVotesValue myVotes={x.votes.myVotes} myVotesPercentage={x.votes.myVotesPercentage} />
        ),
      },

      {
        Header: "Votes",
        id: "Myvotess",
        columnWidth: "w-[237px] ml-auto",
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
      <div className={`overflow-x-auto inner ${props.className}`}>
        <Table<any>
          columns={
            isTablet
              ? currentEpoch?.epochNumber === selectedEpoch?.epochNumber
                ? props.selectedDropDown.tokenId == ""
                  ? desktopcolumnsNFT
                  : props.sumOfVotes === 100
                  ? desktopcolumns
                  : desktopcolumnsNFT
                : desktopcolumns
              : isMobile
              ? mobilecolumns
              : currentEpoch?.epochNumber === selectedEpoch?.epochNumber
              ? props.selectedDropDown.tokenId == ""
                ? desktopcolumnsNFT
                : props.sumOfVotes === 100
                ? desktopcolumns
                : desktopcolumnsNFT
              : desktopcolumns
          }
          data={votedata}
          noSearchResult={noSearchResult}
          shortby="Rewards"
          tableType={true}
          isFetched={!noSearchResult && votedata.length === 0 ? false : true}
          isConnectWalletRequired={props.isConnectWalletRequired}
          isVotesTable={true}
          TableName="votesTable"
          TableWidth={"md:min-w-[845px]"}
        />
      </div>
    </>
  );
}
