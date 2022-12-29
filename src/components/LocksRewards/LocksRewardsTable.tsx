import * as React from "react";
import Image from "next/image";
import epoachIcon from "../../assets/icon/common/epochTimeIcon.svg";
import { Column } from "react-table";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { IVotePageData } from "../../api/votes/types";
import { IVotesTableRewards } from "./types";
import { RewardsData } from "./Rewards";
import { VotingPower } from "./VotingPower";
import { ILockRewardsEpochData } from "../../api/portfolio/types";
import { NoPoolsPosition } from "../Rewards/NoContent";
import ClaimAllEpoch from "./ClaimAllEpoch";
import { changeSource, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { tokenIcons } from "../../constants/tokensList";
import { useAppSelector } from "../../redux";

export function LocksTableRewards(props: IVotesTableRewards) {
  const { valueFormat } = useTableNumberUtils();
  const tokens = useAppSelector((state) => state.config.tokens);
  const [epochNo, setEpochNo] = React.useState("");
  const [claimAllData, setClaimAllData] = React.useState<ILockRewardsEpochData[]>(
    [] as ILockRewardsEpochData[]
  );
  const [votesArray, setvotesArray] = React.useState<[string, ILockRewardsEpochData[]][]>(
    [] as [string, ILockRewardsEpochData[]][]
  );
  const [isFetched, setIsFetched] = React.useState(false);
  const [noSearchResult, setNoSearchResult] = React.useState(false);
  const [newArr, setNewArr] = React.useState<
    { epoch: string; votes: ILockRewardsEpochData | [] }[]
  >([] as { epoch: string; votes: ILockRewardsEpochData }[]);
  const [newdata, setNewdata] = React.useState<
    { epoch: string; votes: ILockRewardsEpochData | [] }[]
  >([] as { epoch: string; votes: ILockRewardsEpochData }[]);
  React.useEffect(() => {
    setvotesArray([] as [string, ILockRewardsEpochData[]][]);
    setNewArr([] as { epoch: string; votes: ILockRewardsEpochData }[]);
    setNewdata([] as { epoch: string; votes: ILockRewardsEpochData }[]);

    if (
      props.selectedDropDown.tokenId !== "" &&
      props.selectedDropDown.tokenId in props.allLocksRewardsData
    ) {
      setIsFetched(true);
      setvotesArray(Object.entries(props.allLocksRewardsData[props.selectedDropDown.tokenId]));
    } else {
      setIsFetched(true);
      setvotesArray([]);
    }
  }, [props.selectedDropDown.tokenId, props.allLocksRewardsData]);
  const NoData = React.useMemo(() => {
    if (isFetched && newArr.length === 0) {
      return (
        <NoPoolsPosition
          h1={"No voting rewards"}
          subText={"Your veNFT does not have unclaimed voting rewards."}
          cta={"Vote"}
        />
      );
    }
  }, [props.selectedDropDown.tokenId, newArr]);
  React.useMemo(() => {
    votesArray.reverse().map((data, index) => {
      if (data[1].length > 0) {
        newArr.push({ epoch: data[0], votes: [] });
      }
      if (data[1].length > 0) {
        data[1].forEach(function (vote) {
          newArr.push({ epoch: "", votes: vote });
        });
      }
    });
  }, [votesArray, votesArray.length]);
  React.useEffect(() => {
    if (newArr.length > 0) {
      setNewdata(newArr.reverse());
    } else {
      setNewdata([]);
    }
  }, [newArr, newArr.length]);

  const mobilecolumns = React.useMemo<Column<IVotePageData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pools",
        columnWidth: "w-[120px]",
        showOnMobile: true,
        accessor: (x: any) =>
          x.epoch === "" ? (
            <div className=" flex justify-center items-center">
              <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center">
                <img
                  alt={"alt"}
                  src={
                    tokenIcons[x.votes.tokenASymbol]
                      ? tokenIcons[x.votes.tokenASymbol].src
                      : tokens[x.votes.tokenASymbol.toString()]?.iconUrl
                      ? tokens[x.votes.tokenASymbol.toString()].iconUrl
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
                    tokenIcons[x.votes.tokenBSymbol]
                      ? tokenIcons[x.votes.tokenBSymbol].src
                      : tokens[x.votes.tokenBSymbol.toString()]?.iconUrl
                      ? tokens[x.votes.tokenBSymbol.toString()].iconUrl
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
                  {tEZorCTEZtoUppercase(x.votes.tokenASymbol?.toString())}/
                  {tEZorCTEZtoUppercase(x.votes.tokenBSymbol?.toString())}
                </div>
                <div className="font-subtitle1 text-text-500">{x.votes.ammType} Pool</div>
              </div>
            </div>
          ) : (
            <div>
              {" "}
              <div className="flex gap-1">
                <Image alt={"alt"} src={epoachIcon} width={"22px"} height={"22px"} />
                <span className="text-text-250">Epoch</span>
                <span className="text-white">{x.epoch}</span>
              </div>
            </div>
          ),
      },
      {
        Header: "Reward",
        id: "Reward",
        columnWidth: "w-[111px]",
        tooltipMessage: "Trading fees and bribes.",
        isToolTipEnabled: true,
        showOnMobile: true,
        accessor: (x: any) =>
          x.epoch === "" ? (
            <RewardsData
              bribes={x.votes.bribesAmount}
              fees={x.votes.feesAmount}
              token1Name={tEZorCTEZtoUppercase(x.votes.tokenASymbol?.toString())}
              token2Name={tEZorCTEZtoUppercase(x.votes.tokenBSymbol?.toString())}
              feesData={x.votes.feesData}
              bribesData={x.votes.bribesData}
              feesStatus={x.votes.feesStatus}
            />
          ) : null,
      },
      {
        Header: "Voting power",
        id: "Voting power",
        columnWidth: "w-[127px]",
        isToolTipEnabled: true,
        showOnMobile: true,
        tooltipMessage: "Allocated voting power.",
        accessor: (x: any) =>
          x.epoch === "" ? (
            <VotingPower votes={x.votes.votes} percentage={x.votes.votesPercentage} />
          ) : (
            <div
              className="cursor-pointer flex items-center font-subtitle4 text-primary-500 ml-auto h-[44px] px-[22px] md:px-[26px] bg-primary-500/[0.1] rounded-xl w-[120px]  justify-center"
              onClick={() => {
                setEpochNo(x.epoch);
                setClaimAllData(props.allLocksRewardsData[props.selectedDropDown.tokenId][x.epoch]);
                props.setShowClaimPlyInd(true);
                props.setEpochClaim(x.epoch);
              }}
            >
              Claim
            </div>
          ),
      },
    ],
    [valueFormat]
  );

  const desktopcolumns = React.useMemo<Column<IVotePageData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pool",
        columnWidth: "w-[180px] lg:w-[220px]",
        showOnMobile: true,
        accessor: (x: any) =>
          x.epoch === "" ? (
            <div className=" flex justify-center items-center">
              <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
                <img
                  alt={"alt"}
                  src={
                    tokenIcons[x.votes.tokenASymbol]
                      ? tokenIcons[x.votes.tokenASymbol].src
                      : tokens[x.votes.tokenASymbol.toString()]?.iconUrl
                      ? tokens[x.votes.tokenASymbol.toString()].iconUrl
                      : `/assets/Tokens/fallback.png`
                  }
                  width={"24px"}
                  height={"24px"}
                  onError={changeSource}
                />
              </div>
              <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
                <img
                  alt={"alt"}
                  src={
                    tokenIcons[x.votes.tokenBSymbol]
                      ? tokenIcons[x.votes.tokenBSymbol].src
                      : tokens[x.votes.tokenBSymbol.toString()]?.iconUrl
                      ? tokens[x.votes.tokenBSymbol.toString()].iconUrl
                      : `/assets/Tokens/fallback.png`
                  }
                  width={"24px"}
                  height={"24px"}
                  onError={changeSource}
                />
              </div>
              <div>
                <div className="font-body2 md:font-body4">
                  {" "}
                  {tEZorCTEZtoUppercase(x.votes.tokenASymbol?.toString())}/
                  {tEZorCTEZtoUppercase(x.votes.tokenBSymbol?.toString())}
                </div>
                <div className="font-subtitle1 text-text-500">{x.votes.ammType} Pool</div>
              </div>
            </div>
          ) : (
            <div>
              {" "}
              <div className="flex gap-1">
                <Image alt={"alt"} src={epoachIcon} width={"22px"} height={"22px"} />
                <span className="text-text-250">Epoch</span>
                <span className="text-white">{x.epoch}</span>
              </div>
            </div>
          ),
      },
      {
        Header: "Reward",
        id: "Reward",
        isToolTipEnabled: true,
        columnWidth: "w-[111px]",
        tooltipMessage: "Trading fees and bribes.",
        showOnMobile: true,
        accessor: (x: any) =>
          x.epoch === "" ? (
            <RewardsData
              bribes={x.votes.bribesAmount}
              fees={x.votes.feesAmount}
              token1Name={tEZorCTEZtoUppercase(x.votes.tokenASymbol?.toString())}
              token2Name={tEZorCTEZtoUppercase(x.votes.tokenBSymbol?.toString())}
              feesData={x.votes.feesData}
              bribesData={x.votes.bribesData}
              feesStatus={x.votes.feesStatus}
            />
          ) : null,
      },

      {
        Header: "Voting power",
        id: "Voting power",
        columnWidth: "w-[140px]",
        tooltipMessage: "Allocated voting power.",
        isToolTipEnabled: true,
        showOnMobile: true,

        accessor: (x: any) =>
          x.epoch === "" ? (
            <VotingPower votes={x.votes.votes} percentage={x.votes.votesPercentage} />
          ) : (
            <div
              className="cursor-pointer flex items-center font-subtitle4 text-primary-500 ml-auto h-[44px] px-[22px] md:px-[26px] bg-primary-500/[0.1] rounded-xl w-[120px]  justify-center"
              onClick={() => {
                setEpochNo(x.epoch);
                props.setEpochClaim(x.epoch);
                setClaimAllData(props.allLocksRewardsData[props.selectedDropDown.tokenId][x.epoch]);
                props.setShowClaimPlyInd(true);
              }}
            >
              Claim
            </div>
          ),
      },
    ],
    [valueFormat]
  );

  return (
    <>
      <div className={` overflow-x-auto inner ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={newdata}
          noSearchResult={noSearchResult}
          shortby=""
          isFetched={isFetched}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableName="locksRewards"
          TableWidth=""
          NoData={NoData}
        />
      </div>
      {props.showClaimPlyInd && (
        <ClaimAllEpoch
          show={props.showClaimPlyInd}
          setShow={props.setShowClaimPlyInd}
          handleClick={props.handleClick}
          data={claimAllData}
          epochClaim={epochNo}
        />
      )}
    </>
  );
}
