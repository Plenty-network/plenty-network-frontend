import * as React from "react";
import Image from "next/image";
import { BigNumber } from "bignumber.js";
import epoachIcon from "../../assets/icon/common/epochTimeIcon.svg";
import { Column } from "react-table";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { IVotePageData, IVotesData } from "../../api/votes/types";
import { ManageLiquidity } from "../Pools/ManageLiquidity";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { ActiveLiquidity } from "../Pools/ManageLiquidityHeader";
import { IManageBtnProps } from "../PoolsPosition/types";
import { IVotesTableRewards } from "./types";
import ClaimPly from "../PoolsRewards/ClaimPopup";
import ClaimAll from "../Rewards/ClaimAll";
import { RewardsData } from "./Rewards";
import { VotingPower } from "./VotingPower";
import { ILockRewardsEpochData } from "../../api/portfolio/types";

export function LocksTableRewards(props: IVotesTableRewards) {
  const { valueFormat } = useTableNumberUtils();

  const [showClaimPly, setShowClaimPly] = React.useState(false);
  const [votesArray, setvotesArray] = React.useState<[string, ILockRewardsEpochData[]][]>(
    [] as [string, ILockRewardsEpochData[]][]
  );

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
    if (props.selectedDropDown.tokenId !== "") {
      setvotesArray(Object.entries(props.allLocksRewardsData[props.selectedDropDown.tokenId]));
    }
  }, [props.selectedDropDown.tokenId]);
  React.useMemo(() => {
    votesArray.reverse().map((data, index) => {
      newArr.push({ epoch: data[0], votes: [] });
      if (data[1].length > 0) {
        data[1].forEach(function (vote) {
          newArr.push({ epoch: "", votes: vote });
        });
      }
    });
  }, [votesArray.length]);
  React.useEffect(() => {
    setNewdata(newArr.reverse());
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
        showOnMobile: true,
        accessor: (x: any) => (
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
              <div className="font-body4">
                {" "}
                {tEZorCTEZtoUppercase(x.votes.tokenASymbol.toString())}/
                {tEZorCTEZtoUppercase(x.votes.tokenBSymbol.toString())}
              </div>
              <div className="font-subtitle1 text-text-500">{x.votes.ammType} Pool</div>
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
        accessor: (x: any) => "$234.58",
      },
    ],
    [valueFormat]
  );

  const desktopcolumns = React.useMemo<Column<IVotePageData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pool",
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
                <div className="font-body4">
                  {" "}
                  {tEZorCTEZtoUppercase(x.votes.tokenASymbol.toString())}/
                  {tEZorCTEZtoUppercase(x.votes.tokenBSymbol.toString())}
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
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) =>
          x.epoch === "" ? (
            <RewardsData
              bribes={x.votes.bribesAmount}
              fees={x.votes.feesAmount}
              token1Name={tEZorCTEZtoUppercase(x.votes.tokenASymbol.toString())}
              token2Name={tEZorCTEZtoUppercase(x.votes.tokenBSymbol.toString())}
              fees1={Number(0)}
              fees2={Number(1)}
              bribesData={x.votes.bribesData}
            />
          ) : null,
      },

      {
        Header: "Voting power",
        id: "Voting power",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) =>
          x.epoch === "" ? (
            <VotingPower votes={x.votes.votes} percentage={x.votes.votesPercentage} />
          ) : (
            <div className="cursor-pointer flex items-center md:font-body4 font-subtitle4 text-primary-500 ml-auto h-[44px] px-[22px] md:px-[26px] bg-primary-500/[0.1] rounded-xl w-[120px]  justify-center">
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
          shortby="Myvotes"
          isFetched={!noSearchResult && newdata.length === 0 ? false : true}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableName="locksRewards"
          TableWidth=""
        />
      </div>
      {showClaimPly && <ClaimPly show={showClaimPly} setShow={setShowClaimPly} />}
    </>
  );
}
