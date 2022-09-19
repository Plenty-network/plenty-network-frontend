import * as React from "react";
import Image from "next/image";
import { Column } from "react-table";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { IVotePageData, IVotesData } from "../../api/votes/types";
import { ILocksTablePosition, IManageBtnProps } from "./types";
import lockDisable from "../../assets/icon/myPortfolio/voteDisable.svg";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { ActiveLiquidity } from "../Pools/ManageLiquidityHeader";
import { LocksCloumn } from "./LockColumn";
import { PlyLocked } from "./PlyLocked";
import { LockExpiry } from "./LockExpiry";
import PieChartButton from "./PieChart";
import { useDispatch } from "react-redux";
import { AppDispatch, store } from "../../redux";
import { setSelectedDropDown } from "../../redux/veNFT";
import Vote from "../../../pages/Vote";
import { useRouter } from "next/router";

export function LocksTablePosition(props: ILocksTablePosition) {
  const epochData = store.getState().epoch.currentEpoch;
  const totalTime = epochData.endTimestamp - epochData.startTimestamp;
  const remainingTime = epochData.endTimestamp - new Date().getTime();
  const remainingPercentage = (remainingTime * 100) / totalTime;
  const { valueFormat } = useTableNumberUtils();
  const votesArray = Object.entries(props.voteData);
  const [totalVotes1, setTotalVotes1] = React.useState<number[]>(
    new Array(votesArray.length).fill(0)
  );
  const [activeState, setActiveState] = React.useState<ActiveLiquidity | string>(
    ActiveLiquidity.Liquidity
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
  const [votedata, setVotedata] = React.useState(votedataArray);
  React.useEffect(() => {
    if (votedataArray.length !== 0) setVotedata(votedataArray);
    else setVotedata([]);
  }, [votedataArray.length]);

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
              <div className="font-subtitle1 text-text-500">{x.votes.poolType} Pool</div>
            </div>
          </div>
        ),
      },
      {
        Header: "Your liquidity",
        id: "your liquidity",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => 32,
      },
      {
        Header: "",
        id: "vote",
        minWidth: 200,
        accessor: (x) => <VoteBtn />,
      },
      {
        Header: "",
        id: "manage",
        minWidth: 151,
        accessor: (x) => (
          <ManageBtn
            setIsManageLock={props.setIsManageLock}
            setShowCreateLockModal={props.setShowCreateLockModal}
          />
        ),
      },
    ],
    [valueFormat]
  );

  const desktopcolumns = React.useMemo<Column<IVotePageData>[]>(
    () => [
      {
        Header: "Locks",
        id: "Locks",
        width: "300px",
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => <LocksCloumn />,
      },
      {
        Header: "Pool",
        id: "pool",

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
              <div className="font-subtitle1 text-text-500">{x.votes.poolType} Pool</div>
            </div>
          </div>
        ),
      },
      {
        Header: "Voting Power",
        id: "Voting Power",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => 2345,
      },
      {
        Header: `PLY locked`,
        id: "PLY locked",
        canShort: true,
        isToolTipEnabled: true,
        accessor: (x: any) => <PlyLocked />,
      },
      {
        Header: "Lock expiry",
        id: "Lock expiry",
        isToolTipEnabled: true,
        canShort: true,
        accessor: (x: any) => <LockExpiry />,
      },

      {
        Header: "",
        id: "vote",
        minWidth: 200,
        accessor: (x) => <VoteBtn />,
      },
      {
        Header: "",
        id: "manage",
        minWidth: 151,
        accessor: (x) => (
          <ManageBtn
            setIsManageLock={props.setIsManageLock}
            setShowCreateLockModal={props.setShowCreateLockModal}
          />
        ),
      },
    ],
    [valueFormat]
  );
  function ManageBtn(props: IManageBtnProps): any {
    if (true) {
      //isstaked
      return (
        <div
          className="bg-primary-500/10 md:w-[151px] w-[78px] cursor-pointer  text-primary-500 hover:opacity-90  md:font-subtitle4 font-f11-600  rounded-lg flex items-center h-[40px] justify-center"
          onClick={() => {
            props.setIsManageLock(true);
            props.setShowCreateLockModal(true);
          }}
        >
          Manage
        </div>
      );
    } else if (false) {
      return (
        <div
          className="bg-primary-500 md:w-[151px] w-[78px] cursor-pointer  md:font-subtitle4 font-f11-600 text-black hover:opacity-90  rounded-lg flex items-center justify-center h-[40px]"
          onClick={() => {}}
        >
          Stake
        </div>
      );
    }
  }
  function VoteBtn(): any {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    if (isMobile) {
      if (true) {
        //isstaked
        return (
          <div
            className="bg-primary-500/10 w-[59px] cursor-pointer  text-primary-500 hover:opacity-90  font-subtitle4 rounded-lg flex items-center h-[40px] justify-center"
            onClick={() => {
              dispatch(
                setSelectedDropDown({
                  votingPower: "1.952",
                  tokenId: "75",
                })
              );
              router.push("/Vote");
            }}
          >
            <span className="relative top-0.5">
              <Image src={lockDisable} />
            </span>

            <span className="ml-1">
              <PieChartButton
                violet={remainingPercentage}
                transparent={100 - remainingPercentage}
              />
            </span>
          </div>
        );
      } else if (false) {
        return (
          <div
            className="bg-primary-500 w-[151px] cursor-pointer font-subtitle4 text-black hover:opacity-90  rounded-lg flex items-center justify-center h-[40px]"
            onClick={() => {}}
          >
            Vote
          </div>
        );
      } else if (false) {
        return (
          <div
            className="bg-primary-500 w-[151px] cursor-pointer font-subtitle4 text-black hover:opacity-90  rounded-lg flex items-center justify-center h-[40px]"
            onClick={() => {}}
          >
            Withdraw
          </div>
        );
      }
    } else {
      if (true) {
        //isstaked
        return (
          <div
            className="bg-primary-500/10 w-[151px] cursor-pointer  text-primary-500 hover:opacity-90  font-subtitle4 rounded-lg flex items-center h-[40px] justify-center"
            onClick={() => {
              dispatch(
                setSelectedDropDown({
                  votingPower: "1.952",
                  tokenId: "75",
                })
              );
              router.push("/Vote");
            }}
          >
            Voted{" "}
            <span className="ml-2">
              <PieChartButton
                violet={remainingPercentage}
                transparent={100 - remainingPercentage}
              />
            </span>
          </div>
        );
      } else if (false) {
        return (
          <div
            className="bg-primary-500 w-[151px] cursor-pointer font-subtitle4 text-black hover:opacity-90  rounded-lg flex items-center justify-center h-[40px]"
            onClick={() => {}}
          >
            Vote
          </div>
        );
      } else if (false) {
        return (
          <div
            className="bg-primary-500 w-[151px] cursor-pointer font-subtitle4 text-black hover:opacity-90  rounded-lg flex items-center justify-center h-[40px]"
            onClick={() => {}}
          >
            Withdraw
          </div>
        );
      }
    }
  }
  return (
    <>
      <div className={`overflow-x-auto inner ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={votedata}
          noSearchResult={noSearchResult}
          shortby="Myvotes"
          isFetched={!noSearchResult && votedata.length === 0 ? false : true}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableName={"lockPosition"}
          TableWidth="md:min-w-[1049px]"
        />
      </div>
      {/* {showLiquidityModal && (
        <ManageLiquidity
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          closeFn={setShowLiquidityModal}
          setActiveState={setActiveState}
          activeState={activeState}
        />
      )} */}
    </>
  );
}
