import * as React from "react";
import Image from "next/image";
import { Column } from "react-table";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { ELocksState, IVeNFTData, IVotePageData, IVotesData } from "../../api/votes/types";
import { ILocksTablePosition, IManageBtnProps, IVoteBtnProps } from "./types";
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
import { IAllLocksPositionData } from "../../api/portfolio/types";

import { useEffect, useState, useRef } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { VotingPower } from "./VotingPower";
import { getVeNFTsList } from "../../api/votes";
import { NoPoolsPosition } from "../Rewards/NoContent";
TimeAgo.addDefaultLocale(en);

export function LocksTablePosition(props: ILocksTablePosition) {
  const epochData = store.getState().epoch.currentEpoch;
  const userAddress = store.getState().wallet.address;
  const totalTime = epochData.endTimestamp - epochData.startTimestamp;
  const remainingTime = epochData.endTimestamp - new Date().getTime();
  const [veNFTlist, setVeNFTlist] = useState<IVeNFTData[]>([]);
  const remainingPercentage = (remainingTime * 100) / totalTime;
  const { valueFormat } = useTableNumberUtils();
  useEffect(() => {
    getVeNFTsList(userAddress, epochData?.epochNumber).then((res) => {
      setVeNFTlist(res.veNFTData);
    });
  }, []);
  const NoData = React.useMemo(() => {
    return <NoPoolsPosition />;
  }, []);
  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  console.log(props.locksPosition);
  const tEZorCTEZtoUppercase = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;

  const mobilecolumns = React.useMemo<Column<IAllLocksPositionData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pools",
        showOnMobile: true,
        accessor: (x: any) =>
          x.attached ? (
            <div className=" flex justify-center items-center">
              <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center">
                <Image
                  alt={"alt"}
                  src={getImagesPath(x.attachedTokenASymbol)}
                  width={"20px"}
                  height={"20px"}
                />
              </div>
              <div className="w-[24px] relative -left-2 bg-card-600 rounded-full h-[24px] flex justify-center items-center">
                <Image
                  alt={"alt"}
                  src={getImagesPath(x.attachedTokenBSymbol)}
                  width={"20px"}
                  height={"20px"}
                />
              </div>
              <div>
                <div className="font-body4">
                  {" "}
                  {tEZorCTEZtoUppercase(x.attachedTokenASymbol.toString())}/
                  {tEZorCTEZtoUppercase(x.attachedTokenBSymbol.toString())}
                </div>
                <div className="font-subtitle1 text-text-500">{} Pool</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center font-body4 text-right">
              Not attached
            </div>
          ),
      },
      {
        Header: "Voting Power",
        id: "Voting Power",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => <VotingPower value={x.currentVotingPower} />,
      },
      {
        Header: "",
        id: "vote",
        minWidth: 200,
        accessor: (x) => (
          <VoteBtn
            locksState={x.locksState}
            id={Number(x.tokenId)}
            setWithdraw={props.setShowWithdraw}
            manageData={x}
            setManageData={props.setManageData}
          />
        ),
      },
      {
        Header: "",
        id: "manage",
        minWidth: 151,
        accessor: (x) => (
          <ManageBtn
            setIsManageLock={props.setIsManageLock}
            setShowCreateLockModal={props.setShowCreateLockModal}
            setManageData={props.setManageData}
            manageData={x}
          />
        ),
      },
    ],
    [valueFormat]
  );

  const desktopcolumns = React.useMemo<Column<IAllLocksPositionData>[]>(
    () => [
      {
        Header: "Locks",
        id: "Locks",
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => <LocksCloumn id={x.tokenId} />,
      },
      {
        Header: "Pool",
        id: "pool",
        showOnMobile: true,
        accessor: (x: any) =>
          x.attached ? (
            <div className=" flex justify-center items-center">
              <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
                <Image
                  alt={"alt"}
                  src={getImagesPath(x.attachedTokenASymbol)}
                  width={"24px"}
                  height={"24px"}
                />
              </div>
              <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
                <Image
                  alt={"alt"}
                  src={getImagesPath(x.attachedTokenBSymbol)}
                  width={"24px"}
                  height={"24px"}
                />
              </div>
              <div>
                <div className="font-body4">
                  {" "}
                  {tEZorCTEZtoUppercase(x.attachedTokenASymbol.toString())}/
                  {tEZorCTEZtoUppercase(x.attachedTokenBSymbol.toString())}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center font-body4 ">Not attached</div>
          ),
      },
      {
        Header: "Voting Power",
        id: "Voting Power",
        isToolTipEnabled: true,
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => <VotingPower value={x.currentVotingPower} />,
      },
      {
        Header: `PLY locked`,
        id: "PLY locked",
        canShort: true,
        isToolTipEnabled: true,
        accessor: (x: any) => <PlyLocked value={x.baseValue} />,
      },
      {
        Header: "Lock expiry",
        id: "Lock expiry",
        isToolTipEnabled: true,
        canShort: true,
        accessor: (x: any) => <LockExpiry endTime={x.endTimeStamp} />,
      },
      {
        Header: "",
        id: "vote",
        minWidth: 200,
        accessor: (x) => (
          <VoteBtn
            locksState={x.locksState}
            id={Number(x.tokenId)}
            setWithdraw={props.setShowWithdraw}
            setManageData={props.setManageData}
            manageData={x}
          />
        ),
      },
      {
        Header: "",
        id: "manage",
        minWidth: 151,
        accessor: (x) =>
          x.locksState !== ELocksState.EXPIRED && (
            <ManageBtn
              setIsManageLock={props.setIsManageLock}
              setShowCreateLockModal={props.setShowCreateLockModal}
              setManageData={props.setManageData}
              manageData={x}
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
            props.setManageData(props.manageData);
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
  function VoteBtn(props: IVoteBtnProps): any {
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
              <Image alt={"alt"} src={lockDisable} />
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
      if (props.locksState === ELocksState.CONSUMED) {
        //isstaked
        return (
          <div
            className="bg-primary-500/10 w-[151px] cursor-pointer  text-primary-500 hover:opacity-90  font-subtitle4 rounded-lg flex items-center h-[40px] justify-center"
            onClick={() => {}}
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
      } else if (props.locksState === ELocksState.AVAILABLE) {
        return (
          <div
            className="bg-primary-500 w-[151px] cursor-pointer font-subtitle4 text-black hover:opacity-90  rounded-lg flex items-center justify-center h-[40px]"
            onClick={() => {
              var flag = false;

              veNFTlist.map((list) => {
                if (Number(list.tokenId) === Number(props.id)) {
                  flag = true;
                  if (list.locksState === ELocksState.CONSUMED) {
                    dispatch(
                      setSelectedDropDown({
                        votingPower: list.consumedVotingPower.toString(),
                        tokenId: list.tokenId.toString(),
                      })
                    );
                  } else {
                    dispatch(
                      setSelectedDropDown({
                        votingPower: list.votingPower.toString(),
                        tokenId: list.tokenId.toString(),
                      })
                    );
                  }
                }
              });

              router.push("/Vote");
            }}
          >
            Vote
          </div>
        );
      } else if (props.locksState === ELocksState.EXPIRED) {
        return (
          <div
            className="bg-primary-500 w-[151px] cursor-pointer font-subtitle4 text-black hover:opacity-90  rounded-lg flex items-center justify-center h-[40px]"
            onClick={() => {
              props.setWithdraw(true);
              props.setManageData(props.manageData);
            }}
          >
            Withdraw
          </div>
        );
      } else if (props.locksState === ELocksState.DISABLED) {
        //isstaked
        return (
          <div
            className="bg-primary-500/10 w-[151px] cursor-pointer  text-primary-500 hover:opacity-90  font-subtitle4 rounded-lg flex items-center h-[40px] justify-center"
            onClick={() => {}}
          >
            Vote{" "}
            <span className="ml-2">
              <PieChartButton
                violet={remainingPercentage}
                transparent={100 - remainingPercentage}
              />
            </span>
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
          data={props.locksPosition}
          shortby="Myvotes"
          isFetched={props.isfetched}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableName={"lockPosition"}
          TableWidth="md:min-w-[1100px]"
          NoData={NoData}
        />
      </div>
    </>
  );
}
