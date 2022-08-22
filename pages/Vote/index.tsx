import Head from "next/head";
import Image from "next/image";
import * as React from "react";
import { BigNumber } from "bignumber.js";
import HeadInfo from "../../src/components/HeadInfo";
import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { AppDispatch, useAppSelector } from "../../src/redux";
import { fetchWallet } from "../../src/redux/wallet/wallet";
import { getConfig } from "../../src/redux/config/config";
import { getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import SelectNFT from "../../src/components/Votes/SelectNFT";
import { VotesTable } from "../../src/components/Votes/VotesTable";
import CastVote from "../../src/components/Votes/CastVote";
import CreateLock from "../../src/components/Votes/CreateLock";
import VotingAllocation from "../../src/components/Votes/VotingAllocation";
import { InputSearchBox } from "../../src/components/Pools/Component/SearchInputBox";
import { getEpochData } from "../../src/redux/epoch/epoch";
import { useInterval } from "../../src/hooks/useInterval";
import { EPOCH_DURATION_TESTNET } from "../../src/constants/global";
import { getVeNFTsList } from "../../src/api/votes/votesKiran";
import { IVeNFTData } from "../../src/api/votes/types";
import { getUserBalanceByRpc } from "../../src/api/util/balance";
import ConfirmTransaction from "../../src/components/ConfirmTransaction";
import TransactionSubmitted from "../../src/components/TransactionSubmitted";
import { createLock } from "../../src/operations/locks";
import { setLoading } from "../../src/redux/isLoading/action";

export default function Vote() {
  const dispatch = useDispatch<AppDispatch>();
  const epochData = useAppSelector((state) => state.epoch.currentEpoch);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const token = useAppSelector((state) => state.config.tokens);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);

  const epochError = useAppSelector((state) => state.epoch).epochFetchError;
  const [veNFTlist, setVeNFTlist] = useState<IVeNFTData[]>([]);
  const [lockingDate, setLockingDate] = useState("");

  const [lockingEndData, setLockingEndData] = useState({
    selected: 0,
    lockingDate: 0,
  });
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [plyInput, setPlyInput] = useState("");
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
    dispatch(getEpochData());
  }, []);
  useEffect(() => {
    if (userAddress) {
      getVeNFTsList(userAddress).then((res) => {
        setVeNFTlist(res.veNFTData);
      });
    }
  }, [userAddress]);
  useEffect(() => {
    if (epochError) {
      dispatch(getEpochData());
    }
  }, [epochError]);

  useInterval(() => {
    dispatch(getEpochData());
  }, 60000);

  useEffect(() => {
    Object.keys(token).length !== 0 && dispatch(getTokenPrice());
  }, [token]);
  const [showCastVoteModal, setShowCastVoteModal] = useState(false);

  const [showCreateLockModal, setShowCreateLockModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const handleCreateLock = () => {
    setShowCreateLockModal(true);
  };
  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (userAddress) {
      const updateBalance = async () => {
        const balancePromises = [];

        balancePromises.push(getUserBalanceByRpc("PLY", userAddress));

        const balanceResponse = await Promise.all(balancePromises);

        setUserBalances((prev) => ({
          ...prev,
          ...balanceResponse.reduce(
            (acc, cur) => ({
              ...acc,
              [cur.identifier]: cur.balance.toNumber(),
            }),
            {}
          ),
        }));
      };
      updateBalance();
    }
  }, [userAddress, tokenPrice, balanceUpdate]);

  const resetAllValues = () => {
    setPlyInput("");
    setLockingDate("");
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

  const handleLockOperation = () => {
    setShowCreateLockModal(false);
    setShowConfirmTransaction(true);
    dispatch(setLoading(true));
    createLock(
      userAddress,
      new BigNumber(plyInput),
      new BigNumber(new Date(lockingEndData.lockingDate).getTime()).decimalPlaces(0, 1),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);

        dispatch(setLoading(false));
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);

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
        <div>
          <HeadInfo
            className="px-2 md:px-3"
            title="Vote"
            toolTipContent="Watch how to add veNFT"
            handleCreateLock={handleCreateLock}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />

          <div className="md:flex md:flex-row">
            <div className="md:basis-2/3">
              <div className="flex items-center">
                <div>
                  {" "}
                  <SelectNFT veNFTlist={veNFTlist} />
                </div>
                <div className="ml-auto">
                  {" "}
                  <InputSearchBox className="" value={searchValue} onChange={setSearchValue} />
                </div>
              </div>
              <VotesTable
                className="px-5 py-4 "
                searchValue={searchValue}
                setSearchValue={setSearchValue}
              />
            </div>
            <div className="hidden md:block md:basis-1/3 md:pr-[30px]">
              <VotingAllocation />
              <div className="mt-4 text-text-50 font-body3">
                Verify your vote percentage and cast vote
              </div>
              <div className="flex flex-row gap-2 mt-[14px]">
                <div className="basis-1/4 border border-muted-50 bg-muted-300 h-[52px]  flex items-center justify-center rounded-xl">
                  00
                </div>
                <div
                  className="basis-3/4 bg-card-700 h-[52px] flex items-center justify-center rounded-xl cursor-pointer"
                  onClick={() => setShowCastVoteModal(true)}
                >
                  Cast Vote
                </div>
              </div>
            </div>
          </div>
        </div>
      </SideBarHOC>
      {showCastVoteModal && <CastVote show={showCastVoteModal} setShow={setShowCastVoteModal} />}
      {showCreateLockModal && (
        <CreateLock
          show={showCreateLockModal}
          setPlyInput={setPlyInput}
          plyInput={plyInput}
          setShow={handleCloseLock}
          userBalances={userBalances}
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
        />
      )}

      {showConfirmTransaction && (
        <ConfirmTransaction
          show={showConfirmTransaction}
          setShow={setShowConfirmTransaction}
          content={`create lock`}
        />
      )}
      {showTransactionSubmitModal && (
        <TransactionSubmitted
          show={showTransactionSubmitModal}
          setShow={setShowTransactionSubmitModal}
          onBtnClick={
            transactionId ? () => window.open(`https://tzkt.io/${transactionId}`, "_blank") : null
          }
          content={`create lock `}
        />
      )}
    </>
  );
}
