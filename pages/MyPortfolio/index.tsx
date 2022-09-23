import Head from "next/head";
import Image from "next/image";
import PropTypes from "prop-types";
import * as React from "react";
import { BigNumber } from "bignumber.js";
import { useEffect, useState, useRef } from "react";
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
import { IVeNFTData, IVotePageData } from "../../src/api/votes/types";
import { getCompleteUserBalace, getUserBalanceByRpc } from "../../src/api/util/balance";
import { IAllBalanceResponse, ILpTokenPriceList, ITokenPriceList } from "../../src/api/util/types";
import CreateLock from "../../src/components/Votes/CreateLock";
import ConfirmTransaction from "../../src/components/ConfirmTransaction";
import TransactionSubmitted from "../../src/components/TransactionSubmitted";
import {
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
} from "../../src/api/portfolio/kiran";
import {
  IAllLocksPositionData,
  IPoolsRewardsResponse,
  IPositionsData,
  IPositionStatsResponse,
} from "../../src/api/portfolio/types";
import { getLPTokenPrices, getTokenPrices } from "../../src/api/util/price";
import finalPropsSelectorFactory from "react-redux/es/connect/selectorFactory";
import WithdrawPly from "../../src/components/LocksPosition/WithdrawPopup";
import { setIsLoadingWallet } from "../../src/redux/walletLoading";
import SelectNFT from "../../src/components/Votes/SelectNFT";
import { InputSearchBox } from "../../src/components/Pools/Component/SearchInputBox";
import { LocksTableRewards } from "../../src/components/LocksRewards/LocksRewardsTable";
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
  const userAddress = store.getState().wallet.address;
  //const userAddress = "tz1QNjbsi2TZEusWyvdH3nmsCVE3T1YqD9sv";
  // const isLoading = store.getState().walletLoading.isLoading;
  // const operationSuccesful = store.getState().walletLoading.operationSuccesful;
  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.config.tokens);
  const totalVotingPowerError = useAppSelector((state) => state.pools.totalVotingPowerError);
  const epochError = useAppSelector((state) => state.epoch).epochFetchError;
  const amm = useAppSelector((state) => state.config.AMMs);

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
  const [searchValue, setSearchValue] = useState("");
  const [selectednft, setSelectednft] = useState(selectedDropDown);
  const [veNFTlist, setVeNFTlist] = useState<IVeNFTData[]>([]);
  const [contentTransaction, setContentTransaction] = useState("");
  const [plyBalance, setPlyBalance] = useState(new BigNumber(0));
  const [poolsPosition, setPoolsPosition] = useState<IPositionsData[]>([] as IPositionsData[]);
  const [poolsRewards, setPoolsRewards] = useState<IPoolsRewardsResponse>(
    {} as IPoolsRewardsResponse
  );
  const [locksPosition, setLocksPosition] = useState<IAllLocksPositionData[]>(
    [] as IAllLocksPositionData[]
  );
  const currentEpoch = store.getState().epoch.currentEpoch;

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
      setStatsPosition({} as IPositionStatsResponse);
      setPoolsPosition([] as IPositionsData[]);
      setPoolsRewards({} as IPoolsRewardsResponse);
      if (Object.keys(lpTokenPrice).length !== 0 && Object.keys(tokenPrice).length !== 0) {
        getPositionStatsData(userAddress, tokenPrice, lpTokenPrice).then((res) => {
          console.log(res);
          setStatsPosition(res);
        });
        getPositionsData(userAddress, lpTokenPrice).then((res) => {
          console.log(res);
          setPoolsPosition(res.positionPoolsData);
        });
      }
      if (Object.keys(tokenPrice).length !== 0) {
        getPoolsRewardsData(userAddress, tokenPrice).then((res) => {
          console.log(res);
          setPoolsRewards(res);
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
    if (userAddress) {
      setLocksPosition([] as IAllLocksPositionData[]);
      getAllLocksPositionData(userAddress).then((res) => {
        console.log(res);
        setLocksPosition(res.allLocksData.reverse());
      });
    }
  }, [userAddress, activeSection, currentEpoch?.epochNumber]);
  useEffect(() => {
    console.log(props.isLoading, props.operationSuccesful);
    if (!props.isLoading && props.operationSuccesful) {
      setLocksPosition([] as IAllLocksPositionData[]);
      setStatsPosition({} as IPositionStatsResponse);
      setPoolsPosition([] as IPositionsData[]);
      getAllLocksPositionData(userAddress).then((res) => {
        console.log(res);
        setLocksPosition(res.allLocksData.reverse());
      });
      if (Object.keys(lpTokenPrice).length !== 0 && Object.keys(tokenPrice).length !== 0) {
        getPositionStatsData(userAddress, tokenPrice, lpTokenPrice).then((res) => {
          console.log(res);
          setStatsPosition(res);
        });
        getPositionsData(userAddress, lpTokenPrice).then((res) => {
          console.log(res);
          setPoolsPosition(res.positionPoolsData);
        });
      }
    }
  }, [props.operationSuccesful, props.isLoading]);

  const resetAllValues = () => {
    setPlyInput("");
    setLockingDate("");

    setUpdatedPlyVoteValue("");
    setLockingEndData({
      selected: 0,
      lockingDate: 0,
    });
  };

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
          setLockOperation(true);
        }, 2000);
        setTimeout(() => {
          setLockOperation(false);
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
          setLockOperation(true);
        }, 6000);
        setTimeout(() => {
          setLockOperation(false);
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
          setLockOperation(true);
        }, 4000);
        setTimeout(() => {
          setLockOperation(false);
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
          setLockOperation(true);
        }, 4000);
        setTimeout(() => {
          setLockOperation(false);
        }, 20000);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
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
          setLockOperation(true);
        }, 4000);
        setTimeout(() => {
          setLockOperation(false);
        }, 20000);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
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
        <div className="pt-5 md:px-[24px] ">
          <div className="flex gap-1">
            <p
              className={clsx(
                " font-title3 cursor-pointer h-[50px] px-[24px] flex items-center   gap-1",
                activeSection === MyPortfolioSection.Positions
                  ? "text-primary-500 bg-primary-500/[0.1] border border-primary-500/[0.6]"
                  : "text-text-250 bg-muted-700"
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
                " cursor-pointer font-title3  h-[50px] px-[24px] flex items-center gap-1",
                activeSection === MyPortfolioSection.Rewards
                  ? "text-primary-500 bg-primary-500/[0.1] border border-primary-500/[0.6]"
                  : "text-text-250 bg-muted-700"
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
              <StatsRewards plyEmission={poolsRewards.gaugeEmissionsTotal} />
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
                <p className="flex items-center md:font-title3-bold font-subtitle4 text-primary-500 ml-auto h-[50px] px-[22px] md:px-[26px] bg-primary-500/[0.1] rounded-xl w-[155px]  justify-center">
                  Claim all
                </p>
              </div>
              <PoolsTableRewards
                className="md:px-5 md:py-4   py-4"
                poolsData={poolsRewards.poolsRewardsData}
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
                <p className="flex items-center md:font-title3-bold font-subtitle4 text-black ml-auto h-[50px] px-[22px] md:px-[26px] bg-primary-500 rounded-xl w-[155px]  justify-center">
                  Claim all
                </p>
              </div>

              <div className="border-b border-text-800/[0.5] mt-[15px]"></div>
              <div className="flex items-center px-3 md:px-0 py-2 md:py-3 ">
                <div>
                  <SelectNFT
                    veNFTlist={veNFTlist}
                    selectedText={selectedDropDown}
                    setSelectedDropDown={setSelectednft}
                  />
                </div>
                <div className="ml-auto ">
                  <InputSearchBox
                    className=""
                    value={searchValue}
                    onChange={setSearchValue}
                    width={"md:w-245px xl:w-[260px]"}
                  />
                </div>
              </div>
              <LocksTableRewards className="md:px-5 md:pb-4   " voteData={voteData} />
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
            transactionId ? () => window.open(`https://tzkt.io/${transactionId}`, "_blank") : null
          }
          content={contentTransaction}
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
