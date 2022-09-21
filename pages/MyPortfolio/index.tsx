import Head from "next/head";
import Image from "next/image";
import * as React from "react";
import { BigNumber } from "bignumber.js";
import { useEffect, useState, useRef } from "react";
import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { useDispatch } from "react-redux";
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
import { votesPageDataWrapper } from "../../src/api/votes";
import { IVotePageData } from "../../src/api/votes/types";
import { getCompleteUserBalace, getUserBalanceByRpc } from "../../src/api/util/balance";
import { IAllBalanceResponse, ILpTokenPriceList, ITokenPriceList } from "../../src/api/util/types";
import CreateLock from "../../src/components/Votes/CreateLock";
import ConfirmTransaction from "../../src/components/ConfirmTransaction";
import TransactionSubmitted from "../../src/components/TransactionSubmitted";
import { setLoading } from "../../src/redux/isLoading/action";
import {
  createLock,
  increaseLockAndValue,
  increaseLockEnd,
  increaseLockValue,
} from "../../src/operations/locks";
import { LocksTablePosition } from "../../src/components/LocksPosition/LocksTable";
import clsx from "clsx";
import StatsRewards from "../../src/components/Rewards/Stats";
import { MODULE } from "../../src/components/Votes/types";
import { PoolsTableRewards } from "../../src/components/PoolsRewards/poolsRewardsTable";
import ManageLock from "../../src/components/LocksPosition/ManageLock";
import {
  getAllLocksPositionData,
  getPositionsData,
  getPositionStatsData,
} from "../../src/api/portfolio/kiran";
import {
  IAllLocksPositionData,
  IPositionsData,
  IPositionStatsResponse,
} from "../../src/api/portfolio/types";
import { getLPTokenPrices, getTokenPrices } from "../../src/api/util/price";
import finalPropsSelectorFactory from "react-redux/es/connect/selectorFactory";
export enum MyPortfolioSection {
  Positions = "Positions",
  Rewards = "Rewards",
}
export default function MyPortfolio() {
  const [activeStateTab, setActiveStateTab] = React.useState<MyPortfolioHeader>(
    MyPortfolioHeader.Pools
  );
  const [activeSection, setActiveSection] = React.useState<MyPortfolioSection>(
    MyPortfolioSection.Positions
  );
  const userAddress = store.getState().wallet.address;
  const isLoading = store.getState().isLoadingWallet.isLoading;
  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.config.tokens);
  const totalVotingPowerError = useAppSelector((state) => state.pools.totalVotingPowerError);
  const epochError = useAppSelector((state) => state.epoch).epochFetchError;
  const amm = useAppSelector((state) => state.config.AMMs);
  const [showCreateLockModal, setShowCreateLockModal] = useState(false);
  const [isManageLock, setIsManageLock] = useState(false);
  const [plyInput, setPlyInput] = useState("");
  const [updatedPlyVoteValue, setUpdatedPlyVoteValue] = useState("");
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
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
  const [contentTransaction, setContentTransaction] = useState("");
  const [plyBalance, setPlyBalance] = useState(new BigNumber(0));
  const [poolsPosition, setPoolsPosition] = useState<IPositionsData[]>([] as IPositionsData[]);
  const [locksPosition, setLocksPosition] = useState<IAllLocksPositionData[]>(
    [] as IAllLocksPositionData[]
  );

  const [lockOperation, setLockOperation] = useState(false);
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
  const [voteData, setVoteData] = useState<{ [id: string]: IVotePageData }>(
    {} as { [id: string]: IVotePageData }
  );
  const [statsPositions, setStatsPosition] = useState<IPositionStatsResponse>(
    {} as IPositionStatsResponse
  );
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
      setLocksPosition([] as IAllLocksPositionData[]);
      setStatsPosition({} as IPositionStatsResponse);
      setPoolsPosition([] as IPositionsData[]);
      if (Object.keys(lpTokenPrice).length !== 0 && Object.keys(tokenPrice).length !== 0) {
        getPositionStatsData(userAddress, tokenPrice, lpTokenPrice).then((res) => {
          setStatsPosition(res);
        });
        getPositionsData(userAddress, lpTokenPrice).then((res) => {
          setPoolsPosition(res.positionPoolsData);
        });
      }
      getAllLocksPositionData(userAddress).then((res) => {
        setLocksPosition(res.allLocksData);
      });
    }
  }, [isLoading, userAddress, lpTokenPrice]);

  // useEffect(() => {
  //   if (
  //     userAddress &&
  //     Object.keys(lpTokenPrice).length !== 0 &&
  //     Object.keys(tokenPrice).length !== 0
  //   ) {
  //     setStatsPosition({} as IPositionStatsResponse);
  //     setPoolsPosition([] as IPositionsData[]);
  //     getPositionStatsData(userAddress, tokenPrice, lpTokenPrice).then((res) => {
  //       setStatsPosition(res);
  //     });
  //     getPositionsData(userAddress, lpTokenPrice).then((res) => {
  //       setPoolsPosition(res.positionPoolsData);
  //     });
  //   }
  // }, [userAddress, lpTokenPrice]);

  const resetAllValues = () => {
    setPlyInput("");
    setLockingDate("");
    setLockingEndData({
      selected: 0,
      lockingDate: 0,
    });
  };
  const handleLockOperation = () => {
    setContentTransaction(`Locking ${plyInput} ply`);
    setShowCreateLockModal(false);
    setShowConfirmTransaction(true);
    dispatch(setLoading(true));
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
          setLockOperation(true);
        }, 6000);
        setTimeout(() => {
          setLockOperation(false);
        }, 20000);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
        dispatch(setLoading(false));
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
        dispatch(setLoading(false));
      }
    });
  };
  const handleIncreaseVoteOperation = () => {
    setIsManageLock(false);
    setContentTransaction(`Locking ${plyInput} ply`);
    setShowCreateLockModal(false);

    setShowConfirmTransaction(true);
    dispatch(setLoading(true));
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
          setLockOperation(true);
        }, 6000);
        setTimeout(() => {
          setLockOperation(false);
        }, 20000);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
        dispatch(setLoading(false));
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
        dispatch(setLoading(false));
      }
    });
  };

  const IncreaseLockEndOperation = () => {
    setIsManageLock(false);
    setContentTransaction(`Increase lock`);
    setShowCreateLockModal(false);
    setShowConfirmTransaction(true);
    dispatch(setLoading(true));
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
          setLockOperation(true);
        }, 6000);
        setTimeout(() => {
          setLockOperation(false);
        }, 20000);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
        dispatch(setLoading(false));
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
        dispatch(setLoading(false));
      }
    });
  };
  const IncreaseLockValueOperation = () => {
    setIsManageLock(false);
    setContentTransaction(`Increase lock`);
    setShowCreateLockModal(false);
    setShowConfirmTransaction(true);
    dispatch(setLoading(true));
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
          setLockOperation(true);
        }, 6000);
        setTimeout(() => {
          setLockOperation(false);
        }, 20000);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
        dispatch(setLoading(false));
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
        dispatch(setLoading(false));
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
        <div className="pt-5 md:px-[24px] ">
          <div className="flex gap-1">
            <p
              className={clsx(
                " font-title3 cursor-pointer md:h-[40px] h-[52px] px-[24px] flex items-center  rounded-lg gap-1",
                activeSection === MyPortfolioSection.Positions
                  ? "text-primary-500 bg-primary-500/[0.1]"
                  : "text-text-250"
              )}
              onClick={() => setActiveSection(MyPortfolioSection.Positions)}
            >
              Positions{" "}
              {activeSection === MyPortfolioSection.Positions ? (
                <Image src={positionsViolet} />
              ) : (
                <Image src={position} />
              )}
            </p>
            <p
              className={clsx(
                "rounded-lg cursor-pointer font-title3  md:h-[40px] h-[52px] px-[24px] flex items-center gap-1",
                activeSection === MyPortfolioSection.Rewards
                  ? "text-primary-500 bg-primary-500/[0.1]"
                  : "text-text-250"
              )}
              onClick={() => setActiveSection(MyPortfolioSection.Rewards)}
            >
              Rewards
              {activeSection === MyPortfolioSection.Rewards ? (
                <Image src={rewardsViolet} />
              ) : (
                <Image src={rewards} />
              )}
            </p>
          </div>

          <div className="mt-5 pl-5  md:pl-0 overflow-x-auto inner">
            {activeSection === MyPortfolioSection.Positions ? (
              <Stats
                setShowCreateLockModal={setShowCreateLockModal}
                plyBalance={plyBalance}
                tokenPricePly={tokenPrice["PLY"]}
                statsPositions={statsPositions}
              />
            ) : (
              <StatsRewards />
            )}
          </div>
        </div>
        <div className="border-t border-text-800/[0.5] mt-5"></div>
        <div className=" md:px-[24px]">
          <MyPortfolioCardHeader
            activeStateTab={activeStateTab}
            setActiveStateTab={setActiveStateTab}
            className="md:px-3"
          />
        </div>
        {activeStateTab === MyPortfolioHeader.Pools &&
          (activeSection === MyPortfolioSection.Positions ? (
            <PoolsTablePosition className="md:px-5 md:py-4   py-4" poolsPosition={poolsPosition} />
          ) : (
            <>
              <div className="flex md:px-[25px] px-4  mt-5">
                <p>
                  <div className="text-white font-title3">List of my PLY emissions</div>
                  <div className="text-text-250 font-body1">
                    Discover veNFTs on the largest NFT marketplace on Tezos.
                  </div>
                </p>
                <p className="flex items-center md:font-title3-bold font-subtitle4 text-black ml-auto h-[50px] md:px-[40px] px-[26px] bg-primary-500 rounded-xl w-[155px]  justify-center">
                  Claim all
                </p>
              </div>
              <PoolsTableRewards className="md:px-5 md:py-4   py-4" voteData={voteData} />
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
                <p className="flex items-center md:font-title3-bold font-subtitle4 text-primary-500 ml-auto h-[50px] px-[22px] md:px-[26px] bg-primary-500/[0.1] rounded-xl w-[155px]  justify-center">
                  Trade locks
                </p>
              </div>
              <LocksTablePosition
                className="md:px-5 md:py-4   py-4"
                locksPosition={locksPosition}
                setIsManageLock={setIsManageLock}
                setShowCreateLockModal={setShowCreateLockModal}
                setManageData={setManageData}
              />
            </>
          ) : null)}
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
      {showTransactionSubmitModal && (
        <TransactionSubmitted
          show={showTransactionSubmitModal}
          setShow={setShowTransactionSubmitModal}
          onBtnClick={
            transactionId ? () => window.open(`https://tzkt.io/${transactionId}`, "_blank") : null
          }
          content={contentTransaction}
        />
      )}
    </>
  );
}
