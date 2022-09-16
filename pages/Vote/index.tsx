import Head from "next/head";
import Image from "next/image";
import * as React from "react";
import { BigNumber } from "bignumber.js";
import HeadInfo from "../../src/components/HeadInfo";
import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { AppDispatch, store, useAppSelector } from "../../src/redux";
import { fetchWallet } from "../../src/redux/wallet/wallet";
import { createGaugeConfig, getConfig } from "../../src/redux/config/config";
import { getLpTokenPrice, getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import SelectNFT from "../../src/components/Votes/SelectNFT";
import chartMobile from "../../src/assets/icon/vote/chartMobile.svg";
import info from "../../src/assets/icon/swap/info.svg";
import { Position, ToolTip } from "../../src/components/Tooltip/TooltipAdvanced";
import { VotesTable } from "../../src/components/Votes/VotesTable";
import CastVote from "../../src/components/Votes/CastVote";
import CreateLock from "../../src/components/Votes/CreateLock";
import VotingAllocation from "../../src/components/Votes/VotingAllocation";
import { InputSearchBox } from "../../src/components/Pools/Component/SearchInputBox";
import { getEpochData, setSelectedEpoch } from "../../src/redux/epoch/epoch";
import { useInterval } from "../../src/hooks/useInterval";
import { addRemainingVotesDust, getVeNFTsList } from "../../src/api/votes";
import { ELocksState, ISelectedPool, IVeNFTData, IVotePageData } from "../../src/api/votes/types";
import { getCompleteUserBalace, getUserBalanceByRpc } from "../../src/api/util/balance";
import ConfirmTransaction from "../../src/components/ConfirmTransaction";
import TransactionSubmitted from "../../src/components/TransactionSubmitted";
import { createLock } from "../../src/operations/locks";
import { setLoading } from "../../src/redux/isLoading/action";
import AllocationPopup from "../../src/components/Votes/AllocationPopup";
import { InfoIconToolTip } from "../../src/components/Tooltip/InfoIconTooltip";
import { IAllBalanceResponse } from "../../src/api/util/types";
import { vote } from "../../src/operations/vote";
import { votesPageDataWrapper } from "../../src/api/votes";
import { IVotes } from "../../src/operations/types";
import clsx from "clsx";
import EpochPopup from "../../src/components/Votes/EpochPopup";
import { MODULE } from "../../src/components/Votes/types";
import { useRouter } from "next/router";
import { setSelectedDropDown } from "../../src/redux/veNFT";

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
  const [showEpochPopUp, setShowEpochPopUp] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [plyInput, setPlyInput] = useState("");
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const [selectedPools, setSelectedPools] = useState<ISelectedPool[]>([] as ISelectedPool[]);
  const selectedDropDown = store.getState().veNFT.selectedDropDown;

  const isMyPortfolio = store.getState().veNFT.isMyPortfolio;
  const [selectednft, setSelectednft] = useState(selectedDropDown);
  const [voteData, setVoteData] = useState<{ [id: string]: IVotePageData }>(
    {} as { [id: string]: IVotePageData }
  );
  const [votes, setVotes] = useState<IVotes[]>([] as IVotes[]);
  const [showCastVoteModal, setShowCastVoteModal] = useState(false);
  const [showCastVotingAllocation, setShowCastVotingAllocation] = useState(false);
  const [showCreateLockModal, setShowCreateLockModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const TOKEN = useAppSelector((state) => state.config.tokens);
  const amm = useAppSelector((state) => state.config.AMMs);
  const handleCreateLock = () => {
    setShowCreateLockModal(true);
  };
  const [allBalance, setAllBalance] = useState<{
    success: boolean;
    userBalance: { [id: string]: BigNumber };
  }>({ success: false, userBalance: {} });
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [castVoteOperation, setCastVoteOperation] = useState(false);
  const [lockOperation, setLockOperation] = useState(false);
  const [sumOfVotes, setSumofVotes] = useState(0);
  const [contentTransaction, setContentTransaction] = useState("");
  var sum = 0;
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
    dispatch(getEpochData());
    setVoteData({} as { [id: string]: IVotePageData });
    !showTransactionSubmitModal && setVotes([] as IVotes[]);
    votesPageDataWrapper(
      selectedEpoch?.epochNumber ? selectedEpoch?.epochNumber : currentEpoch?.epochNumber,
      selectedDropDown.tokenId ? Number(selectedDropDown.tokenId) : undefined
    ).then((res) => {
      setVoteData(res.allData);
    });
  }, []);
  useEffect(() => {
    if (selectedEpoch?.epochNumber) {
      setVoteData({} as { [id: string]: IVotePageData });
      setSelectedPools([] as ISelectedPool[]);
      setTotalVotingPower(0);
      setSumofVotes(0);
      sum = 0;
      votesPageDataWrapper(
        selectedEpoch?.epochNumber ? selectedEpoch?.epochNumber : currentEpoch?.epochNumber,
        selectedDropDown.tokenId ? Number(selectedDropDown.tokenId) : undefined
      ).then((res) => {
        setVoteData(res.allData);

        Object.entries(res.allData).map((data) => {
          sum += Number(data[1].myVotesPercentage);
        });
        setSumofVotes(sum);
      });
    }
  }, [selectedDropDown.tokenId, selectedEpoch?.epochNumber, selectednft.tokenId]);
  useEffect(() => {
    if (castVoteOperation) {
      setVoteData({} as { [id: string]: IVotePageData });
      setSelectedPools([] as ISelectedPool[]);
      setTotalVotingPower(0);
      setSumofVotes(0);
      sum = 0;
      votesPageDataWrapper(
        selectedEpoch?.epochNumber ? selectedEpoch?.epochNumber : currentEpoch?.epochNumber,
        selectedDropDown.tokenId ? Number(selectedDropDown.tokenId) : undefined
      ).then((res) => {
        setVoteData(res.allData);

        Object.entries(res.allData).map((data) => {
          sum += Number(data[1].myVotesPercentage);
        });
        setSumofVotes(sum);
      });
      //setVeNFTlist([]);
      if (userAddress) {
        getVeNFTsList(
          userAddress,
          selectedEpoch?.epochNumber ? selectedEpoch?.epochNumber : currentEpoch?.epochNumber
        ).then((res) => {
          setVeNFTlist(res.veNFTData);
        });
      }
    }
  }, [castVoteOperation]);

  useEffect(() => {
    //setVeNFTlist([]);
    if (userAddress) {
      getVeNFTsList(
        userAddress,
        selectedEpoch?.epochNumber ? selectedEpoch?.epochNumber : currentEpoch?.epochNumber
      ).then((res) => {
        const filteredList = res.veNFTData.filter(
          (veNFT) =>
            veNFT.locksState === ELocksState.AVAILABLE || veNFT.locksState === ELocksState.CONSUMED
        );

        setVeNFTlist(filteredList);
      });
    } else {
      setVeNFTlist([]);
    }
  }, [userAddress, selectedEpoch?.epochNumber, lockOperation]);

  useInterval(() => {
    dispatch(getEpochData());
  }, 60000);

  useEffect(() => {
    if (selectedDropDown.votingPower !== "" && isMyPortfolio) {
    } else if (veNFTlist.length > 0 && selectedDropDown.votingPower !== "" && !isMyPortfolio) {
      var flag = false;
      veNFTlist.map((list) => {
        if (Number(list.tokenId) === Number(selectedDropDown.tokenId)) {
          flag = true;
          dispatch(
            setSelectedDropDown({
              votingPower: list.votingPower.toString(),
              tokenId: list.tokenId.toString(),
            })
          );
        }
      });
      if (!flag) {
        dispatch(
          setSelectedDropDown({
            votingPower: veNFTlist[0].votingPower.toString(),
            tokenId: veNFTlist[0].tokenId.toString(),
          })
        );
      }
    } else {
      dispatch(
        setSelectedDropDown({
          votingPower: "",
          tokenId: "",
        })
      );
    }
  }, [veNFTlist]);

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
    if (userAddress) {
      getCompleteUserBalace(userAddress).then((response: IAllBalanceResponse) => {
        setAllBalance(response);
      });
    } else {
      setAllBalance({ success: false, userBalance: {} });
    }
  }, [userAddress, TOKEN, balanceUpdate]);

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
  const handleVoteOperation = () => {
    setContentTransaction(`Casting vote`);
    setShowCastVoteModal(false);
    setShowConfirmTransaction(true);
    dispatch(setLoading(true));
    setAlreadyVoted(true);
    const finalVotes = addRemainingVotesDust(selectedDropDown.votingPower, totalVotingPower, votes);
    vote(
      Number(selectedDropDown.tokenId),
      finalVotes,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setVotes([] as IVotes[]);
        setBalanceUpdate(true);
        setAlreadyVoted(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setTimeout(() => {
          setCastVoteOperation(true);
        }, 6000);
        setTimeout(() => {
          setCastVoteOperation(false);
        }, 20000);
        setContentTransaction("");
        dispatch(setLoading(false));
      } else {
        setAlreadyVoted(false);
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
  const handleEpochChange = () => {
    dispatch(setSelectedEpoch(currentEpoch));
    setShowEpochPopUp(false);
  };

  return (
    <>
      <Head>
        <title className="font-medium1">Plenty network</title>
        <meta name="description" content="plenty network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBarHOC>
        <div className="md:flex ">
          <div className="min-w-[562px] ">
            <HeadInfo
              className="px-2 md:px-3"
              title="Vote"
              toolTipContent=""
              handleCreateLock={handleCreateLock}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />

            <div className="">
              <div className="flex items-center px-3 md:px-0 py-2 md:py-2 ">
                <div>
                  <SelectNFT
                    veNFTlist={veNFTlist}
                    selectedText={selectedDropDown}
                    setSelectedDropDown={setSelectednft}
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
                  {sumOfVotes ? sumOfVotes : totalVotingPower ? totalVotingPower : "00"}%
                </div>
                <div className="">
                  {alreadyVoted ? (
                    <div
                      className={clsx(
                        "px-4   h-[52px] flex items-center justify-center rounded-xl ",

                        "cursor-not-allowed bg-card-700 text-text-400 font-subtitle4"
                      )}
                    >
                      Cast Vote
                    </div>
                  ) : (sumOfVotes ? sumOfVotes !== 100 : totalVotingPower !== 100) &&
                    (selectedEpoch?.epochNumber
                      ? currentEpoch?.epochNumber === selectedEpoch?.epochNumber
                      : true) ? (
                    <ToolTip
                      message={"Cast 100% of your Votes to proceed "}
                      id="tooltip8"
                      position={Position.top}
                    >
                      <div
                        className={clsx(
                          " px-4 h-[52px] flex items-center justify-center rounded-xl ",
                          votes.length !== 0 &&
                            (selectedEpoch?.epochNumber
                              ? currentEpoch?.epochNumber === selectedEpoch?.epochNumber
                              : false) &&
                            totalVotingPower !== 0 &&
                            totalVotingPower === 100 &&
                            Number(selectedDropDown.votingPower) > 0
                            ? "cursor-pointer bg-primary-500 hover:bg-primary-400 text-black font-subtitle6"
                            : "cursor-not-allowed bg-card-700 text-text-400 font-subtitle4"
                        )}
                        onClick={() =>
                          votes.length !== 0 &&
                          (selectedEpoch?.epochNumber
                            ? currentEpoch?.epochNumber === selectedEpoch?.epochNumber
                            : false) &&
                          totalVotingPower !== 0 &&
                          totalVotingPower === 100 &&
                          sumOfVotes !== 100 &&
                          Number(selectedDropDown.votingPower) > 0
                            ? setShowCastVoteModal(true)
                            : currentEpoch?.epochNumber !== selectedEpoch?.epochNumber
                            ? setShowEpochPopUp(true)
                            : () => {}
                        }
                      >
                        Cast Vote
                      </div>
                    </ToolTip>
                  ) : sumOfVotes === 100 ? (
                    <div
                      className={clsx(
                        "px-4   h-[52px] flex items-center justify-center rounded-xl ",

                        "cursor-not-allowed bg-card-700 text-text-400 font-subtitle4"
                      )}
                    >
                      Already Voted
                    </div>
                  ) : (
                    <div
                      className={clsx(
                        "px-4   h-[52px] flex items-center justify-center rounded-xl ",

                        votes.length !== 0 &&
                          (selectedEpoch?.epochNumber
                            ? currentEpoch?.epochNumber === selectedEpoch?.epochNumber
                            : false) &&
                          totalVotingPower === 100 &&
                          Number(selectedDropDown.votingPower) > 0
                          ? "cursor-pointer bg-primary-500 hover:bg-primary-400 text-black font-subtitle6"
                          : "cursor-not-allowed bg-card-700 text-text-400 font-subtitle4"
                      )}
                      onClick={() =>
                        votes.length !== 0 &&
                        (selectedEpoch?.epochNumber
                          ? currentEpoch?.epochNumber === selectedEpoch?.epochNumber
                          : false) &&
                        totalVotingPower === 100 &&
                        sumOfVotes !== 100 &&
                        Number(selectedDropDown.votingPower) > 0
                          ? setShowCastVoteModal(true)
                          : currentEpoch?.epochNumber !== selectedEpoch?.epochNumber
                          ? setShowEpochPopUp(true)
                          : () => {}
                      }
                    >
                      Cast Vote
                    </div>
                  )}
                </div>

                <div onClick={() => setShowCastVotingAllocation(true)}>
                  <Image src={chartMobile} width={"24px"} height={"24px"} />
                </div>
              </div>
              <VotesTable
                className="md:px-5 py-4 px-2"
                searchValue={searchValue}
                sumOfVotes={sumOfVotes}
                setSearchValue={setSearchValue}
                setSelectedPools={setSelectedPools}
                selectedPools={selectedPools}
                setTotalVotingPower={setTotalVotingPower}
                totalVotingPower={totalVotingPower}
                voteData={voteData}
                setVotes={setVotes}
                votes={votes}
                selectedDropDown={selectedDropDown}
                isCurrentEpoch={
                  selectedEpoch?.epochNumber
                    ? currentEpoch?.epochNumber === selectedEpoch?.epochNumber
                    : true
                }
              />
            </div>
          </div>
          <div className="hidden md:block md:basis-1/3 md:pr-[25px] w-[350px]">
            <VotingAllocation
              show={showCastVotingAllocation}
              setShow={setShowCastVotingAllocation}
              selectedDropDown={selectedDropDown} // veNFT selected
              epochData={epochData} // epoch data
              alreadyVoted={sumOfVotes === 100}
              epochNumber={selectedEpoch ? selectedEpoch.epochNumber : 0}
            />
            <div className="mt-4 text-text-50 font-body3">
              Verify your vote percentage and cast vote
            </div>
            <div className="flex flex-row gap-2 mt-[14px]">
              <div className="basis-1/4 border border-muted-50 bg-muted-300 h-[52px]  flex items-center justify-center rounded-xl">
                <span className="cursor-pointer relative top-0.5">
                  <ToolTip
                    id="tooltip2"
                    toolTipChild={
                      <div className="w-[200px]">Verify your vote percentage and cast vote</div>
                    }
                  >
                    <Image src={info} className="infoIcon " />
                  </ToolTip>
                </span>
                <span className="ml-1">
                  {sumOfVotes ? sumOfVotes : totalVotingPower ? totalVotingPower : "00"}%
                </span>
              </div>
              <div className="basis-3/4">
                {alreadyVoted ? (
                  <div
                    className={clsx(
                      "px-4   h-[52px] flex items-center justify-center rounded-xl ",

                      "cursor-not-allowed bg-card-700 text-text-400 font-subtitle4"
                    )}
                  >
                    Cast Vote
                  </div>
                ) : (sumOfVotes ? sumOfVotes !== 100 : totalVotingPower !== 100) &&
                  (selectedEpoch?.epochNumber
                    ? currentEpoch?.epochNumber === selectedEpoch?.epochNumber
                    : true) ? (
                  <ToolTip
                    message={"Cast 100% of your Votes to proceed "}
                    id="tooltip8"
                    position={Position.top}
                  >
                    <div
                      className={clsx(
                        "  h-[52px] flex items-center justify-center rounded-xl ",
                        votes.length !== 0 &&
                          (selectedEpoch?.epochNumber
                            ? currentEpoch?.epochNumber === selectedEpoch?.epochNumber
                            : false) &&
                          totalVotingPower !== 0 &&
                          totalVotingPower === 100 &&
                          Number(selectedDropDown.votingPower) > 0
                          ? "cursor-pointer bg-primary-500 hover:bg-primary-400 text-black font-subtitle6"
                          : "cursor-not-allowed bg-card-700 text-text-400 font-subtitle4"
                      )}
                      onClick={() =>
                        votes.length !== 0 &&
                        (selectedEpoch?.epochNumber
                          ? currentEpoch?.epochNumber === selectedEpoch?.epochNumber
                          : false) &&
                        totalVotingPower !== 0 &&
                        totalVotingPower === 100 &&
                        sumOfVotes !== 100 &&
                        Number(selectedDropDown.votingPower) > 0
                          ? setShowCastVoteModal(true)
                          : currentEpoch?.epochNumber !== selectedEpoch?.epochNumber
                          ? setShowEpochPopUp(true)
                          : () => {}
                      }
                    >
                      Cast Vote
                    </div>
                  </ToolTip>
                ) : sumOfVotes === 100 ? (
                  <div
                    className={clsx(
                      "  h-[52px] flex items-center justify-center rounded-xl ",

                      "cursor-not-allowed bg-card-700 text-text-400 font-subtitle4"
                    )}
                  >
                    Already Voted
                  </div>
                ) : (
                  <div
                    className={clsx(
                      "  h-[52px] flex items-center justify-center rounded-xl ",
                      votes.length !== 0 &&
                        (selectedEpoch?.epochNumber
                          ? currentEpoch?.epochNumber === selectedEpoch?.epochNumber
                          : false) &&
                        totalVotingPower === 100 &&
                        Number(selectedDropDown.votingPower) > 0
                        ? "cursor-pointer bg-primary-500 hover:bg-primary-400 text-black font-subtitle6"
                        : "cursor-not-allowed bg-card-700 text-text-400 font-subtitle4"
                    )}
                    onClick={() =>
                      votes.length !== 0 &&
                      (selectedEpoch?.epochNumber
                        ? currentEpoch?.epochNumber === selectedEpoch?.epochNumber
                        : false) &&
                      totalVotingPower === 100 &&
                      sumOfVotes !== 100 &&
                      Number(selectedDropDown.votingPower) > 0
                        ? setShowCastVoteModal(true)
                        : currentEpoch?.epochNumber !== selectedEpoch?.epochNumber
                        ? setShowEpochPopUp(true)
                        : () => {}
                    }
                  >
                    Cast Vote
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SideBarHOC>
      {showCastVotingAllocation && (
        <AllocationPopup
          show={showCastVotingAllocation}
          setShow={setShowCastVotingAllocation}
          selectedDropDown={selectedDropDown} // veNFT selected
          epochData={epochData} // epoch data
          alreadyVoted={sumOfVotes === 100}
          epochNumber={selectedEpoch ? selectedEpoch.epochNumber : 0}
        />
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
          module={MODULE.VOTE}
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
      {showEpochPopUp && (
        <EpochPopup show={showEpochPopUp} setShow={setShowEpochPopUp} onClick={handleEpochChange} />
      )}
    </>
  );
}
