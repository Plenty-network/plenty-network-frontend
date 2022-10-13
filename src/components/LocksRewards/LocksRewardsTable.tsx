import * as React from "react";
import Image from "next/image";
import { BigNumber } from "bignumber.js";
import epoachIcon from "../../assets/icon/common/epochTimeIcon.svg";
import { Column } from "react-table";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { IVotePageData, IVotesData } from "../../api/votes/types";
import { IVotesTableRewards } from "./types";
import { RewardsData } from "./Rewards";
import { VotingPower } from "./VotingPower";
import { ILockRewardsEpochData } from "../../api/portfolio/types";
import { NoPoolsPosition } from "../Rewards/NoContent";
import { NoNFTAvailable } from "../Rewards/NoNFT";
import ClaimAllEpoch from "./ClaimAllEpoch";

export function LocksTableRewards(props: IVotesTableRewards) {
  const { valueFormat } = useTableNumberUtils();

  const [showClaimPly, setShowClaimPly] = React.useState(false);
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
  }, [props.selectedDropDown.tokenId]);
  const NoData = React.useMemo(() => {
    if (props.selectedDropDown.tokenId === "") {
      return <NoNFTAvailable setShowCreateLockModal={props.setShowCreateLockModal} />;
    } else if (
      !(props.selectedDropDown.tokenId in props.allLocksRewardsData) ||
      newArr.length === 0
    ) {
      return <NoPoolsPosition />;
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
  }, [votesArray]);
  React.useEffect(() => {
    if (newArr.length > 0) {
      setNewdata(newArr.reverse());
    } else {
      setNewdata([]);
    }
  }, [newArr]);

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
        Header: "Pool",
        id: "pools",
        columnWidth: "w-[120px]",
        showOnMobile: true,
        accessor: (x: any) =>
          x.epoch === "" ? (
            <div className=" flex justify-center items-center">
              <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center">
                <Image
                  alt={"alt"}
                  src={getImagesPath(x.votes.tokenASymbol)}
                  width={"20px"}
                  height={"20px"}
                />
              </div>
              <div className="w-[24px] relative -left-2 bg-card-600 rounded-full h-[24px] flex justify-center items-center">
                <Image
                  alt={"alt"}
                  src={getImagesPath(x.votes.tokenBSymbol)}
                  width={"20px"}
                  height={"20px"}
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

        accessor: (x: any) =>
          x.epoch === "" ? (
            <VotingPower votes={x.votes.votes} percentage={x.votes.votesPercentage} />
          ) : (
            <div
              className="cursor-pointer flex items-center md:font-body4 font-subtitle3 text-primary-500 ml-auto h-[44px] px-[22px] md:px-[26px] bg-primary-500/[0.1] rounded-xl w-[120px]  justify-center"
              onClick={() => {
                setEpochNo(x.epoch);
                setClaimAllData(props.allLocksRewardsData[props.selectedDropDown.tokenId][x.epoch]);
                setShowClaimPly(true);
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
                <Image
                  alt={"alt"}
                  src={getImagesPath(x.votes.tokenASymbol)}
                  width={"24px"}
                  height={"24px"}
                />
              </div>
              <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
                <Image
                  alt={"alt"}
                  src={getImagesPath(x.votes.tokenBSymbol)}
                  width={"24px"}
                  height={"24px"}
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
        isToolTipEnabled: true,
        showOnMobile: true,

        accessor: (x: any) =>
          x.epoch === "" ? (
            <VotingPower votes={x.votes.votes} percentage={x.votes.votesPercentage} />
          ) : (
            <div
              className="cursor-pointer flex items-center md:font-body4 font-subtitle3 text-primary-500 ml-auto h-[44px] px-[22px] md:px-[26px] bg-primary-500/[0.1] rounded-xl w-[120px]  justify-center"
              onClick={() => {
                setEpochNo(x.epoch);
                props.setEpochClaim(x.epoch);
                setClaimAllData(props.allLocksRewardsData[props.selectedDropDown.tokenId][x.epoch]);
                setShowClaimPly(true);
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
          data={[...newdata, ...newdata, ...newdata, ...newdata]}
          noSearchResult={noSearchResult}
          shortby=""
          isFetched={isFetched}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableName="locksRewards"
          TableWidth=""
          NoData={NoData}
        />
      </div>
      {showClaimPly && (
        <ClaimAllEpoch
          show={showClaimPly}
          setShow={setShowClaimPly}
          handleClick={props.handleClick}
          data={claimAllData}
          epochClaim={epochNo}
        />
      )}
    </>
  );
}
