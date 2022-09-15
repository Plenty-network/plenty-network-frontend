import Head from "next/head";
import Image from "next/image";
import * as React from "react";
import { BigNumber } from "bignumber.js";
import { useEffect, useState, useRef } from "react";
import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { useDispatch } from "react-redux";
import { AppDispatch, store, useAppSelector } from "../../src/redux";
import { fetchWallet } from "../../src/redux/wallet/wallet";
import { getConfig } from "../../src/redux/config/config";
import { getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
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
import { getCompleteUserBalace } from "../../src/api/util/balance";
import { IAllBalanceResponse } from "../../src/api/util/types";
import CreateLock from "../../src/components/Votes/CreateLock";
import ConfirmTransaction from "../../src/components/ConfirmTransaction";
import TransactionSubmitted from "../../src/components/TransactionSubmitted";
import { setLoading } from "../../src/redux/isLoading/action";
import { createLock } from "../../src/operations/locks";
import { LocksTablePosition } from "../../src/components/LocksPosition/LocksTable";
import clsx from "clsx";
import StatsRewards from "../../src/components/Rewards/Stats";
import { MODULE } from "../../src/components/Votes/types";
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
  const [showCreateLockModal, setShowCreateLockModal] = useState(false);
  const [isManageLock, setIsManageLock] = useState(false);
  const [plyInput, setPlyInput] = useState("");
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [lockingDate, setLockingDate] = useState("");
  const tokenPrice = store.getState().tokenPrice.tokenPrice;
  const [transactionId, setTransactionId] = useState("");
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const [lockingEndData, setLockingEndData] = useState({
    selected: 0,
    lockingDate: 0,
  });
  const [contentTransaction, setContentTransaction] = useState("");

  const [allBalance, setAllBalance] = useState<{
    success: boolean;
    userBalance: { [id: string]: BigNumber };
  }>({ success: false, userBalance: {} });
  useEffect(() => {
    if (userAddress) {
      getCompleteUserBalace(userAddress).then((response: IAllBalanceResponse) => {
        setAllBalance(response);
      });
    } else {
      setAllBalance({ success: false, userBalance: {} });
    }
  }, [userAddress, tokenPrice, balanceUpdate]);
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  const handleCloseLock = () => {
    setShowCreateLockModal(false);
    setPlyInput("");
    setIsManageLock(false);
    setLockingDate("");
    setLockingEndData({
      selected: 0,
      lockingDate: 0,
    });
  };
  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.config.tokens);
  const totalVotingPowerError = useAppSelector((state) => state.pools.totalVotingPowerError);
  const epochError = useAppSelector((state) => state.epoch).epochFetchError;

  useEffect(() => {
    if (epochError) {
      dispatch(getEpochData());
    }
  }, [epochError]);

  useInterval(() => {
    dispatch(getEpochData());
  }, 60000);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
  }, []);
  useEffect(() => {
    if (walletAddress) {
      dispatch(getTotalVotingPower());
    }
  }, [walletAddress]);
  useEffect(() => {
    if (walletAddress && totalVotingPowerError) {
      dispatch(getTotalVotingPower());
    }
  }, [totalVotingPowerError]);
  useEffect(() => {
    Object.keys(token).length !== 0 && dispatch(getTokenPrice());
  }, [token]);
  const [voteData, setVoteData] = useState<{ [id: string]: IVotePageData }>(
    {} as { [id: string]: IVotePageData }
  );
  useEffect(() => {
    votesPageDataWrapper(722, undefined).then((res) => {
      setVoteData(res.allData);
    });
  }, []);

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
        <div className="pt-5 px-[24px]">
          <div className="flex gap-1">
            <p
              className={clsx(
                " font-title3 h-[40px] px-[24px] flex items-center  rounded-lg gap-1",
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
                "rounded-lg  font-title3 h-[40px] px-[24px] flex items-center gap-1",
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

          <div className="mt-5 overflow-x-auto">
            {activeSection === MyPortfolioSection.Positions ? (
              <Stats setShowCreateLockModal={setShowCreateLockModal} />
            ) : (
              <StatsRewards />
            )}
          </div>
        </div>
        <div className="border-t border-text-800/[0.5] mt-5"></div>
        <div className=" px-[24px]">
          <MyPortfolioCardHeader
            activeStateTab={activeStateTab}
            setActiveStateTab={setActiveStateTab}
            className="md:px-3"
          />
        </div>
        {activeStateTab === MyPortfolioHeader.Pools &&
          (activeSection === MyPortfolioSection.Positions ? (
            <PoolsTablePosition className="md:px-5 md:py-4  px-2 py-4" voteData={voteData} />
          ) : null)}
        {activeStateTab === MyPortfolioHeader.Locks &&
          (activeSection === MyPortfolioSection.Positions ? (
            <>
              <div className="flex px-[25px] mt-5">
                <p>
                  <div className="text-white font-title3">List of my locks</div>
                  <div className="text-text-250 font-body1">
                    Discover veNFTs on the largest NFT marketplace on Tezos.
                  </div>
                </p>
                <p className="flex items-center font-title3-bold text-primary-500 ml-auto h-[54px] px-[26px] bg-primary-500/[0.1] rounded-xl">
                  Trade locks
                </p>
              </div>
              <LocksTablePosition
                className="md:px-5 md:py-4  px-2 py-4"
                voteData={voteData}
                setIsManageLock={setIsManageLock}
                setShowCreateLockModal={setShowCreateLockModal}
              />
            </>
          ) : null)}
      </SideBarHOC>
      {(isManageLock || showCreateLockModal) && (
        <CreateLock
          module={isManageLock ? MODULE.MY_PORTFOLIO : MODULE.VOTE}
          show={showCreateLockModal}
          setPlyInput={setPlyInput}
          plyInput={plyInput}
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
          plyBalance={allBalance.userBalance["PLY"]}
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
