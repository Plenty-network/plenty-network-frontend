import * as React from "react";
import Image from "next/image";
import { Column } from "react-table";
import { useTableNumberUtils } from "../../hooks/useTableUtils";
import Table from "../Table/Table";
import { isMobile } from "react-device-detect";
import { ELocksState, IVeNFTData, IVotePageData, IVotesData } from "../../api/votes/types";
import { ILocksTablePosition, IManageBtnProps, IVoteBtnProps } from "./types";
import lockDisable from "../../assets/icon/myPortfolio/voteDisable.svg";
import vote from "../../assets/icon/myPortfolio/vote.svg";
import withdraw from "../../assets/icon/myPortfolio/withdraw.svg";
import { LocksCloumn } from "./LockColumn";
import { PlyLocked } from "./PlyLocked";
import { LockExpiry } from "./LockExpiry";
import PieChartButton from "./PieChart";
import { useDispatch } from "react-redux";
import { AppDispatch, store, useAppSelector } from "../../redux";
import { setSelectedDropDown, setSelectedDropDownLocal } from "../../redux/veNFT";
import { useRouter } from "next/router";
import { IAllLocksPositionData } from "../../api/portfolio/types";
import { useEffect, useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { VotingPower } from "./VotingPower";
import { getVeNFTsList } from "../../api/votes";
import { compareNumericString } from "../../utils/commonUtils";
import { NoLocks } from "../Rewards/NoLocks";
import { changeSource, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { tokenIcons } from "../../constants/tokensList";
TimeAgo.addDefaultLocale(en);

export function LocksTablePosition(props: ILocksTablePosition) {
  const tokens = useAppSelector((state) => state.config.tokens);
  const epochData = useAppSelector((state) => state.epoch.currentEpoch);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const totalTime = epochData ? epochData.endTimestamp - epochData.startTimestamp : 0;
  const remainingTime = epochData ? epochData.endTimestamp - new Date().getTime() : 0;
  const [veNFTlist, setVeNFTlist] = useState<IVeNFTData[]>([]);
  const remainingPercentage =
    totalTime === 0 || remainingTime === 0 ? 0 : (remainingTime * 100) / totalTime;
  const { valueFormat } = useTableNumberUtils();
  useEffect(() => {
    getVeNFTsList(userAddress, epochData?.epochNumber).then((res) => {
      setVeNFTlist(res.veNFTData);
    });
  }, []);
  const NoData = React.useMemo(() => {
    return <NoLocks setShowCreateLockModal={props.setShowCreateLockModal} />;
  }, []);
  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };

  const mobilecolumns = React.useMemo<Column<IAllLocksPositionData>[]>(
    () => [
      {
        Header: "Pool",
        id: "pools",
        columnWidth: "w-[126px]",
        isToolTipEnabled: true,
        tooltipMessage: "Liquidity pool gauge to which the lock may be attached for boosting.",
        sortType: (a: any, b: any) => compareNumericString(a, b, "attachedTokenASymbol", true),
        showOnMobile: true,
        accessor: (x: any) =>
          x.attached ? (
            <div className=" flex justify-center items-center">
              <div className="bg-card-600 rounded-full w-[24px] h-[24px] flex justify-center items-center">
                <img
                  alt={"alt"}
                  src={
                    tokenIcons[x.attachedTokenASymbol]
                      ? tokenIcons[x.attachedTokenASymbol].src
                      : tokens[x.attachedTokenASymbol.toString()]?.iconUrl
                      ? tokens[x.attachedTokenASymbol.toString()].iconUrl
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
                    tokenIcons[x.attachedTokenBSymbol]
                      ? tokenIcons[x.attachedTokenBSymbol].src
                      : tokens[x.attachedTokenBSymbol.toString()]?.iconUrl
                      ? tokens[x.attachedTokenBSymbol.toString()].iconUrl
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
                  {tEZorCTEZtoUppercase(x.attachedTokenASymbol) === "CTEZ"
                    ? ` ${tEZorCTEZtoUppercase(x.attachedTokenBSymbol)} / ${tEZorCTEZtoUppercase(
                        x.attachedTokenASymbol
                      )}`
                    : ` ${tEZorCTEZtoUppercase(x.attachedTokenASymbol)} / ${tEZorCTEZtoUppercase(
                        x.attachedTokenBSymbol
                      )}`}
                </div>
                <div className="font-subtitle1 text-text-500">{} Pool</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center font-body2 md:font-body4 text-right">
              Not attached
            </div>
          ),
      },
      {
        Header: "Voting power",
        id: "Voting Power",
        columnWidth: "w-[70px]",
        tooltipMessage:
          " Your current voting power. This is different from your epoch voting power which is recorded at the beginning of each epoch.",
        isToolTipEnabled: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "currentVotingPower"),
        canShort: true,
        showOnMobile: true,
        accessor: (x: any) => <VotingPower value={x.currentVotingPower} />,
      },

      {
        Header: "",
        id: "manage",
        columnWidth: "w-[100px] ml-auto",

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
      {
        Header: "",
        id: "vote",
        columnWidth: "w-[82px] ml-auto",

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
    ],
    [valueFormat]
  );

  const desktopcolumns = React.useMemo<Column<IAllLocksPositionData>[]>(
    () => [
      {
        Header: "Locks",
        id: "Locks",
        columnWidth: "w-[157px]",
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "tokenId"),
        showOnMobile: true,
        accessor: (x: any) => <LocksCloumn id={x.tokenId} thumbnailUri={x.thumbnailUri} />,
      },
      {
        Header: "Pool",
        id: "pool",
        columnWidth: "w-[160px]",
        showOnMobile: true,
        isToolTipEnabled: true,
        tooltipMessage: "Liquidity pool gauge to which the lock may be attached for boosting.",
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "attachedTokenASymbol", true),
        accessor: (x: any) =>
          x.attached ? (
            <div className=" flex justify-center items-center">
              <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
                <img
                  alt={"alt"}
                  src={
                    tokenIcons[x.attachedTokenASymbol]
                      ? tokenIcons[x.attachedTokenASymbol].src
                      : tokens[x.attachedTokenASymbol.toString()]?.iconUrl
                      ? tokens[x.attachedTokenASymbol.toString()].iconUrl
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
                    tokenIcons[x.attachedTokenBSymbol]
                      ? tokenIcons[x.attachedTokenBSymbol].src
                      : tokens[x.attachedTokenBSymbol.toString()]?.iconUrl
                      ? tokens[x.attachedTokenBSymbol.toString()].iconUrl
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
                  {tEZorCTEZtoUppercase(x.attachedTokenASymbol) === "CTEZ"
                    ? ` ${tEZorCTEZtoUppercase(x.attachedTokenBSymbol)} / ${tEZorCTEZtoUppercase(
                        x.attachedTokenASymbol
                      )}`
                    : ` ${tEZorCTEZtoUppercase(x.attachedTokenASymbol)} / ${tEZorCTEZtoUppercase(
                        x.attachedTokenBSymbol
                      )}`}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center font-body4 ">Not attached</div>
          ),
      },
      {
        Header: "Voting power",
        id: "Voting Power",
        columnWidth: "w-[124px]",
        isToolTipEnabled: true,
        tooltipMessage:
          " Your current voting power. This is different from your epoch voting power which is recorded at the beginning of each epoch.",
        canShort: true,
        showOnMobile: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "currentVotingPower"),
        accessor: (x: any) => <VotingPower value={x.currentVotingPower} />,
      },
      {
        Header: `PLY locked`,
        id: "PLY locked",
        columnWidth: "w-[124px]",
        tooltipMessage: "Amount of PLY locked up until expiry.",
        canShort: true,
        isToolTipEnabled: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "baseValue"),
        accessor: (x: any) => <PlyLocked value={x.baseValue} />,
      },
      {
        Header: "Lock expiry",
        id: "Lock expiry",
        columnWidth: "w-[172px]",
        isToolTipEnabled: true,
        tooltipMessage:
          " The lock is unusable once it expires and underlying PLY may be withdrawn.",
        canShort: true,
        sortType: (a: any, b: any) => compareNumericString(a, b, "endTimeStamp"),

        accessor: (x: any) => <LockExpiry endTime={x.endTimeStamp} />,
      },

      {
        Header: "",
        id: "manage",
        columnWidth: "w-[180px] ml-auto",

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
      {
        Header: "",
        id: "vote",
        columnWidth: " w-[160px]",

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
    ],
    [valueFormat]
  );
  function ManageBtn(props: IManageBtnProps): any {
    if (true) {
      //isstaked
      return (
        <div
          className="bg-primary-500/10 md:w-[151px] w-[78px] cursor-pointer  text-primary-500 hover:opacity-90  md:font-subtitle4 font-f11-500  rounded-lg flex items-center h-[40px] justify-center"
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
          className="bg-primary-500 md:w-[151px] w-[78px] cursor-pointer  md:font-subtitle4 font-subtitle4 text-black hover:opacity-90  rounded-lg flex items-center justify-center h-[40px]"
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
      if (props.locksState === ELocksState.CONSUMED) {
        return (
          <div
            className="bg-primary-500/10 w-[59px] cursor-pointer  text-primary-500 hover:opacity-90  font-subtitle4 rounded-lg flex items-center h-[40px] justify-center"
            onClick={() => {}}
          >
            <span className="relative top-0.5">
              <Image alt={"alt"} src={lockDisable} />
            </span>
            <span className="ml-2">
              <PieChartButton
                violet={100 - remainingPercentage}
                transparent={remainingPercentage}
              />
            </span>
          </div>
        );
      } else if (props.locksState === ELocksState.AVAILABLE) {
        return (
          <div
            className="bg-primary-500 w-[59px] cursor-pointer font-subtitle4 text-black hover:opacity-90  rounded-lg flex items-center justify-center h-[40px]"
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
                    dispatch(
                      setSelectedDropDownLocal({
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
                    dispatch(
                      setSelectedDropDownLocal({
                        votingPower: list.votingPower.toString(),
                        tokenId: list.tokenId.toString(),
                      })
                    );
                  }
                }
              });

              router.push("/vote");
            }}
          >
            <span className="relative top-0.5">
              <Image alt={"alt"} src={vote} />
            </span>
          </div>
        );
      } else if (props.locksState === ELocksState.EXPIRED) {
        return (
          <div
            className="bg-primary-500 w-[59px] cursor-pointer font-subtitle4 text-black hover:opacity-90  rounded-lg flex items-center justify-center h-[40px]"
            onClick={() => {
              props.setWithdraw(true);
              props.setManageData(props.manageData);
            }}
          >
            <span className="relative top-0.5">
              <Image alt={"alt"} src={withdraw} />
            </span>
          </div>
        );
      } else if (props.locksState === ELocksState.DISABLED) {
        //isstaked
        return (
          <div
            className="bg-primary-500 w-[59px] cursor-pointer font-subtitle4 text-black hover:opacity-90  rounded-lg flex items-center justify-center h-[40px]"
            onClick={() => {}}
          >
            <span className="relative top-0.5">
              <Image alt={"alt"} src={vote} />
            </span>
            <span className="ml-2">
              <PieChartButton
                violet={100 - remainingPercentage}
                transparent={remainingPercentage}
              />
            </span>
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
                violet={100 - remainingPercentage}
                transparent={remainingPercentage}
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
                    dispatch(
                      setSelectedDropDownLocal({
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
                    dispatch(
                      setSelectedDropDownLocal({
                        votingPower: list.votingPower.toString(),
                        tokenId: list.tokenId.toString(),
                      })
                    );
                  }
                }
              });

              router.push("/vote");
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
                violet={100 - remainingPercentage}
                transparent={remainingPercentage}
              />
            </span>
          </div>
        );
      }
    }
  }
  return (
    <>
      <div className={`overflow-x-auto md:pr-5 inner ${props.className}`}>
        <Table<any>
          columns={isMobile ? mobilecolumns : desktopcolumns}
          data={props.locksPosition}
          shortby="Locks"
          isFetched={props.isfetched}
          isConnectWalletRequired={props.isConnectWalletRequired}
          TableName={"lockPosition"}
          TableWidth="lg:min-w-[1147px]"
          NoData={NoData}
        />
      </div>
    </>
  );
}
