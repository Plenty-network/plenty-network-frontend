import { BigNumber } from "bignumber.js";
import clsx from "clsx";
import Image from "next/image";
import * as React from "react";
import close from "../../src/assets/icon/pools/closeBlue.svg";

import infoBlue from "../../src/assets/icon/pools/InfoBlue.svg";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getBalanceFromTzkt } from "../../src/api/util/balance";
import { addRemainingVotesDust, getVeNFTsList, votesPageDataWrapper } from "../../src/api/votes";
import { ELocksState, ISelectedPool, IVeNFTData, IVotePageData } from "../../src/api/votes/types";
import info from "../../src/assets/icon/swap/info.svg";
import chartMobile from "../../src/assets/icon/vote/chartMobile.svg";
import ConfirmTransaction from "../../src/components/ConfirmTransaction";
import { Flashtype } from "../../src/components/FlashScreen";
import HeadInfo from "../../src/components/HeadInfo";
import { InputSearchBox } from "../../src/components/Pools/Component/SearchInputBox";
import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { Position, ToolTip } from "../../src/components/Tooltip/TooltipAdvanced";
import TransactionSubmitted from "../../src/components/TransactionSubmitted";
import AllocationPopup from "../../src/components/Votes/AllocationPopup";
import CastVote from "../../src/components/Votes/CastVote";
import CreateLock from "../../src/components/Votes/CreateLock";
import EpochPopup from "../../src/components/Votes/EpochPopup";
import SelectNFT from "../../src/components/Votes/SelectNFT";
import { VotesTable } from "../../src/components/Votes/VotesTable";
import VotingAllocation from "../../src/components/Votes/VotingAllocation";
import { FIRST_TOKEN_AMOUNT, TOKEN_A, USERADDRESS } from "../../src/constants/localStorage";
import { useInterval } from "../../src/hooks/useInterval";
import { createLock } from "../../src/operations/locks";
import { IVotes } from "../../src/operations/types";
import { vote } from "../../src/operations/vote";
import { AppDispatch, store, useAppSelector } from "../../src/redux";
import { createGaugeConfig, getConfig } from "../../src/redux/config/config";
import { getEpochData, setSelectedEpoch } from "../../src/redux/epoch/epoch";
import { setFlashMessage } from "../../src/redux/flashMessage";
import { getLpTokenPrice, getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import { setSelectedDropDown, setSelectedDropDownLocal } from "../../src/redux/veNFT";
import { fetchWallet } from "../../src/redux/wallet/wallet";
import { setIsLoadingWallet } from "../../src/redux/walletLoading";
import { tzktExplorer } from "../../src/common/walletconnect";
import { nFormatterWithLesserNumber } from "../../src/api/util/helpers";

export default function Vote() {
  const dispatch = useDispatch<AppDispatch>();
  const currentEpoch = useAppSelector((state) => state.epoch.currentEpoch);
  const epochData = useAppSelector((state) => state.epoch.epochData);
  const selectedEpoch = useAppSelector((state) => state.epoch.selectedEpoch);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const token = useAppSelector((state) => state.config.tokens);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const [veNFTlist, setVeNFTlist] = useState<{ data: IVeNFTData[]; isfetching: boolean }>({
    data: [] as IVeNFTData[],
    isfetching: true,
  });
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
  const selectedDropDown = useAppSelector((state) => state.veNFT.selectedDropDown);

  const isMyPortfolio = useAppSelector((state) => state.veNFT.isMyPortfolio);
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
  const initialPriceCall = useRef<boolean>(true);
  const initialLpPriceCall = useRef<boolean>(true);
  const handleCreateLock = () => {
    setShowCreateLockModal(true);
  };

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
  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    const updateBalance = async () => {
      const balancePromises = [];

      if (userAddress) {
        balancePromises.push(
          getBalanceFromTzkt(
            String(token["PLY"]?.address),
            token["PLY"].tokenId,
            token["PLY"].standard,
            userAddress,
            "PLY"
          )
        );
        const balanceResponse = await Promise.all(balancePromises);

        setUserBalances((prev) => ({
          ...prev,
          ...balanceResponse.reduce(
            (acc, cur) => ({
              ...acc,
              [cur.identifier]: cur.balance,
            }),
            {}
          ),
        }));
      }
    };
    updateBalance();
  }, [userAddress, token, balanceUpdate]);
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
  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
    dispatch(getEpochData());
    setVoteData({} as { [id: string]: IVotePageData });
    !showTransactionSubmitModal && setVotes([] as IVotes[]);
    votesPageDataWrapper(
      selectedEpoch?.epochNumber ? selectedEpoch?.epochNumber : currentEpoch?.epochNumber,
      selectedDropDown.tokenId ? Number(selectedDropDown.tokenId) : undefined,
      tokenPrice
    ).then((res) => {
      setVoteData(res.allData);
    });
  }, []);
  useEffect(() => {
    if (!(localStorage.getItem(USERADDRESS) === userAddress)) {
      localStorage.setItem(USERADDRESS, userAddress);
    }
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
        selectedDropDown.tokenId ? Number(selectedDropDown.tokenId) : undefined,
        tokenPrice
      ).then((res) => {
        setVoteData(res.allData);

        Object.entries(res.allData).map((data) => {
          sum += Number(data[1].myVotesPercentage);
        });
        setSumofVotes(sum);
      });
    }
  }, [userAddress, selectedDropDown.tokenId, selectedEpoch?.epochNumber, selectednft.tokenId]);
  useEffect(() => {
    if (castVoteOperation) {
      setVoteData({} as { [id: string]: IVotePageData });
      setSelectedPools([] as ISelectedPool[]);
      setTotalVotingPower(0);
      setSumofVotes(0);
      sum = 0;
      votesPageDataWrapper(
        selectedEpoch?.epochNumber ? selectedEpoch?.epochNumber : currentEpoch?.epochNumber,
        selectedDropDown.tokenId ? Number(selectedDropDown.tokenId) : undefined,
        tokenPrice
      ).then((res) => {
        setVoteData(res.allData);

        Object.entries(res.allData).map((data) => {
          sum += Number(data[1].myVotesPercentage);
        });
        setSumofVotes(sum);
      });
      if (userAddress) {
        getVeNFTsList(
          userAddress,
          selectedEpoch?.epochNumber ? selectedEpoch?.epochNumber : currentEpoch?.epochNumber
        ).then((res) => {
          setVeNFTlist({ data: res.veNFTData, isfetching: false });
        });
      }
    }
  }, [castVoteOperation]);

  useEffect(() => {
    setVeNFTlist({ data: [] as IVeNFTData[], isfetching: true });
    if (userAddress) {
      getVeNFTsList(
        userAddress,
        selectedEpoch?.epochNumber ? selectedEpoch?.epochNumber : currentEpoch?.epochNumber
      ).then((res) => {
        setVeNFTlist({ data: res.veNFTData, isfetching: false });
      });
    } else {
      setVeNFTlist({ data: [] as IVeNFTData[], isfetching: false });
    }
  }, [userAddress, selectedEpoch?.epochNumber, lockOperation]);
  useEffect(() => {
    if (userAddress && lockOperation) {
      getVeNFTsList(
        userAddress,
        selectedEpoch?.epochNumber ? selectedEpoch?.epochNumber : currentEpoch?.epochNumber
      ).then((res) => {
        setVeNFTlist({ data: res.veNFTData, isfetching: false });
      });
    }
  }, [lockOperation]);

  useInterval(() => {
    dispatch(getEpochData());
  }, 60000);
  const selectDropdownLocal = useAppSelector((state) => state.veNFT.selectedDropDownLocal);

  useEffect(() => {
    var flag = false;

    if (selectedDropDown.votingPower === "" && isMyPortfolio) {
      dispatch(
        setSelectedDropDown({
          votingPower: selectDropdownLocal.votingPower.toString(),
          tokenId: selectDropdownLocal.tokenId.toString(),
        })
      );
    } else if (
      !veNFTlist.isfetching &&
      veNFTlist.data.length > 0 &&
      selectedDropDown.votingPower !== "" &&
      !isMyPortfolio
    ) {
      veNFTlist.data.map((list) => {
        if (Number(list.tokenId) === Number(selectedDropDown.tokenId)) {
          flag = true;
          if (list.locksState === ELocksState.CONSUMED) {
            dispatch(
              setSelectedDropDown({
                votingPower: list.nextEpochVotingPower.toString(),
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
          }
        }
      });

      if (!flag) {
        dispatch(
          setSelectedDropDown({
            votingPower: veNFTlist.data[0].votingPower.toString(),
            tokenId: veNFTlist.data[0].tokenId.toString(),
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
    if (selectedDropDown.votingPower === "" && isMyPortfolio) {
      dispatch(
        setSelectedDropDown({
          votingPower: selectDropdownLocal.votingPower.toString(),
          tokenId: selectDropdownLocal.tokenId.toString(),
        })
      );
    }
  }, [veNFTlist.data, userAddress]);

  useEffect(() => {
    if (!initialPriceCall.current) {
      Object.keys(token).length !== 0 && dispatch(getTokenPrice());
    } else {
      initialPriceCall.current = false;
    }
  }, [token]);
  useEffect(() => {
    if (!initialLpPriceCall.current) {
      Object.keys(tokenPrice).length !== 0 && dispatch(getLpTokenPrice(tokenPrice));
    } else {
      initialLpPriceCall.current = false;
    }
  }, [tokenPrice]);
  useEffect(() => {
    Object.keys(amm).length !== 0 && dispatch(createGaugeConfig());
  }, [amm]);

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
    setContentTransaction(`Locking PLY`);
    setShowCreateLockModal(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    localStorage.setItem(
      FIRST_TOKEN_AMOUNT,
      nFormatterWithLesserNumber(new BigNumber(plyInput)).toString()
    );
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
          setLockOperation(true);
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
                  `${tzktExplorer}${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);
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
  const handleVoteOperation = () => {
    setContentTransaction(`Casting vote`);
    setShowCastVoteModal(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    setAlreadyVoted(true);
    const finalVotes = addRemainingVotesDust(selectedDropDown.votingPower, totalVotingPower, votes);
    localStorage.setItem(FIRST_TOKEN_AMOUNT, selectedDropDown.tokenId);
    vote(
      Number(selectedDropDown.tokenId),
      finalVotes,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Vote with VeNFT #
        ${localStorage.getItem(FIRST_TOKEN_AMOUNT)}`,
        linkText: "View in Explorer",
        isLoading: true,
        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setVotes([] as IVotes[]);
        setBalanceUpdate(true);
        setAlreadyVoted(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Vote with VeNFT #
              ${localStorage.getItem(FIRST_TOKEN_AMOUNT)}`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `${tzktExplorer}${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);
        setTimeout(() => {
          setCastVoteOperation(true);
        }, 6000);
        setTimeout(() => {
          setCastVoteOperation(false);
        }, 20000);
        setContentTransaction("");
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      } else {
        setAlreadyVoted(false);
        setBalanceUpdate(true);
        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Vote with VeNFT #
              ${localStorage.getItem(FIRST_TOKEN_AMOUNT)}`,
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
  const [isbanner, setisBanner] = React.useState(false);
  const handleEpochChange = () => {
    //@ts-ignore
    dispatch(setSelectedEpoch(currentEpoch));
    setShowEpochPopUp(false);
  };

  return (
    <>
      <SideBarHOC>
        <div className="md:flex ">
          <div className="md:min-w-[416px] lg:min-w-[562px] md:w-full">
            <HeadInfo
              className="px-2 md:px-3"
              title="Vote"
              toolTipContent="Watch How to lock and vote to earn fees and bribes."
              handleCreateLock={handleCreateLock}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              isFirst={userAddress !== null && localStorage.getItem(USERADDRESS) !== userAddress}
              videoLink="jjsL5qce3ks"
            />

            <div className="">
              <div className="flex items-center px-3 md:px-0 py-2 md:py-2 ">
                <div>
                  <SelectNFT
                    veNFTlist={veNFTlist.data}
                    isfetching={veNFTlist.isfetching}
                    selectedText={selectedDropDown}
                    setSelectedDropDown={setSelectednft}
                  />
                </div>
                <div className="ml-auto ">
                  <InputSearchBox
                    className=""
                    value={searchValue.toString().trim()}
                    onChange={setSearchValue}
                    width={"w-[180px] md:w-245px xl:w-[260px]"}
                  />
                </div>
              </div>
              <div className="md:hidden block flex flex-row justify-between items-center px-3 md:px-0 py-2 md:py-0 border-b border-text-800/[0.5]">
                <div className="flex gap-2">
                  <div className="font-mobile-400 w-[134px] text-text-50">
                    Verify your vote percentage and cast vote
                  </div>

                  <div className="font-subtitle1 border border-muted-50 px-5 bg-muted-300 h-[38px]  flex items-center justify-center rounded-xl">
                    {sumOfVotes ? sumOfVotes : totalVotingPower ? totalVotingPower : "0"}%
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="">
                    {alreadyVoted ? (
                      <div
                        className={clsx(
                          "px-4   h-[38px] flex items-center justify-center rounded-xl ",

                          "cursor-not-allowed bg-card-700 text-text-400 font-subtitle4"
                        )}
                      >
                        Cast vote
                      </div>
                    ) : (sumOfVotes ? sumOfVotes !== 100 : totalVotingPower !== 100) &&
                      (selectedEpoch?.epochNumber
                        ? currentEpoch?.epochNumber === selectedEpoch?.epochNumber
                        : true) ? (
                      <ToolTip
                        message={
                          "Percentage allocation of the veNFT’s voting power. A 100% allocation is required to cast a vote."
                        }
                        id="tooltip8"
                        position={Position.top}
                      >
                        <div
                          className={clsx(
                            "cursor-pointer px-3  h-[38px] ] flex items-center justify-center rounded-xl ",
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
                          Cast vote
                        </div>
                      </ToolTip>
                    ) : sumOfVotes === 100 ? (
                      <div
                        className={clsx(
                          "md:px-4  px-2  h-[38px]  flex items-center justify-center rounded-xl ",

                          "cursor-not-allowed bg-card-700 text-text-400 font-subtitle4"
                        )}
                      >
                        Already voted
                      </div>
                    ) : (
                      <div
                        className={clsx(
                          "px-3  cursor-pointer  h-[38px]  flex items-center justify-center rounded-xl ",

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
                        Cast vote
                      </div>
                    )}
                  </div>

                  <div onClick={() => setShowCastVotingAllocation(true)}>
                    <Image alt={"alt"} src={chartMobile} width={"24px"} height={"24px"} />
                  </div>
                </div>
              </div>
              {isbanner && (
                <div className="mb-2 h-[58px] md:h-[42px] ml-4 mr-2 px-2 rounded-lg  flex items-center bg-info-500/[0.1]">
                  <p className="relative top-0.5">
                    <Image src={infoBlue} />
                  </p>
                  <p className="font-body2 text-info-500 px-3 sm:w-auto w-[249px]">
                    VeNFTs created in this epoch can only be used for voting from the next epoch
                  </p>
                  <p
                    className="ml-auto relative top-[7px] cursor-pointer"
                    onClick={() => setisBanner(false)}
                  >
                    <Image src={close} />
                  </p>
                </div>
              )}
              <VotesTable
                className="md:pl-5  "
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
          <div className="hidden md:block md:basis-1/3 md:pr-[25px] md:ml-3 w-[350px]">
            <VotingAllocation
              show={showCastVotingAllocation}
              castVoteOperation={castVoteOperation}
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
              <div className="basis-1/4 border border-muted-50 bg-muted-300 h-[50px]  flex items-center justify-center rounded-xl">
                <span className="cursor-pointer relative top-0.5">
                  <ToolTip
                    id="tooltip2"
                    position={Position.top}
                    toolTipChild={
                      <div className="w-[100px] md:w-[250px]">
                        Percentage allocation of the veNFT’s voting power. A 100% allocation is
                        required to cast a vote.
                      </div>
                    }
                  >
                    <Image alt={"alt"} src={info} className="infoIcon cursor-pointer" />
                  </ToolTip>
                </span>
                <span className="ml-1">
                  {sumOfVotes ? sumOfVotes : totalVotingPower ? totalVotingPower : "0"}%
                </span>
              </div>
              <div className="basis-3/4">
                {alreadyVoted ? (
                  <div
                    className={clsx(
                      "px-4   h-[50px] flex items-center justify-center rounded-xl ",

                      "cursor-not-allowed bg-card-700 text-text-400 font-subtitle4"
                    )}
                  >
                    Cast vote
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
                        "  h-[50px] flex items-center justify-center rounded-xl ",
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
                      Cast vote
                    </div>
                  </ToolTip>
                ) : sumOfVotes === 100 ? (
                  <div
                    className={clsx(
                      "  h-[50px] flex items-center justify-center rounded-xl ",

                      "cursor-not-allowed bg-card-700 text-text-400 font-subtitle4"
                    )}
                  >
                    Already voted
                  </div>
                ) : (
                  <div
                    className={clsx(
                      "  h-[50px] flex items-center justify-center rounded-xl ",
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
                    Cast vote
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SideBarHOC>

      <AllocationPopup
        show={showCastVotingAllocation}
        setShow={setShowCastVotingAllocation}
        selectedDropDown={selectedDropDown} // veNFT selected
        epochData={epochData} // epoch data
        alreadyVoted={sumOfVotes === 100}
        epochNumber={selectedEpoch ? selectedEpoch.epochNumber : 0}
        castVoteOperation={castVoteOperation}
      />

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
          plyBalance={new BigNumber(userBalances["PLY"])}
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
            transactionId ? () => window.open(`${tzktExplorer}${transactionId}`, "_blank") : null
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
