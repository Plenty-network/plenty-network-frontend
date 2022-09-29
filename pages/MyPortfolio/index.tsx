import Head from "next/head";
import Image from "next/image";
import PropTypes from "prop-types";
import * as React from "react";
import { BigNumber } from "bignumber.js";
import { useEffect, useState, useRef, useMemo } from "react";
import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { connect, useDispatch } from "react-redux";
import { AppDispatch, store, useAppSelector } from "../../src/redux";
import { fetchWallet } from "../../src/redux/wallet/wallet";
import { createGaugeConfig, getConfig } from "../../src/redux/config/config";
import { getLpTokenPrice, getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import { getTotalVotingPower } from "../../src/redux/pools";
import { getEpochData } from "../../src/redux/epoch/epoch";
import { useInterval } from "../../src/hooks/useInterval";

import rewardsViolet from "../../src/assets/icon/myPortfolio/rewardsViolet.svg";
import positionsViolet from "../../src/assets/icon/myPortfolio/positionsViolet.svg";
import rewards from "../../src/assets/icon/myPortfolio/rewards.svg";
import position from "../../src/assets/icon/myPortfolio/positions.svg";
import Stats from "../../src/components/Positions/Stats";
import {
  Header,
  MyPortfolioCardHeader,
  MyPortfolioHeader,
} from "../../src/components/Positions/Header";
import { PoolsTablePosition } from "../../src/components/PoolsPosition/poolsTable";
import { getVeNFTsList, votesPageDataWrapper } from "../../src/api/votes";
import { ELocksState, IVeNFTData, IVotePageData } from "../../src/api/votes/types";
import { getCompleteUserBalace, getUserBalanceByRpc } from "../../src/api/util/balance";
import { IAllBalanceResponse, ILpTokenPriceList, ITokenPriceList } from "../../src/api/util/types";
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
import { MODULE } from "../../src/components/Votes/types";
import { PoolsTableRewards } from "../../src/components/PoolsRewards/poolsRewardsTable";
import ManageLock from "../../src/components/LocksPosition/ManageLock";
import {
  getAllLocksPositionData,
  getPoolsRewardsData,
  getPositionsData,
  getPositionStatsData,
  getTvlStatsData,
  getVotesStatsData,
} from "../../src/api/portfolio/kiran";
import {
  IAllLocksPositionData,
  IPoolsRewardsResponse,
  IPositionsData,
  IPositionStatsResponse,
  ITvlStatsResponse,
  IVotesStatsDataResponse,
} from "../../src/api/portfolio/types";
import WithdrawPly from "../../src/components/LocksPosition/WithdrawPopup";
import { setIsLoadingWallet } from "../../src/redux/walletLoading";
import { InputSearchBox } from "../../src/components/Pools/Component/SearchInputBox";
import { LocksTableRewards } from "../../src/components/LocksRewards/LocksRewardsTable";
import ClaimAll from "../../src/components/Rewards/ClaimAll";
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
import ClaimPly from "../../src/components/PoolsRewards/ClaimPopup";
import { EClaimAllState } from "../../src/components/Rewards/types";
export enum MyPortfolioSection {
  Positions = "Positions",
  Rewards = "Rewards",
}
function MyPortfolio(props: any) {
  const [activeStateTab, setActiveStateTab] = React.useState<MyPortfolioHeader>(
    MyPortfolioHeader.Pools
  );
  const [activeSection, setActiveSection] = React.useState<MyPortfolioSection>(
    MyPortfolioSection.Positions
  );

  const [showClaimPly, setShowClaimPly] = React.useState(false);

  const [epochClaim, setEpochClaim] = React.useState("");
  const userAddress = store.getState().wallet.address;
  //const userAddress = "tz1QNjbsi2TZEusWyvdH3nmsCVE3T1YqD9sv"; //kiran
  //const userAddress = "tz1NaGu7EisUCyfJpB16ktNxgSqpuMo8aSEk"; //udit
  //tz1QNjbsi2TZEusWyvdH3nmsCVE3T1YqD9sv kiran

  const dispatch = useDispatch<AppDispatch>();

  // const [showClaimAllPly, setShowClaimAllPly] = React.useState(false);
  const token = useAppSelector((state) => state.config.tokens);
  const inflationData = store.getState().portfolioRewards.claimAllInflationData;
  const totalVotingPowerError = useAppSelector((state) => state.pools.totalVotingPowerError);
  const epochError = useAppSelector((state) => state.epoch).epochFetchError;
  const amm = useAppSelector((state) => state.config.AMMs);
  const unclaimInflation = store.getState().portfolioRewards.unclaimedInflationData;
  const [showCreateLockModal, setShowCreateLockModal] = useState(false);
  const [isManageLock, setIsManageLock] = useState(false);
  const [plyInput, setPlyInput] = useState("");
  const selectedDropDown = store.getState().veNFT.selectedDropDown;
  const [updatedPlyVoteValue, setUpdatedPlyVoteValue] = useState("");
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [lockingDate, setLockingDate] = useState("");
  const tokenPrice = store.getState().tokenPrice.tokenPrice;
  const lpTokenPrice = store.getState().tokenPrice.lpTokenPrices;
  const [transactionId, setTransactionId] = useState("");
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const [manageData, setManageData] = useState<IAllLocksPositionData>({} as IAllLocksPositionData);
  const [lockingEndData, setLockingEndData] = useState({
    selected: 0,
    lockingDate: 0,
  });
  const [claimState, setClaimState] = useState<EClaimAllState>(-1 as EClaimAllState);
  const allLocksRewardsData = store.getState().portfolioRewards.allLocksRewardsData;
  const [selectednft, setSelectednft] = useState(selectedDropDown);
  const bribesClaimData = store.getState().portfolioRewards.bribesClaimData;
  const epochClaimData = store.getState().portfolioRewards.epochClaimData;
  const feeClaimData = store.getState().portfolioRewards.feesClaimData;
  const bribesStats = store.getState().portfolioRewards.totalBribesAmount;
  const tradingfeeStats = store.getState().portfolioRewards.totalTradingFeesAmount;
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
  const currentEpoch = store.getState().epoch.currentEpoch;
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
  const [voteData, setVoteData] = useState<{ [id: string]: IVotePageData }>(
    {} as { [id: string]: IVotePageData }
  );
  const [statsPositions, setStatsPosition] = useState<ITvlStatsResponse>({} as ITvlStatsResponse);
  const [stats1, setStats1] = useState<IVotesStatsDataResponse>({} as IVotesStatsDataResponse);

  useEffect(() => {
    votesPageDataWrapper(934, undefined).then((res) => {
      setVoteData(res.allData);
    });
  }, []);

  useEffect(() => {
    if (userAddress) {
      getUserBalanceByRpc("PLY", userAddress).then((res) => {
        setPlyBalance(res.balance);
      });
    }
  }, [userAddress, tokenPrice, balanceUpdate, token]);

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
      setStatsPosition({} as ITvlStatsResponse);
      setPoolsPosition({ data: [] as IPositionsData[], isfetched: false });
      setPoolsRewards({ data: {} as IPoolsRewardsResponse, isfetched: false });

      if (Object.keys(lpTokenPrice).length !== 0 && Object.keys(tokenPrice).length !== 0) {
        getTvlStatsData(userAddress, tokenPrice, lpTokenPrice).then((res) => {
          setStatsPosition(res);
        });
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
      setLocksPosition({ data: [] as IAllLocksPositionData[], isfetched: false });
      setStats1({} as IVotesStatsDataResponse);
      getVotesStatsData(userAddress).then((res) => {
        setStats1(res);
      });
      getAllLocksPositionData(userAddress).then((res) => {
        setLocksPosition({ data: res.allLocksData.reverse(), isfetched: true });
      });
    }
  }, [userAddress, activeSection, currentEpoch?.epochNumber]);
  useEffect(() => {
    if (!props.isLoading && props.operationSuccesful && userAddress) {
      setLocksPosition({ data: [] as IAllLocksPositionData[], isfetched: false });
      setStatsPosition({} as IPositionStatsResponse);
      setPoolsPosition({ data: [] as IPositionsData[], isfetched: false });
      getAllLocksPositionData(userAddress).then((res) => {
        setLocksPosition({ data: res.allLocksData.reverse(), isfetched: true });
      });
      if (Object.keys(lpTokenPrice).length !== 0 && Object.keys(tokenPrice).length !== 0) {
        getPositionStatsData(userAddress, tokenPrice, lpTokenPrice).then((res) => {
          setStatsPosition(res);
        });
        getPositionsData(userAddress, lpTokenPrice).then((res) => {
          setPoolsPosition({ data: res.positionPoolsData, isfetched: true });
        });
      }
    }
  }, [props.operationSuccesful, props.isLoading, userAddress]);
  useEffect(() => {
    if (claimOperation) {
      dispatch(
        fetchAllLocksRewardsData({ userTezosAddress: userAddress, tokenPrices: tokenPrice })
      );
      dispatch(fetchAllRewardsOperationsData(userAddress));
      dispatch(
        fetchUnclaimedInflationData({ userTezosAddress: userAddress, tokenPrices: tokenPrice })
      );
    }
  }, [claimOperation]);

  const resetAllValues = () => {
    setPlyInput("");
    setLockingDate("");

    setUpdatedPlyVoteValue("");
    setLockingEndData({
      selected: 0,
      lockingDate: 0,
    });
  };
  const Title = useMemo(() => {
    return (
      <div className="flex gap-1">
        <p
          className={clsx(
            " font-title3 cursor-pointer h-[50px] px-4 md:px-[24px] flex items-center   gap-1",
            activeSection === MyPortfolioSection.Positions
              ? "text-primary-500 bg-primary-500/[0.1] border border-primary-500/[0.6]"
              : "text-text-250 bg-muted-700 rounded-l-lg"
          )}
          onClick={() => setActiveSection(MyPortfolioSection.Positions)}
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
            " cursor-pointer font-title3  h-[50px] px-4 md:px-[24px] flex items-center gap-1",
            activeSection === MyPortfolioSection.Rewards
              ? "text-primary-500 bg-primary-500/[0.1] border border-primary-500/[0.6]"
              : "text-text-250 bg-muted-700"
          )}
          onClick={() => setActiveSection(MyPortfolioSection.Rewards)}
        >
          Rewards
          {activeSection === MyPortfolioSection.Rewards ? (
            <Image alt={"alt"} src={rewardsViolet} />
          ) : (
            <Image alt={"alt"} src={rewards} />
          )}
        </p>
      </div>
    );
  }, [activeSection]);
  const handleWithdrawOperation = () => {
    setContentTransaction(`Withdraw ${manageData.baseValue.toNumber()} ply`);
    setShowWithdraw(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    withdrawLock(
      manageData.tokenId.toNumber(),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
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
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleLockOperation = () => {
    setContentTransaction(`Locking ${plyInput} ply`);
    setShowCreateLockModal(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    createLock(
      userAddress,
      new BigNumber(plyInput),
      new BigNumber(lockingEndData.lockingDate),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
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
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleIncreaseVoteOperation = () => {
    setIsManageLock(false);
    setContentTransaction(`Locking ${plyInput} ply`);
    setShowCreateLockModal(false);

    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    increaseLockAndValue(
      manageData.tokenId.toNumber(),
      new BigNumber(plyInput),
      new BigNumber(lockingEndData.lockingDate),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
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
    increaseLockEnd(
      manageData.tokenId.toNumber(),
      new BigNumber(lockingEndData.lockingDate),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
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
    increaseLockValue(
      manageData.tokenId.toNumber(),
      new BigNumber(updatedPlyVoteValue),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
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
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleClaimAll = () => {
    setShowClaimPly(false);
    setContentTransaction(`Claim All ply`);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    harvestAllRewards(
      poolsRewards.data.gaugeAddresses,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setClaimOperation(true);
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
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleClaimBribes = () => {
    setContentTransaction(`Claim all bribes`);
    setShowClaimPly(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    claimAllBribeForAllLocks(
      bribesClaimData,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setClaimOperation(true);
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
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleClaimFees = () => {
    setContentTransaction(`Claim all bribes`);
    setShowClaimPly(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    claimAllFeeForAllLocks(
      feeClaimData,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setClaimOperation(true);
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
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleClaimALLFeesAndBribes = () => {
    setContentTransaction(`Claim all bribes`);
    setShowClaimPly(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    claimAllRewardsForAllLocks(
      bribesClaimData,
      feeClaimData,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setClaimOperation(true);
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
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleClaimALLEpoch = () => {
    setContentTransaction(`Claim all bribes`);
    setShowClaimPly(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    claimAllForEpoch(
      epochClaimData[selectednft.tokenId][epochClaim],
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setClaimOperation(true);
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
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleClaimALLUnClaimed = () => {
    setContentTransaction(`Claim all unclaimed`);
    setShowClaimPly(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    claimAllInflation(
      inflationData,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setClaimOperation(true);
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
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const handleClaimALLSuperNova = () => {
    setContentTransaction(`Claim all unclaimed`);
    setShowClaimPly(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    claimSupernova(
      poolsRewards.data.gaugeAddresses,
      feeClaimData,
      bribesClaimData,
      inflationData,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          setClaimOperation(true);
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
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  return (
    <>
      <Head>
        <title className="font-medium1">Plenty network</title>
        <meta name="description" content="plenty network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBarHOC>
        <div className="pt-5 md:px-[24px] px-2">
          <div className="flex">
            {Title}
            {activeSection === MyPortfolioSection.Rewards && (
              <div
                className={clsx(
                  " flex items-center md:font-title3-bold font-subtitle4 text-black ml-auto h-[50px] px-[12px] md:px-[40px] bg-primary-500 rounded-xl md:w-[155px]  justify-center",
                  poolsRewards.data?.gaugeAddresses?.length === 0 &&
                    feeClaimData?.length === 0 &&
                    bribesClaimData?.length === 0 &&
                    inflationData?.length === 0
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                )}
                onClick={
                  poolsRewards.data?.gaugeAddresses?.length === 0 &&
                  feeClaimData?.length === 0 &&
                  bribesClaimData?.length === 0 &&
                  inflationData?.length === 0
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
                Claim all
              </div>
            )}
          </div>
          <div className="mt-5 pl-5  md:pl-0 overflow-x-auto inner">
            {activeSection === MyPortfolioSection.Positions ? (
              <Stats
                setShowCreateLockModal={setShowCreateLockModal}
                plyBalance={plyBalance}
                tokenPricePly={tokenPrice["PLY"]}
                statsPositions={statsPositions}
                stats1={stats1}
              />
            ) : (
              <StatsRewards
                plyEmission={poolsRewards.data.gaugeEmissionsTotal}
                tradingfeeStats={tradingfeeStats}
                bribesStats={bribesStats}
                setClaimValueDollar={setClaimValueDollar}
                setShowClaimPly={setShowClaimPly}
                setClaimState={setClaimState}
                bribesClaimData={bribesClaimData}
                feeClaimData={feeClaimData}
                unclaimInflation={unclaimInflation}
              />
            )}
          </div>
        </div>
        <div className="border-t border-text-800/[0.5] mt-5"></div>
        <div className=" ">
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
              <div className="flex md:px-[25px] px-4  mt-5">
                <p>
                  <div className="text-white font-title3">List of my PLY emissions</div>
                  <div className="text-text-250 font-body1">
                    Discover veNFTs on the largest NFT marketplace on Tezos.
                  </div>
                </p>
                <p
                  className={clsx(
                    " flex items-center md:font-title3-bold font-subtitle4 text-primary-500 ml-auto h-[50px] px-[22px] md:px-[26px] bg-primary-500/[0.1] rounded-xl w-[155px]  justify-center",
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
              <div className="flex md:px-[25px] px-4 mt-5">
                <p>
                  <div className="text-white font-title3">List of my locks</div>
                  <div className="text-text-250 font-body1">
                    Discover veNFTs on the largest NFT marketplace on Tezos.
                  </div>
                </p>
                <p className="cursor-pointer flex items-center md:font-title3-bold font-subtitle4 text-primary-500 ml-auto h-[50px] px-[22px] md:px-[26px] bg-primary-500/[0.1] rounded-xl w-[155px]  justify-center">
                  Trade locks
                </p>
              </div>
              <LocksTablePosition
                className="md:px-5 md:py-4   py-4"
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
              <div className="flex md:px-[25px] px-4 mt-5">
                <p>
                  <div className="text-white font-title3">List of my locks</div>
                  <div className="text-text-250 font-body1">
                    Discover veNFTs on the largest NFT marketplace on Tezos.
                  </div>
                </p>
                <p
                  className={clsx(
                    " flex items-center md:font-title3-bold font-subtitle4 text-black ml-auto h-[50px] px-[22px] md:px-[26px] bg-primary-500 rounded-xl w-[155px]  justify-center",
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
              </div>

              <div className="border-b border-text-800/[0.5] mt-[15px]"></div>
              <div className="flex items-center px-3 md:px-0 py-2 md:py-3 ">
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
                voteData={voteData}
                allLocksRewardsData={allLocksRewardsData}
                selectedDropDown={selectednft}
                handleClick={handleClaimALLEpoch}
                setEpochClaim={setEpochClaim}
                epochClaim={epochClaim}
              />
            </>
          ))}
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
      {/* {showClaimAllPly && (
        <ClaimAll
          show={showClaimAllPly}
          setShow={setShowClaimAllPly}
          data={poolsRewards.data.poolsRewardsData}
          totalValue={poolsRewards.data.gaugeEmissionsTotal}
          tokenPrice={tokenPrice}
          handleClaimAll={handleClaimAll}
        />
      )} */}
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
              ? handleClaimAll
              : claimState === EClaimAllState.UNCLAIMED
              ? handleClaimALLUnClaimed
              : claimState === EClaimAllState.SUPERNOVA
              ? handleClaimALLSuperNova
              : () => {}
          }
        />
      )}
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
