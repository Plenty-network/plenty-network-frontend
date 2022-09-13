import Head from "next/head";
import Image from "next/image";
import * as React from "react";

import { BigNumber } from "bignumber.js";
import { useEffect, useState, useRef } from "react";
import HeadInfo from "../../src/components/HeadInfo";
import { CardHeader, PoolsCardHeader } from "../../src/components/Pools/Cardheader";
import { ShortCard as PoolsTable } from "../../src/components/Pools/ShortCard";
import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { useDispatch } from "react-redux";
import { AppDispatch, store, useAppSelector } from "../../src/redux";
import { fetchWallet } from "../../src/redux/wallet/wallet";
import { getConfig } from "../../src/redux/config/config";
import { getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import { getTotalVotingPower } from "../../src/redux/pools";
import { getEpochData } from "../../src/redux/epoch/epoch";
import { useInterval } from "../../src/hooks/useInterval";
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

export default function MyPortfolio() {
  const [activeStateTab, setActiveStateTab] = React.useState<PoolsCardHeader | string>(
    MyPortfolioHeader.Pools
  );
  const userAddress = store.getState().wallet.address;
  const [showCreateLockModal, setShowCreateLockModal] = useState(false);
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

  votesPageDataWrapper(722, undefined).then((res) => {
    setVoteData(res.allData);
  });
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
            <p className="text-primary-500 font-title3 h-[40px] px-[24px] flex items-center bg-primary-500/[0.1] rounded-lg gap-1">
              Positions <Image src={position} />
            </p>
            <p className="rounded-lg text-text-250 font-title3 h-[40px] px-[24px] flex items-center gap-1">
              Rewards <Image src={rewards} />
            </p>
          </div>
          <div className="mt-5">
            <Stats setShowCreateLockModal={setShowCreateLockModal} />
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
        {activeStateTab === MyPortfolioHeader.Pools && (
          <PoolsTablePosition className="md:px-5 md:py-4  px-2 py-4" voteData={voteData} />
        )}
        {activeStateTab === MyPortfolioHeader.Locks && (
          <LocksTablePosition className="md:px-5 md:py-4  px-2 py-4" voteData={voteData} />
        )}
      </SideBarHOC>
      {showCreateLockModal && (
        <CreateLock
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
