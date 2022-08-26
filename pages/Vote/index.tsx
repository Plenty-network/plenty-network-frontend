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
import chartMobile from "../../src/assets/icon/vote/chartMobile.svg";

import { VotesTable } from "../../src/components/Votes/VotesTable";
import CastVote from "../../src/components/Votes/CastVote";
import CreateLock from "../../src/components/Votes/CreateLock";
import VotingAllocation from "../../src/components/Votes/VotingAllocation";
import { InputSearchBox } from "../../src/components/Pools/Component/SearchInputBox";
import { getEpochData } from "../../src/redux/epoch/epoch";
import { useInterval } from "../../src/hooks/useInterval";
import { EPOCH_DURATION_TESTNET } from "../../src/constants/global";
import { getVeNFTsList } from "../../src/api/votes/votesKiran";
import { ISelectedPool, IVeNFTData, IVotePageData } from "../../src/api/votes/types";
import { getCompleteUserBalace, getUserBalanceByRpc } from "../../src/api/util/balance";
import ConfirmTransaction from "../../src/components/ConfirmTransaction";
import TransactionSubmitted from "../../src/components/TransactionSubmitted";
import { createLock } from "../../src/operations/locks";
import { setLoading } from "../../src/redux/isLoading/action";
import AllocationPopup from "../../src/components/Votes/AllocationPopup";
import { InfoIconToolTip } from "../../src/components/Tooltip/InfoIconTooltip";
import { IAllBalanceResponse } from "../../src/api/util/types";
import { vote } from "../../src/operations/vote";
import { votesPageDataWrapper } from "../../src/api/votes/votesUdit";

export default function Vote() {
  const dispatch = useDispatch<AppDispatch>();
  const currentEpoch = useAppSelector((state) => state.epoch.currentEpoch);
  const epochData = useAppSelector((state) => state.epoch.epochData);
  const selectedEpoch = useAppSelector((state) => state.epoch.selectedEpoch);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const token = useAppSelector((state) => state.config.tokens);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);

  const [veNFTlist, setVeNFTlist] = useState<IVeNFTData[]>([]);
  const [lockingDate, setLockingDate] = useState("");

  const [lockingEndData, setLockingEndData] = useState({
    selected: 0,
    lockingDate: 0,
  });
  const [totalVotingPower, setTotalVotingPower] = useState(0);

  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [plyInput, setPlyInput] = useState("");
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const [selectedPools, setSelectedPools] = useState<ISelectedPool[]>([] as ISelectedPool[]);
  const [selectedDropDown, setSelectedDropDown] = useState({ votingPower: "", tokenId: "" });
  const [voteData, setVoteData] = useState<{ [id: string]: IVotePageData }>(
    {} as { [id: string]: IVotePageData }
  );

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
    //selectedEpoch?.epochNumber ?selectedEpoch?.epochNumber:currentEpoch?.epochNumber
    //selectedDropDown.tokenId?Number(selectedDropDown.tokenId):undefined
    votesPageDataWrapper(235, 1).then((res) => {
      console.log(res);
      setVoteData(res.allData);
    });
  }, [selectedDropDown, currentEpoch?.epochNumber, selectedEpoch?.epochNumber]);
  useEffect(() => {
    if (userAddress) {
      getVeNFTsList(userAddress).then((res) => {
        setVeNFTlist(res.veNFTData);
      });
    }
  }, [userAddress, epochData, currentEpoch]);

  useInterval(() => {
    dispatch(getEpochData());
  }, 60000);

  useEffect(() => {
    Object.keys(token).length !== 0 && dispatch(getTokenPrice());
  }, [token]);
  const [showCastVoteModal, setShowCastVoteModal] = useState(false);
  const [showCastVotingAllocation, setShowCastVotingAllocation] = useState(false);
  const [showCreateLockModal, setShowCreateLockModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const TOKEN = useAppSelector((state) => state.config.tokens);
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
  }, [userAddress, tokenPrice, balanceUpdate, showCreateLockModal]);
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
      setUserBalances({});
    }
  }, [userAddress, TOKEN]);

  const resetAllValues = () => {
    setPlyInput("");
    setLockingDate("");
    setLockingEndData({
      selected: 0,
      lockingDate: 0,
    });
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
  const handleVoteOperation = () => {
    setShowCastVoteModal(false);
    setShowConfirmTransaction(true);
    dispatch(setLoading(true));
    vote(
      Number(selectedDropDown.tokenId),
      [],
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
            toolTipContent=""
            handleCreateLock={handleCreateLock}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />

          <div className="md:flex md:flex-row">
            <div className="md:basis-2/3">
              <div className="flex items-center px-3 md:px-0 py-2 md:py-0 border-b border-text-800/[0.5]">
                <div>
                  <SelectNFT
                    veNFTlist={veNFTlist}
                    selectedText={selectedDropDown}
                    setSelectedDropDown={setSelectedDropDown}
                  />
                </div>
                <div className="ml-auto">
                  <InputSearchBox className="" value={searchValue} onChange={setSearchValue} />
                </div>
              </div>
              <div className="md:hidden block flex flex-row justify-between items-center px-3 md:px-0 py-2 md:py-0 border-b border-text-800/[0.5]">
                <div className="font-mobile-400 w-[134px]">
                  Verify your vote percentage and cast vote
                </div>

                <div className="border border-muted-50 px-4 bg-muted-300 h-[52px]  flex items-center justify-center rounded-xl">
                  {totalVotingPower ? totalVotingPower : "00"}%
                </div>
                <div
                  className=" bg-card-700 h-[52px] px-4 flex items-center justify-center rounded-xl cursor-pointer"
                  onClick={() => setShowCastVoteModal(true)}
                >
                  Cast Vote
                </div>
                <div onClick={() => setShowCastVotingAllocation(true)}>
                  <Image src={chartMobile} width={"24px"} height={"24px"} />
                </div>
              </div>
              <VotesTable
                className="px-5 py-4 "
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setSelectedPools={setSelectedPools}
                selectedPools={selectedPools}
                setTotalVotingPower={setTotalVotingPower}
                totalVotingPower={totalVotingPower}
                voteData={voteData}
              />
            </div>
            <div className="hidden md:block md:basis-1/3 md:pr-[30px]">
              <VotingAllocation />
              <div className="mt-4 text-text-50 font-body3">
                Verify your vote percentage and cast vote
              </div>
              <div className="flex flex-row gap-2 mt-[14px]">
                <div className="basis-1/4 border border-muted-50 bg-muted-300 h-[52px]  flex items-center justify-center rounded-xl">
                  <InfoIconToolTip message=" Verify your vote percentage and cast vote" />
                  {totalVotingPower ? totalVotingPower : "00"}%
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
      {showCastVotingAllocation && (
        <AllocationPopup show={showCastVotingAllocation} setShow={setShowCastVotingAllocation} />
      )}
      {showCastVoteModal && (
        <CastVote
          show={showCastVoteModal}
          setShow={setShowCastVoteModal}
          selectedPools={selectedPools}
          totalVotingPower={totalVotingPower}
          selectedDropDown={selectedDropDown}
          onClick={handleVoteOperation}
        />
      )}
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
          plyBalance={allBalance.userBalance["PLY"]}
        />
      )}

      {showConfirmTransaction && (
        <ConfirmTransaction
          show={showConfirmTransaction}
          setShow={setShowConfirmTransaction}
          content={`Locking`}
        />
      )}
      {showTransactionSubmitModal && (
        <TransactionSubmitted
          show={showTransactionSubmitModal}
          setShow={setShowTransactionSubmitModal}
          onBtnClick={
            transactionId ? () => window.open(`https://tzkt.io/${transactionId}`, "_blank") : null
          }
          content={`locking`}
        />
      )}
    </>
  );
}
