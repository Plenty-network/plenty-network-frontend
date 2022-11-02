import Image from "next/image";
import PropTypes from "prop-types";
import * as React from "react";
import { BigNumber } from "bignumber.js";
import "animate.css";
import playIcon from "../../src/assets/icon/pools/playIcon.svg";
import { useEffect, useState, useMemo } from "react";
import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { connect, useDispatch } from "react-redux";
import { AppDispatch, store, useAppSelector } from "../../src/redux";
import { fetchWallet } from "../../src/redux/wallet/wallet";
import { createGaugeConfig, getConfig } from "../../src/redux/config/config";
import { getLpTokenPrice, getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import { getTotalVotingPower } from "../../src/redux/pools";
import { getEpochData } from "../../src/redux/epoch/epoch";
import { useInterval } from "../../src/hooks/useInterval";

import migrateViolet from "../../src/assets/icon/migrate/migrateViolet.svg";

import migrateGrey from "../../src/assets/icon/migrate/migrateGrey.svg";
import rewardsViolet from "../../src/assets/icon/myPortfolio/rewardsViolet.svg";
import positionsViolet from "../../src/assets/icon/myPortfolio/positionsViolet.svg";
import rewards from "../../src/assets/icon/myPortfolio/rewards.svg";
import position from "../../src/assets/icon/myPortfolio/positions.svg";
import Stats from "../../src/components/Positions/Stats";
import { MyPortfolioCardHeader, MyPortfolioHeader } from "../../src/components/Positions/Header";
import { PoolsTablePosition } from "../../src/components/PoolsPosition/poolsTable";
import { getVeNFTsList } from "../../src/api/votes";
import { IVeNFTData } from "../../src/api/votes/types";
import { getCompleteUserBalace, getUserBalanceByRpc } from "../../src/api/util/balance";

import CreateLock from "../../src/components/Votes/CreateLock";
import ConfirmTransaction from "../../src/components/ConfirmTransaction";
import TransactionSubmitted from "../../src/components/TransactionSubmitted";
import {
  claimAllInflation,
  createLock,
  increaseLockAndValue,
  increaseLockEnd,
  increaseLockValue,
  withdrawLock,
} from "../../src/operations/locks";
import { LocksTablePosition } from "../../src/components/LocksPosition/LocksTable";
import clsx from "clsx";
import StatsRewards from "../../src/components/Rewards/Stats";
import { PoolsTableRewards } from "../../src/components/PoolsRewards/poolsRewardsTable";
import ManageLock from "../../src/components/LocksPosition/ManageLock";
import { getAllLocksPositionData, getUnclaimedRewardsForLock } from "../../src/api/portfolio/locks";
import {
  IAllLocksPositionData,
  IPoolsRewardsResponse,
  IPositionsData,
  IUnclaimedRewardsForLockData,
} from "../../src/api/portfolio/types";
import WithdrawPly from "../../src/components/LocksPosition/WithdrawPopup";
import { setIsLoadingWallet, setMyPortfolioSection } from "../../src/redux/walletLoading";

import { LocksTableRewards } from "../../src/components/LocksRewards/LocksRewardsTable";
import { harvestAllRewards } from "../../src/operations/rewards";
import {
  fetchAllLocksRewardsData,
  fetchAllRewardsOperationsData,
  fetchUnclaimedInflationData,
} from "../../src/redux/myPortfolio/rewards";
import { API_RE_ATTAMPT_DELAY } from "../../src/constants/global";
import SelectNFTLocks from "../../src/components/Rewards/SelectNFTLocks";
import {
  claimAllBribeForAllLocks,
  claimAllFeeForAllLocks,
  claimAllForEpoch,
  claimAllRewardsForAllLocks,
  claimSupernova,
} from "../../src/operations/vote";
import { claimAllDetachAndWithdrawLock } from "../../src/operations/locks";
import ClaimPly from "../../src/components/PoolsRewards/ClaimPopup";
import { EClaimAllState } from "../../src/components/Rewards/types";
import { setFlashMessage } from "../../src/redux/flashMessage";
import { Flashtype } from "../../src/components/FlashScreen";
import {
  CLAIM,
  FIRST_TOKEN_AMOUNT,
  TOKEN_A,
  TOKEN_ID,
  USERADDRESS,
} from "../../src/constants/localStorage";
import { Position, ToolTip } from "../../src/components/Tooltip/TooltipAdvanced";
import { getPoolsRewardsData, getPositionsData } from "../../src/api/portfolio/pools";
import { fetchTvlStatsData } from "../../src/redux/myPortfolio/tvl";
import { fetchVotesStatsData } from "../../src/redux/myPortfolio/votesStats";
import { VideoModal } from "../../src/components/Modal/videoModal";
import { isMobile } from "react-device-detect";
import { PortfolioDropdown } from "../../src/components/PortfolioSection";
import Migrate from "../../src/components/Migrate";
import { VestedPlyTopbar } from "../../src/components/Migrate/VestedPlyTopBar";
import ClaimVested from "../../src/components/Migrate/ClaimVested";

import { useRouter } from "next/router";
import { IAllBalanceResponse } from "../../src/api/util/types";

export enum MyPortfolioSection {
  Positions = "Positions",
  Rewards = "Rewards",
  Migrate = "Migrate",
}
function MyPortfolio(props: any) {
  const [activeStateTab, setActiveStateTab] = React.useState<MyPortfolioHeader>(
    MyPortfolioHeader.Pools
  );
  const section = useAppSelector((state) => state.walletLoading.activePortfolio);
  const [activeSection, setActiveSection] = React.useState<MyPortfolioSection>(section);

  const [showClaimPly, setShowClaimPly] = React.useState(false);

  const [epochClaim, setEpochClaim] = React.useState("");
  const userAddress = useAppSelector((state) => state.wallet.address);

  const dispatch = useDispatch<AppDispatch>();

  const token = useAppSelector((state) => state.config.tokens);
  const scrollY = useAppSelector((state) => state.walletLoading.scrollY);
  const inflationData = useAppSelector((state) => state.portfolioRewards.claimAllInflationData);
  const totalVotingPowerError = useAppSelector((state) => state.pools.totalVotingPowerError);
  const epochError = useAppSelector((state) => state.epoch).epochFetchError;
  const amm = useAppSelector((state) => state.config.AMMs);
  const unclaimInflation = useAppSelector((state) => state.portfolioRewards.unclaimedInflationData);
  const [showCreateLockModal, setShowCreateLockModal] = useState(false);
  const [isManageLock, setIsManageLock] = useState(false);
  const [plyInput, setPlyInput] = useState("");
  const selectedDropDown = useAppSelector((state) => state.veNFT.selectedDropDown);
  const [updatedPlyVoteValue, setUpdatedPlyVoteValue] = useState("");
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [lockingDate, setLockingDate] = useState("");
  // const tokenPrice = store.getState().tokenPrice.tokenPrice;
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  // const lpTokenPrice = store.getState().tokenPrice.lpTokenPrices;
  const lpTokenPrice = useAppSelector((state) => state.tokenPrice.lpTokenPrices);
  const [transactionId, setTransactionId] = useState("");
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const [manageData, setManageData] = useState<IAllLocksPositionData>({} as IAllLocksPositionData);
  const [lockingEndData, setLockingEndData] = useState({
    selected: 0,
    lockingDate: 0,
  });
  const [claimState, setClaimState] = useState<EClaimAllState>(-1 as EClaimAllState);
  // const allLocksRewardsData = store.getState().portfolioRewards.allLocksRewardsData;
  const allLocksRewardsData = useAppSelector((state) => state.portfolioRewards.allLocksRewardsData);
  const [selectednft, setSelectednft] = useState(selectedDropDown);
  // const bribesClaimData = store.getState().portfolioRewards.bribesClaimData;
  const bribesClaimData = useAppSelector((state) => state.portfolioRewards.bribesClaimData);
  // const epochClaimData = store.getState().portfolioRewards.epochClaimData;
  const epochClaimData = useAppSelector((state) => state.portfolioRewards.epochClaimData);
  // const feeClaimData = store.getState().portfolioRewards.feesClaimData;
  const feeClaimData = useAppSelector((state) => state.portfolioRewards.feesClaimData);
  // const bribesStats = store.getState().portfolioRewards.totalBribesAmount;
  const bribesStats = useAppSelector((state) => state.portfolioRewards.totalBribesAmount);
  // const tradingfeeStats = store.getState().portfolioRewards.totalTradingFeesAmount;
  const tradingfeeStats = useAppSelector((state) => state.portfolioRewards.totalTradingFeesAmount);
  // const fetchingTradingfee = store.getState().portfolioRewards.fetchingLocksRewardsData;
  const fetchingTradingfee = useAppSelector(
    (state) => state.portfolioRewards.fetchingLocksRewardsData
  );
  const [veNFTlist, setVeNFTlist] = useState<IVeNFTData[]>([]);
  const [contentTransaction, setContentTransaction] = useState("");
  const [plyBalance, setPlyBalance] = useState(new BigNumber(0));
  const [claimValueDollar, setClaimValueDollar] = useState(new BigNumber(0));
  const [poolsPosition, setPoolsPosition] = useState<{
    data: IPositionsData[];
    isfetched: boolean;
  }>({ data: [] as IPositionsData[], isfetched: false });
  const [poolsRewards, setPoolsRewards] = useState<{
    data: IPoolsRewardsResponse;
    isfetched: boolean;
  }>({ data: {} as IPoolsRewardsResponse, isfetched: false });
  const [locksPosition, setLocksPosition] = useState<{
    data: IAllLocksPositionData[];
    isfetched: boolean;
  }>({ data: [] as IAllLocksPositionData[], isfetched: false });
  // const currentEpoch = store.getState().epoch.currentEpoch;
  const currentEpoch = useAppSelector((state) => state.epoch.currentEpoch);
  const [claimOperation, setClaimOperation] = useState(false);
  const locksRewardsDataError = useAppSelector(
    (state) => state.portfolioRewards.locksRewardsDataError
  );
  const rewardsOperationDataError = useAppSelector(
    (state) => state.portfolioRewards.rewardsOperationDataError
  );
  const unclaimedInflationDataError = useAppSelector(
    (state) => state.portfolioRewards.unclaimedInflationDataError
  );
  // const statsTvl: BigNumber = store.getState().portfolioStatsTvl.userTvl;
  const statsTvl: BigNumber = useAppSelector((state) => state.portfolioStatsTvl.userTvl);
  const statsTvlError: boolean = useAppSelector((state) => state.portfolioStatsTvl.userTvlError);
  const statsTvlFetching: boolean = useAppSelector(
    (state) => state.portfolioStatsTvl.userTvlFetching
  );
  const fetchingUnclaimedInflationData: boolean = useAppSelector(
    (state) => state.portfolioRewards.fetchingUnclaimedInflationData
  );
  const statsTotalEpochVotingPower: BigNumber = useAppSelector(
    (state) => state.portfolioStatsVotes.totalEpochVotingPower
  );
  const statsTotalPlyLocked: BigNumber = useAppSelector(
    (state) => state.portfolioStatsVotes.totalPlyLocked
  );
  const statsVotesError: boolean = useAppSelector(
    (state) => state.portfolioStatsVotes.votesStatsError
  );
  const statsVotesFetching: boolean = useAppSelector(
    (state) => state.portfolioStatsVotes.votesStatsFetching
  );
  const [allBalance, setAllBalance] = useState<{
    success: boolean;
    userBalance: { [id: string]: BigNumber };
  }>({ success: false, userBalance: {} });
  useEffect(() => {
    setAllBalance({ success: false, userBalance: {} });
    if (userAddress) {
      getCompleteUserBalace(userAddress).then((response: IAllBalanceResponse) => {
        setAllBalance(response);
      });
    } else {
      setAllBalance({ success: true, userBalance: {} });
    }
  }, [userAddress, token]);
  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
  }, []);
  useEffect(() => {
    if (epochError) {
      dispatch(getEpochData());
    }
  }, [epochError]);
  useInterval(() => {
    dispatch(getEpochData());
  }, 60000);
  useEffect(() => {
    if (userAddress) {
      dispatch(getTotalVotingPower());
    }
  }, [userAddress]);
  useEffect(() => {
    if (userAddress && totalVotingPowerError) {
      dispatch(getTotalVotingPower());
    }
  }, [totalVotingPowerError]);
  useEffect(() => {
    Object.keys(token).length !== 0 && dispatch(getTokenPrice());
  }, [token]);
  useEffect(() => {
    Object.keys(tokenPrice).length !== 0 && dispatch(getLpTokenPrice(tokenPrice));
  }, [tokenPrice]);
  useEffect(() => {
    Object.keys(amm).length !== 0 && dispatch(createGaugeConfig());
  }, [amm]);
  useEffect(() => {
    if (userAddress && Object.keys(tokenPrice).length !== 0) {
      dispatch(
        fetchAllLocksRewardsData({ userTezosAddress: userAddress, tokenPrices: tokenPrice })
      );
      dispatch(fetchAllRewardsOperationsData(userAddress));
      dispatch(
        fetchUnclaimedInflationData({ userTezosAddress: userAddress, tokenPrices: tokenPrice })
      );
    }
  }, [userAddress, tokenPrice]);
  useEffect(() => {
    if (userAddress && Object.keys(tokenPrice).length !== 0 && locksRewardsDataError) {
      setTimeout(() => {
        dispatch(
          fetchAllLocksRewardsData({ userTezosAddress: userAddress, tokenPrices: tokenPrice })
        );
      }, API_RE_ATTAMPT_DELAY);
    }
  }, [locksRewardsDataError]);
  useEffect(() => {
    if (userAddress && Object.keys(tokenPrice).length !== 0 && rewardsOperationDataError) {
      setTimeout(() => {
        dispatch(fetchAllRewardsOperationsData(userAddress));
      }, API_RE_ATTAMPT_DELAY);
    }
  }, [rewardsOperationDataError]);
  useEffect(() => {
    if (userAddress && Object.keys(tokenPrice).length !== 0 && unclaimedInflationDataError) {
      setTimeout(() => {
        dispatch(
          fetchUnclaimedInflationData({ userTezosAddress: userAddress, tokenPrices: tokenPrice })
        );
      }, API_RE_ATTAMPT_DELAY);
    }
  }, [unclaimedInflationDataError]);

  const [statsPositions, setStatsPosition] = useState({
    success: true,
    tvl: statsTvl,
    isFetching: statsTvlFetching,
  });
  useEffect(() => {
    setStatsPosition({
      success: true,
      tvl: statsTvl,
      isFetching: statsTvlFetching,
    });
  }, [statsTvlFetching]);
  const [stats1, setStats1] = useState({
    success: true,
    totalEpochVotingPower: statsTotalEpochVotingPower,
    totalPlyLocked: statsTotalPlyLocked,
    isFetching: statsVotesFetching,
  });
  useEffect(() => {
    setStats1({
      success: true,
      totalEpochVotingPower: statsTotalEpochVotingPower,
      totalPlyLocked: statsTotalPlyLocked,
      isFetching: statsVotesFetching,
    });
  }, [statsVotesFetching]);

  useEffect(() => {
    if (userAddress) {
      getUserBalanceByRpc("PLY", userAddress).then((res) => {
        setPlyBalance(res.balance);
      });
    }
  }, [userAddress, tokenPrice, balanceUpdate, token, props.operationSuccesful, props.isLoading]);

  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  const handleCloseLock = () => {
    setShowCreateLockModal(false);
    setPlyInput("");
    setIsManageLock(false);
    setLockingDate("");
    setUpdatedPlyVoteValue("");
    setLockingEndData({
      selected: 0,
      lockingDate: 0,
    });
  };
  useEffect(() => {
    if (userAddress) {
      setPoolsRewards({ data: {} as IPoolsRewardsResponse, isfetched: false });

      if (Object.keys(lpTokenPrice).length !== 0 && Object.keys(tokenPrice).length !== 0) {
        getPositionsData(userAddress, lpTokenPrice).then((res) => {
          setPoolsPosition({ data: res.positionPoolsData, isfetched: true });
        });
      }
      if (Object.keys(tokenPrice).length !== 0) {
        getPoolsRewardsData(userAddress, tokenPrice).then((res) => {
          setPoolsRewards({ data: res, isfetched: true });
        });
      }
    }
  }, [userAddress, lpTokenPrice]);
  useEffect(() => {
    //setVeNFTlist([]);

    if (userAddress) {
      getVeNFTsList(userAddress, currentEpoch?.epochNumber).then((res) => {
        setVeNFTlist(res.veNFTData);
      });
    } else {
      setVeNFTlist([]);
    }
  }, [userAddress, currentEpoch?.epochNumber]);

  useEffect(() => {
    if (veNFTlist.length > 0) {
      setSelectednft({
        votingPower: veNFTlist[0].votingPower.toString(),
        tokenId: veNFTlist[0].tokenId.toString(),
      });
    } else {
      setSelectednft({
        votingPower: "",
        tokenId: "",
      });
    }
  }, [veNFTlist]);
  useEffect(() => {
    if (userAddress) {
      getAllLocksPositionData(userAddress).then((res) => {
        setLocksPosition({ data: res.allLocksData.reverse(), isfetched: true });
      });
    }
  }, [userAddress, activeSection, currentEpoch?.epochNumber]);
  useEffect(() => {
    if (!props.isLoading && props.operationSuccesful && userAddress) {
      setLocksPosition({ data: [] as IAllLocksPositionData[], isfetched: false });

      dispatch(fetchVotesStatsData(userAddress));
      setPoolsPosition({ data: [] as IPositionsData[], isfetched: false });
      getAllLocksPositionData(userAddress).then((res) => {
        setLocksPosition({ data: res.allLocksData.reverse(), isfetched: true });
      });
      if (Object.keys(lpTokenPrice).length !== 0 && Object.keys(tokenPrice).length !== 0) {
        dispatch(
          fetchTvlStatsData({
            userTezosAddress: userAddress,
            tokenPrices: tokenPrice,
            lpTokenPrices: lpTokenPrice,
          })
        );

        getPositionsData(userAddress, lpTokenPrice).then((res) => {
          setPoolsPosition({ data: res.positionPoolsData, isfetched: true });
        });
      }
    }
  }, [props.operationSuccesful, props.isLoading, userAddress]);
  useEffect(() => {
    if (claimOperation) {
      if (Object.keys(tokenPrice).length !== 0) {
        getPoolsRewardsData(userAddress, tokenPrice).then((res) => {
          setPoolsRewards({ data: res, isfetched: true });
        });
      }
      dispatch(
        fetchAllLocksRewardsData({ userTezosAddress: userAddress, tokenPrices: tokenPrice })
      );
      dispatch(fetchAllRewardsOperationsData(userAddress));
      dispatch(
        fetchUnclaimedInflationData({ userTezosAddress: userAddress, tokenPrices: tokenPrice })
      );
    }
  }, [claimOperation]);
  const [unclaimedDataTokenId, setUnclaimedDataTokenId] = useState<IUnclaimedRewardsForLockData>(
    {} as IUnclaimedRewardsForLockData
  );
  useEffect(() => {
    setUnclaimedDataTokenId({} as IUnclaimedRewardsForLockData);
    if (manageData.tokenId) {
      setUnclaimedDataTokenId(getUnclaimedRewardsForLock(Number(manageData.tokenId)));
    }
  }, [manageData.tokenId]);

  useEffect(() => {
    if (userAddress) {
      if (Object.keys(lpTokenPrice).length !== 0 && Object.keys(tokenPrice).length !== 0) {
        dispatch(
          fetchTvlStatsData({
            userTezosAddress: userAddress,
            tokenPrices: tokenPrice,
            lpTokenPrices: lpTokenPrice,
          })
        );
      }
    }
  }, [userAddress, lpTokenPrice]);
  useEffect(() => {
    if (
      userAddress &&
      Object.keys(tokenPrice).length !== 0 &&
      Object.keys(lpTokenPrice).length !== 0 &&
      statsTvlError
    ) {
      setTimeout(() => {
        dispatch(
          fetchTvlStatsData({
            userTezosAddress: userAddress,
            tokenPrices: tokenPrice,
            lpTokenPrices: lpTokenPrice,
          })
        );
      }, API_RE_ATTAMPT_DELAY);
    }
  }, [statsTvlError]);

  useEffect(() => {
    if (userAddress) {
      dispatch(fetchVotesStatsData(userAddress));
    }
  }, [userAddress]);
  useEffect(() => {
    if (userAddress && statsVotesError) {
      setTimeout(() => {
        dispatch(fetchVotesStatsData(userAddress));
      }, API_RE_ATTAMPT_DELAY);
    }
  }, [statsVotesError]);

  const dateFormat = (dates: number) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var date = new Date(dates);
    var month = date.getMonth();

    return `${("0" + date.getDate()).slice(-2)}-${monthNames[month]}-${date.getFullYear()}`;
  };
  const resetAllValues = () => {
    setPlyInput("");
    setLockingDate("");

    setUpdatedPlyVoteValue("");
    setLockingEndData({
      selected: 0,
      lockingDate: 0,
    });
  };
  useEffect(() => {
    if (userAddress) {
      console.log(`User Add Changed - ${userAddress}`);
      if (!(localStorage.getItem(USERADDRESS) === userAddress)) {
        localStorage.setItem(USERADDRESS, userAddress);
      }
    }
  }, [userAddress]);
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const Title = useMemo(() => {
    return (
      <div className="flex gap-1 items-center">
        <p
          className={clsx(
            " font-title3 cursor-pointer box-border py-3 w-[147px] flex items-center justify-center  gap-1",
            activeSection === MyPortfolioSection.Positions
              ? "text-primary-500 bg-primary-500/[0.1] border border-primary-500/[0.6] rounded-l-lg"
              : "text-text-250 bg-muted-700 rounded-l-lg"
          )}
          onClick={() => {
            setActiveSection(MyPortfolioSection.Positions);
            dispatch(setMyPortfolioSection(MyPortfolioSection.Positions));
          }}
        >
          Positions{" "}
          {activeSection === MyPortfolioSection.Positions ? (
            <Image alt={"alt"} src={positionsViolet} />
          ) : (
            <Image alt={"alt"} src={position} />
          )}
        </p>
        <p
          className={clsx(
            " cursor-pointer font-title3 py-3 box-border  w-[147px] flex items-center justify-center  gap-1",
            activeSection === MyPortfolioSection.Rewards
              ? "text-primary-500 bg-primary-500/[0.1] border border-primary-500/[0.6]"
              : "text-text-250 bg-muted-700 "
          )}
          onClick={() => {
            setActiveSection(MyPortfolioSection.Rewards);
            dispatch(setMyPortfolioSection(MyPortfolioSection.Rewards));
          }}
        >
          Rewards
          {activeSection === MyPortfolioSection.Rewards ? (
            <Image alt={"alt"} src={rewardsViolet} />
          ) : (
            <Image alt={"alt"} src={rewards} />
          )}
        </p>
        <p
          className={clsx(
            " font-title3 cursor-pointer box-border py-3 w-[147px] flex items-center justify-center  gap-1",
            activeSection === MyPortfolioSection.Migrate
              ? "text-primary-500 bg-primary-500/[0.1] border border-primary-500/[0.6] rounded-r-lg"
              : "text-text-250 bg-muted-700 rounded-r-lg"
          )}
          onClick={() => {
            setActiveSection(MyPortfolioSection.Migrate);
            dispatch(setMyPortfolioSection(MyPortfolioSection.Migrate));
          }}
        >
          Migrate{" "}
          {activeSection === MyPortfolioSection.Migrate ? (
            <Image alt={"alt"} src={migrateViolet} />
          ) : (
            <Image alt={"alt"} src={migrateGrey} />
          )}
        </p>
      </div>
    );
  }, [activeSection]);

  const Tooltip = useMemo(() => {
    return (
      <p className="ml-2">
        <ToolTip
          classNameToolTipContainer={isMobile ? `playIconTooltip-left` : `playIconTooltip-right`}
          position={isMobile ? Position.bottom : Position.right}
          toolTipChild={
            props.toolTipContent ? (
              <p className="">{props.toolTipContent}</p>
            ) : (
              <p className="w-[200px] md:min-w-[320px]">
                Watch how to add liquidity, stake, and earn PLY
              </p>
            )
          }
          classNameAncorToolTip="pushtoCenter"
          isShowInnitially={
            userAddress !== null && localStorage.getItem(USERADDRESS) !== userAddress
          }
        >
          <Image
            src={playIcon}
            onClick={() => setShowVideoModal(true)}
            height={"28px"}
            width={"28px"}
            className="cursor-pointer hover:opacity-90"
          />
        </ToolTip>
      </p>
    );
  }, []);
  function nFormatter(num: BigNumber) {
    if (num.isGreaterThanOrEqualTo(1000000000)) {
      return num.dividedBy(1000000000).toFixed(2) + "B";
    }
    if (num.isGreaterThanOrEqualTo(1000000)) {
      return num.dividedBy(1000000).toFixed(2) + "M";
    }
    if (num.isGreaterThanOrEqualTo(1000)) {
      return num.dividedBy(1000).toFixed(2) + "K";
    }

    return num.toFixed(2);
  }
  const handleWithdrawOperation = () => {
    setContentTransaction(`Withdraw ${nFormatter(manageData.baseValue)} PLY`);
    setShowWithdraw(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    localStorage.setItem(TOKEN_ID, manageData.tokenId.toString());
    withdrawLock(
      manageData.tokenId.toNumber(),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Withdraw lock #${localStorage.getItem(TOKEN_ID)}`,
        linkText: "View in Explorer",
        isLoading: true,

        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Withdraw lock #${localStorage.getItem(TOKEN_ID)}`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);
        setTimeout(() => {
          setClaimOperation(true);
        }, 10000);
        setTimeout(() => {
          setClaimOperation(false);
        }, 30000);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
        dispatch(
          setFlashMessage({
            flashType: Flashtype.Rejected,
            headerText: "Rejected",
            trailingText: `Withdraw lock #${localStorage.getItem(TOKEN_ID)}`,
            linkText: "",
            isLoading: true,
            transactionId: "",
          })
        );
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleWithdrawClaimOperation = () => {
    setContentTransaction(`Claim and withdraw ${nFormatter(manageData.baseValue)} PLY`);
    setShowWithdraw(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    localStorage.setItem(TOKEN_ID, manageData.tokenId.toString());
    claimAllDetachAndWithdrawLock(
      manageData.tokenId.toNumber(),
      unclaimedDataTokenId.unclaimedRewardsExist
        ? unclaimedDataTokenId.lockRewardsOperationData.lockFeesClaimData
        : [],
      unclaimedDataTokenId.unclaimedRewardsExist
        ? unclaimedDataTokenId.lockRewardsOperationData.lockBribesClaimData
        : [],
      unclaimedDataTokenId.unclaimedRewardsExist
        ? unclaimedDataTokenId.lockRewardsOperationData.lockInflationClaimData
        : [],
      manageData.attached ? manageData.attached : false,
      manageData.attached ? manageData.attachedAmmAddress : undefined,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Claim and withdraw lock #${localStorage.getItem(TOKEN_ID)}`,
        linkText: "View in Explorer",
        isLoading: true,

        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Claim and withdraw lock #${localStorage.getItem(TOKEN_ID)}`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);

        setTimeout(() => {
          setClaimOperation(true);
        }, 10000);
        setTimeout(() => {
          setClaimOperation(false);
        }, 30000);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
        dispatch(
          setFlashMessage({
            flashType: Flashtype.Rejected,
            headerText: "Rejected",
            trailingText: `Claim and withdraw lock #${localStorage.getItem(TOKEN_ID)}`,
            linkText: "",
            isLoading: true,
            transactionId: "",
          })
        );
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleLockOperation = () => {
    setContentTransaction(`Locking ${plyInput} PLY`);
    setShowCreateLockModal(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    localStorage.setItem(FIRST_TOKEN_AMOUNT, plyInput);
    localStorage.setItem(TOKEN_A, dateFormat(lockingEndData.lockingDate * 1000));
    createLock(
      userAddress,
      new BigNumber(plyInput),
      new BigNumber(lockingEndData.lockingDate),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Lock ${localStorage.getItem(
          FIRST_TOKEN_AMOUNT
        )} PLY till ${localStorage.getItem(TOKEN_A)}`,
        linkText: "View in Explorer",
        isLoading: true,

        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Lock ${localStorage.getItem(
                FIRST_TOKEN_AMOUNT
              )} PLY till ${localStorage.getItem(TOKEN_A)}`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Lock ${localStorage.getItem(
                FIRST_TOKEN_AMOUNT
              )} PLY till ${localStorage.getItem(TOKEN_A)}`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleIncreaseVoteOperation = () => {
    setIsManageLock(false);
    setContentTransaction(`Locking ${plyInput} PLY`);
    setShowCreateLockModal(false);

    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    localStorage.setItem(TOKEN_ID, manageData.tokenId.toString());
    increaseLockAndValue(
      manageData.tokenId.toNumber(),
      new BigNumber(updatedPlyVoteValue),
      new BigNumber(lockingEndData.lockingDate),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Modify lock #${localStorage.getItem(TOKEN_ID)}`,
        linkText: "View in Explorer",
        isLoading: true,
        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Modify lock #${localStorage.getItem(TOKEN_ID)}`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Modify lock #${localStorage.getItem(TOKEN_ID)}`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const IncreaseLockEndOperation = () => {
    setIsManageLock(false);
    setContentTransaction(`Increase lock`);
    setShowCreateLockModal(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    localStorage.setItem(TOKEN_ID, manageData.tokenId.toString());
    increaseLockEnd(
      manageData.tokenId.toNumber(),
      new BigNumber(lockingEndData.lockingDate),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Modify lock #${localStorage.getItem(TOKEN_ID)}`,
        linkText: "View in Explorer",
        isLoading: true,

        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Modify lock #${localStorage.getItem(TOKEN_ID)}`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
        //dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Modify lock #${localStorage.getItem(TOKEN_ID)}`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const IncreaseLockValueOperation = () => {
    setIsManageLock(false);
    setContentTransaction(`Increase lock`);
    setShowCreateLockModal(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    localStorage.setItem(TOKEN_ID, manageData.tokenId.toString());
    increaseLockValue(
      manageData.tokenId.toNumber(),
      new BigNumber(updatedPlyVoteValue),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Modify lock #${localStorage.getItem(TOKEN_ID)}`,
        linkText: "View in Explorer",
        isLoading: true,

        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Modify lock #${localStorage.getItem(TOKEN_ID)}`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Modify lock #${localStorage.getItem(TOKEN_ID)}`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleClaimAllPly = () => {
    setShowClaimPly(false);
    setContentTransaction(`Claim ${nFormatter(poolsRewards.data.gaugeEmissionsTotal)} PLY`);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    localStorage.setItem(CLAIM, nFormatter(poolsRewards.data.gaugeEmissionsTotal));
    harvestAllRewards(
      poolsRewards.data.gaugeAddresses,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Claim ${localStorage.getItem(CLAIM)} PLY`,
        linkText: "View in Explorer",
        isLoading: true,

        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setClaimOperation(true);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Claim ${localStorage.getItem(CLAIM)} PLY`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);
        setTimeout(() => {
          setClaimOperation(false);
        }, 20000);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Claim ${localStorage.getItem(CLAIM)} PLY`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleClaimBribes = () => {
    setContentTransaction(` Claim bribes $${nFormatter(bribesStats)}`);
    setShowClaimPly(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    localStorage.setItem(CLAIM, nFormatter(bribesStats));
    claimAllBribeForAllLocks(
      bribesClaimData,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Claim bribes $${localStorage.getItem(CLAIM)}`,
        linkText: "View in Explorer",
        isLoading: true,

        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setClaimOperation(true);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Claim bribes $${localStorage.getItem(CLAIM)}`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);
        setTimeout(() => {
          setClaimOperation(false);
        }, 20000);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Claim bribes $${localStorage.getItem(CLAIM)}`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleClaimFees = () => {
    setContentTransaction(`Claim trading fees $${nFormatter(tradingfeeStats)}`);
    setShowClaimPly(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    localStorage.setItem(CLAIM, nFormatter(tradingfeeStats));
    claimAllFeeForAllLocks(
      feeClaimData,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Claim trading fees $${localStorage.getItem(CLAIM)}`,
        linkText: "View in Explorer",
        isLoading: true,

        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setClaimOperation(true);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Claim trading fees $${localStorage.getItem(CLAIM)}`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);
        setTimeout(() => {
          setClaimOperation(false);
        }, 20000);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Claim trading fees $${localStorage.getItem(CLAIM)}`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleClaimALLFeesAndBribes = () => {
    setContentTransaction(`Claim all lock rewards`);
    setShowClaimPly(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    //localStorage.setItem(CLAIM, poolsRewards.data.gaugeEmissionsTotal.toString());
    claimAllRewardsForAllLocks(
      bribesClaimData,
      feeClaimData,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Claim all lock rewards`,
        linkText: "View in Explorer",
        isLoading: true,

        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setClaimOperation(true);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Claim all lock rewards`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);
        setTimeout(() => {
          setClaimOperation(false);
        }, 20000);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Claim all lock rewards`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleClaimALLEpoch = () => {
    setContentTransaction(`Claim lock rewards for <Epoch ${epochClaim}`);
    setShowClaimPly(false);

    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    localStorage.setItem(CLAIM, epochClaim.toString());
    claimAllForEpoch(
      epochClaimData[selectednft.tokenId][epochClaim],
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Claim lock rewards for <Epoch ${localStorage.getItem(CLAIM)}`,
        linkText: "View in Explorer",
        isLoading: true,

        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setClaimOperation(true);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Claim lock rewards for <Epoch ${localStorage.getItem(CLAIM)}`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);
        setTimeout(() => {
          setClaimOperation(false);
        }, 8000);
        setTimeout(() => {
          setClaimOperation(true);
        }, 10000);
        setTimeout(() => {
          setClaimOperation(false);
        }, 30000);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Claim lock rewards for <Epoch ${localStorage.getItem(CLAIM)}`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleClaimALLUnClaimed = () => {
    setContentTransaction(
      `Claim inflation ${nFormatter(unclaimInflation.unclaimedInflationAmount)} PLY`
    );
    setShowClaimPly(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    localStorage.setItem(CLAIM, nFormatter(unclaimInflation.unclaimedInflationAmount));
    claimAllInflation(
      inflationData,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Claim inflation ${localStorage.getItem(CLAIM)} PLY`,
        linkText: "View in Explorer",
        isLoading: true,

        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setClaimOperation(true);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Claim inflation ${localStorage.getItem(CLAIM)} PLY`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);
        setTimeout(() => {
          setClaimOperation(false);
        }, 8000);
        setTimeout(() => {
          setClaimOperation(true);
        }, 10000);
        setTimeout(() => {
          setClaimOperation(false);
        }, 30000);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Claim inflation ${localStorage.getItem(CLAIM)} PLY`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleClaimALLSuperNova = () => {
    setContentTransaction(`Claim all emissions, inflation, fees and bribes
    `);
    setShowClaimPly(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    //localStorage.setItem(CLAIM, poolsRewards.data.gaugeEmissionsTotal.toString());
    claimSupernova(
      poolsRewards.data.gaugeAddresses,
      feeClaimData,
      bribesClaimData,
      inflationData,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Claim all emissions, inflation, fees and bribes`,
        linkText: "View in Explorer",
        isLoading: true,
        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setClaimOperation(true);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Claim all emissions, inflation, fees and bribes`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);
        setTimeout(() => {
          setClaimOperation(false);
        }, 8000);
        setTimeout(() => {
          setClaimOperation(true);
        }, 10000);
        setTimeout(() => {
          setClaimOperation(false);
        }, 30000);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Claim all emissions, inflation, fees and bribes`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const router = useRouter();
  useEffect(() => {
    if (activeSection === MyPortfolioSection.Migrate) {
      void router.replace(
        {
          pathname: "/migrate",
        },
        undefined,
        { shallow: true }
      );
    } else {
      void router.replace(
        {
          pathname: "/myportfolio",
        },
        undefined,
        { shallow: true }
      );
    }
  }, [activeSection]);

  const [isClaimVested, setIsClaimVested] = useState(false);
  return (
    <>
      <SideBarHOC>
        <div>
          <div className="   ">
            <div className="flex items-center bg-background-200 h-[97px] border-b border-text-800/[0.5] md:pl-[23px] px-2">
              {isMobile ? (
                <PortfolioDropdown
                  Options={["Positions", "Rewards", "Migrate"]}
                  onClick={setActiveSection}
                  selectedText={activeSection}
                />
              ) : (
                <div className=""> {Title}</div>
              )}
              {Tooltip}

              {activeSection === MyPortfolioSection.Rewards && (
                <div className="ml-auto ">
                  <ToolTip
                    id="tooltipM"
                    position={Position.left}
                    toolTipChild={
                      <div className="w-[100px] md:w-[180px]">
                        Claim maximum possible rewards within gas limit
                      </div>
                    }
                  >
                    <div
                      className={clsx(
                        " flex items-center md:font-title3-bold font-subtitle4 text-black h-[44px] md:h-[50px] px-[20px] md:px-[32px] bg-primary-500 rounded-xl md:w-[155px]  justify-center",
                        (poolsRewards.data?.gaugeAddresses?.length === 0 &&
                          feeClaimData?.length === 0 &&
                          bribesClaimData?.length === 0 &&
                          inflationData?.length === 0) ||
                          poolsRewards.data?.gaugeAddresses === undefined
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      )}
                      onClick={
                        (poolsRewards.data?.gaugeAddresses?.length === 0 &&
                          feeClaimData?.length === 0 &&
                          bribesClaimData?.length === 0 &&
                          inflationData?.length === 0) ||
                        poolsRewards.data?.gaugeAddresses === undefined
                          ? () => {}
                          : () => {
                              setClaimValueDollar(
                                poolsRewards.data?.gaugeEmissionsTotalValue
                                  .plus(bribesStats)
                                  .plus(tradingfeeStats)
                              );
                              setShowClaimPly(true);

                              setClaimState(EClaimAllState.SUPERNOVA);
                            }
                      }
                    >
                      Claim max
                    </div>
                  </ToolTip>
                </div>
              )}
            </div>
            <div className="mt-5 overflow-x-auto inner md:pl-[23px] pl-2">
              {activeSection === MyPortfolioSection.Positions ? (
                <Stats
                  setShowCreateLockModal={setShowCreateLockModal}
                  plyBalance={plyBalance}
                  tokenPricePly={tokenPrice["PLY"]}
                  statsPositions={statsPositions}
                  stats1={stats1}
                />
              ) : (
                activeSection === MyPortfolioSection.Rewards && (
                  <StatsRewards
                    plyEmission={poolsRewards.data.gaugeEmissionsTotal}
                    fetchingPly={poolsRewards.isfetched}
                    tradingfeeStats={tradingfeeStats}
                    fetchingTradingfee={fetchingTradingfee}
                    bribesStats={bribesStats}
                    setClaimValueDollar={setClaimValueDollar}
                    setShowClaimPly={setShowClaimPly}
                    setClaimState={setClaimState}
                    bribesClaimData={bribesClaimData}
                    feeClaimData={feeClaimData}
                    unclaimInflation={unclaimInflation}
                    fetchingUnclaimedInflationData={fetchingUnclaimedInflationData}
                  />
                )
              )}
            </div>
          </div>

          {activeSection !== MyPortfolioSection.Migrate && (
            <div className="border-t border-text-800/[0.5] mt-5"></div>
          )}

          {activeSection === MyPortfolioSection.Migrate && !isClaimVested && (
            <Migrate allBalance={allBalance} />
          )}
          {activeSection !== MyPortfolioSection.Migrate && (
            <div>
              <div className="bg-card-50 md:sticky -top-[3px] md:top-0 z-10">
                <MyPortfolioCardHeader
                  activeStateTab={activeStateTab}
                  setActiveStateTab={setActiveStateTab}
                  className=""
                />
              </div>
              {activeStateTab === MyPortfolioHeader.Pools &&
                (activeSection === MyPortfolioSection.Positions ? (
                  <PoolsTablePosition
                    className="md:px-5 md:py-4   py-4"
                    poolsPosition={poolsPosition.data}
                    isfetched={poolsPosition.isfetched}
                  />
                ) : (
                  <>
                    <div className="flex z-10 md:px-[25px] px-4 bg-sideBar md:sticky top-[58px] pt-5">
                      <p>
                        <div className="text-white font-title3">List of my PLY emissions</div>
                        <div className="text-text-250 font-body1">
                          Claim voting rewards for your locks
                        </div>
                      </p>
                      {(isMobile ? scrollY > 100 : scrollY > 150) && (
                        <p
                          id="backToTop"
                          className={clsx(
                            " flex items-center md:font-title3 font-subtitle4 text-primary-500 ml-auto h-[50px] px-[22px] md:px-[26px] bg-primary-500/[0.1] rounded-xl w-[155px]  justify-center animate__animated animate__zoomIn animate__faster",
                            poolsRewards.data?.gaugeEmissionsTotal?.isEqualTo(0)
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          )}
                          onClick={
                            poolsRewards.data?.gaugeEmissionsTotal?.isEqualTo(0)
                              ? () => {}
                              : () => {
                                  setShowClaimPly(true);
                                  setClaimValueDollar(poolsRewards.data.gaugeEmissionsTotal);
                                  setClaimState(EClaimAllState.PLYEMISSION);
                                }
                          }
                        >
                          Claim all
                        </p>
                      )}
                    </div>
                    <PoolsTableRewards
                      className="md:px-5 md:py-4   py-4"
                      poolsData={poolsRewards.data.poolsRewardsData}
                      isfetched={poolsRewards.isfetched}
                    />
                  </>
                ))}

              {activeStateTab === MyPortfolioHeader.Locks &&
                (activeSection === MyPortfolioSection.Positions ? (
                  <>
                    <div className="flex items-center pb-2 md:px-[25px] bg-sideBar md:sticky top-[58px] px-4 z-10 pt-5">
                      <p>
                        <div className="text-white font-title3">List of my locks</div>
                        <div className="text-text-250 font-body1">
                          Discover veNFTs on the largest NFT marketplace on Tezos.
                        </div>
                      </p>
                      <a
                        href={"https://objkt.com/"}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto"
                      >
                        <p className="cursor-pointer flex items-center md:font-title3 font-subtitle4 text-primary-500  h-[50px] px-[15px] md:px-[26px] bg-primary-500/[0.1] rounded-xl w-[155px]  justify-center">
                          Trade locks
                        </p>
                      </a>
                    </div>
                    <LocksTablePosition
                      className="md:px-5 md:pb-4 md:pt-2  py-4"
                      locksPosition={locksPosition.data}
                      isfetched={locksPosition.isfetched}
                      setIsManageLock={setIsManageLock}
                      setShowCreateLockModal={setShowCreateLockModal}
                      setManageData={setManageData}
                      setShowWithdraw={setShowWithdraw}
                    />
                  </>
                ) : (
                  <>
                    <div className="flex md:px-[25px] bg-sideBar md:sticky top-[58px]  z-10  px-4 pt-5">
                      <p>
                        <div className="text-white font-title3">List of my locks</div>
                        <div className="text-text-250 font-body1">
                          Claim voting rewards for your locks
                        </div>
                      </p>
                      {(isMobile ? scrollY > 100 : scrollY > 150) && (
                        <p
                          className={clsx(
                            " flex items-center md:font-title3-bold font-subtitle4 text-black ml-auto h-[50px] px-[22px] md:px-[26px] bg-primary-500 rounded-xl w-[155px]  justify-center animate__animated animate__zoomIn animate__faster",
                            bribesClaimData.length === 0 || feeClaimData.length === 0
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          )}
                          onClick={
                            bribesClaimData.length === 0 || feeClaimData.length === 0
                              ? () => {}
                              : () => {
                                  setShowClaimPly(true);
                                  setClaimValueDollar(tradingfeeStats.plus(bribesStats));
                                  setClaimState(EClaimAllState.LOCKS);
                                }
                          }
                        >
                          Claim all
                        </p>
                      )}
                    </div>

                    <div className="border-b border-text-800/[0.5] pt-[15px] "></div>
                    <div className="flex items-center px-3 md:px-0 py-2 md:py-3 bg-sideBar sticky top-[128px]  z-10 ">
                      <div>
                        <SelectNFTLocks
                          veNFTlist={veNFTlist}
                          selectedText={selectednft}
                          setSelectedDropDown={setSelectednft}
                        />
                      </div>
                    </div>
                    <LocksTableRewards
                      className="md:px-5 md:pb-4   "
                      allLocksRewardsData={allLocksRewardsData}
                      isFetching={fetchingTradingfee}
                      selectedDropDown={selectednft}
                      handleClick={handleClaimALLEpoch}
                      setShowCreateLockModal={setShowCreateLockModal}
                      setEpochClaim={setEpochClaim}
                      epochClaim={epochClaim}
                    />
                  </>
                ))}
            </div>
          )}
        </div>
      </SideBarHOC>
      {isManageLock && (
        <ManageLock
          manageData={manageData}
          setUpdatedPlyVoteValue={setUpdatedPlyVoteValue}
          updatedPlyVoteValue={updatedPlyVoteValue}
          show={isManageLock}
          setShow={handleCloseLock}
          setShowConfirmTransaction={setShowConfirmTransaction}
          showConfirmTransaction={showConfirmTransaction}
          setShowTransactionSubmitModal={setShowTransactionSubmitModal}
          showTransactionSubmitModal={showTransactionSubmitModal}
          setShowCreateLockModal={setShowCreateLockModal}
          handleLockOperation={handleLockOperation}
          setLockingDate={setLockingDate}
          lockingDate={lockingDate}
          setLockingEndData={setLockingEndData}
          lockingEndData={lockingEndData}
          tokenPrice={tokenPrice}
          plyBalance={plyBalance}
          IncreaseLockEndOperation={IncreaseLockEndOperation}
          IncreaseLockValueOperation={IncreaseLockValueOperation}
          handleIncreaseVoteOperation={handleIncreaseVoteOperation}
        />
      )}
      {showCreateLockModal && (
        <CreateLock
          show={showCreateLockModal}
          setShow={handleCloseLock}
          setPlyInput={setPlyInput}
          plyInput={plyInput}
          setShowConfirmTransaction={setShowConfirmTransaction}
          showConfirmTransaction={showConfirmTransaction}
          setShowTransactionSubmitModal={setShowTransactionSubmitModal}
          showTransactionSubmitModal={showTransactionSubmitModal}
          setShowCreateLockModal={setShowCreateLockModal}
          handleLockOperation={handleLockOperation}
          setLockingDate={setLockingDate}
          lockingDate={lockingDate}
          setLockingEndData={setLockingEndData}
          lockingEndData={lockingEndData}
          tokenPrice={tokenPrice}
          plyBalance={plyBalance}
        />
      )}
      {showConfirmTransaction && (
        <ConfirmTransaction
          show={showConfirmTransaction}
          setShow={setShowConfirmTransaction}
          content={contentTransaction}
        />
      )}
      {showWithdraw && (
        <WithdrawPly
          show={showWithdraw}
          setShow={setShowWithdraw}
          handleWithdraw={handleWithdrawOperation}
          ply={manageData.baseValue}
          unclaimedDataTokenId={unclaimedDataTokenId}
          handleWithdrawClaimOperation={handleWithdrawClaimOperation}
        />
      )}
      {showTransactionSubmitModal && (
        <TransactionSubmitted
          show={showTransactionSubmitModal}
          setShow={setShowTransactionSubmitModal}
          onBtnClick={
            transactionId
              ? () => window.open(`https://ghostnet.tzkt.io/${transactionId}`, "_blank")
              : null
          }
          content={contentTransaction}
        />
      )}

      {showClaimPly && (
        <ClaimPly
          show={showClaimPly}
          isSuperNova={claimState === EClaimAllState.SUPERNOVA}
          plyValue={unclaimInflation.unclaimedInflationAmount}
          setShow={setShowClaimPly}
          state={claimState}
          isPly={
            claimState === EClaimAllState.PLYEMISSION || claimState === EClaimAllState.UNCLAIMED
          }
          subValue={
            claimState === EClaimAllState.LOCKS || claimState === EClaimAllState.SUPERNOVA
              ? "value of all the unclaimed rewards"
              : claimState === EClaimAllState.TRADINGFEE
              ? "values of all the unclaimed trading fees"
              : claimState === EClaimAllState.BRIBES
              ? "values of all the unclaimed bribes "
              : claimState === EClaimAllState.UNCLAIMED
              ? "value of all the unclaimed unclaimed inflation "
              : ""
          }
          value={claimValueDollar}
          title={
            claimState === EClaimAllState.BRIBES
              ? "Claim all bribes"
              : claimState === EClaimAllState.TRADINGFEE
              ? "Claim all trading fees"
              : claimState === EClaimAllState.LOCKS || claimState === EClaimAllState.SUPERNOVA
              ? "Claim rewards"
              : claimState === EClaimAllState.PLYEMISSION
              ? "Claim PLY rewards"
              : claimState === EClaimAllState.UNCLAIMED
              ? "Claim unclaimed inflation"
              : ""
          }
          handleClick={
            claimState === EClaimAllState.BRIBES
              ? handleClaimBribes
              : claimState === EClaimAllState.TRADINGFEE
              ? handleClaimFees
              : claimState === EClaimAllState.LOCKS
              ? handleClaimALLFeesAndBribes
              : claimState === EClaimAllState.PLYEMISSION
              ? handleClaimAllPly
              : claimState === EClaimAllState.UNCLAIMED
              ? handleClaimALLUnClaimed
              : claimState === EClaimAllState.SUPERNOVA
              ? handleClaimALLSuperNova
              : () => {}
          }
        />
      )}
      {showVideoModal && <VideoModal closefn={setShowVideoModal} linkString={"UXBs3vi26_A"} />}
    </>
  );
}

MyPortfolio.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  operationSuccesful: PropTypes.bool.isRequired,
};
function mapStateToProps(
  state: { walletLoading: { isLoading: boolean; operationSuccesful: boolean } },
  ownProps: any
) {
  return {
    isLoading: state.walletLoading.isLoading,
    operationSuccesful: state.walletLoading.operationSuccesful,
  };
}

export default connect(mapStateToProps)(MyPortfolio);
