import { AppDispatch, useAppSelector } from "../../redux";
import Button from "../Button/Button";
import { BigNumber } from "bignumber.js";
import clsx from "clsx";
import { useState, useMemo, useEffect, useRef } from "react";
import { ChainAirdrop } from "./Disclaimer";
import Progress from "./Progress";
import Steps from "./Steps";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import { FIRST_TOKEN_AMOUNT, TOKEN_A } from "../../constants/localStorage";
import { setIsLoadingWallet } from "../../redux/walletLoading";
import { claimAirdrop } from "../../operations/airdrop";
import { Flashtype } from "../FlashScreen";
import { setFlashMessage } from "../../redux/flashMessage";
import ConfirmTransaction from "../ConfirmTransaction";
import TransactionSubmitted from "../TransactionSubmitted";
import { useAirdropClaimData } from "../../hooks/useAirdropClaimData";
import { useRouter } from "next/router";

import info from "../../assets/icon/pools/InfoBlue.svg";

import {
  authenticateUser,
  hasUserTweeted,
  isUserAuthenticated,
  tweetForUser,
} from "../../api/airdrop/twitter";
import { AIRDROP_TWEET_TEXT } from "../../constants/airdrop";
import { tzktExplorer } from "../../common/walletconnect";
import Image from "next/image";
import { VideoModal } from "../Modal/videoModal";
import { isMobile } from "react-device-detect";
import CreateLock from "../Votes/CreateLock";
import { createLock } from "../../operations/locks";
import { getBalanceFromTzkt } from "../../api/util/balance";
import { nFormatterWithLesserNumber } from "../../api/util/helpers";
export interface ITezosChain {
  setChain: React.Dispatch<React.SetStateAction<ChainAirdrop>>;
}

function TezosChain(props: ITezosChain) {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const [showCreateLockModal, setShowCreateLockModal] = useState(false);
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [hasTweeted, setHasTweeted] = useState(false);
  const res = useAirdropClaimData();
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const router = useRouter();
  const authRef = useRef<string | undefined>(undefined);
  const [lockingDate, setLockingDate] = useState("");
  const [lockingEndData, setLockingEndData] = useState({
    selected: 0,
    lockingDate: 0,
  });

  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  useEffect(() => {
    const query =
      router.asPath.indexOf("?") >= 0
        ? router.asPath.slice(router.asPath.indexOf("?") + 1, router.asPath.length).toString()
        : undefined;
    authRef.current = query ? query.slice(query.indexOf("=") + 1, query.length) : undefined;

    router.replace("/airdrop", undefined, { shallow: true });
  }, []);

  const token = useAppSelector((state) => state.config.tokens);
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
  const [contentTransaction, setContentTransaction] = useState("");
  const [plyInput, setPlyInput] = useState("");
  const [twitterAction, setTwitterAction] = useState("");
  const handleCloseLock = () => {
    setShowCreateLockModal(false);
    setPlyInput("");

    setLockingDate("");

    setLockingEndData({
      selected: 0,
      lockingDate: 0,
    });
  };
  const resetAllValues = () => {
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
  useEffect(() => {
    const claimdata = res.airdropClaimData;
    if (claimdata.eligible) {
      if (claimdata.claimData.length && claimdata.claimData[0].claimed) {
        setTwitterAction("Claimed");
        setHasTweeted(true);
      } else {
        hasUserTweeted(userAddress).then((res) => {
          setHasTweeted(res.tweeted);
          if (res.tweeted) {
            setTwitterAction(`Completed`);
          } else {
            setTwitterAction("fetching...");

            if (authRef.current === "accepted") {
              isUserAuthenticated(userAddress).then((res) => {
                if (res.authenticated) {
                  tweetForUser(userAddress, AIRDROP_TWEET_TEXT).then((ress) => {
                    if (ress.status) {
                      setTwitterAction("Completed");
                      setHasTweeted(ress.status);
                      dispatch(
                        setFlashMessage({
                          flashType: Flashtype.Success,
                          transactionId: "",
                          headerText: "",
                          trailingText: `Tweeted succesfully`,
                          linkText: "",
                          isLoading: true,
                        })
                      );
                    } else {
                      setTwitterAction(`Take action`);
                      dispatch(
                        setFlashMessage({
                          flashType: Flashtype.Info,
                          transactionId: "",
                          headerText: "",
                          trailingText: `Failed to tweet`,
                          linkText: "",
                          isLoading: true,
                        })
                      );
                    }
                  });
                }
              });
              authRef.current = undefined;
            } else if (authRef.current === "denied") {
              setTwitterAction(`Take action`);
              dispatch(
                setFlashMessage({
                  flashType: Flashtype.Info,
                  transactionId: "",
                  headerText: "",
                  trailingText: `Authentication denied`,
                  linkText: "",
                  isLoading: true,
                })
              );
              authRef.current = undefined;
            } else {
              setTwitterAction(`Take action`);
              authRef.current = undefined;
            }
          }
        });
      }
    } else {
      if (res.airdropClaimData.message === "GET_TEZ_FOR_FEES") {
        setTwitterAction("Not allowedTez");
      } else {
        setTwitterAction("Not allowed");
      }
    }
  }, [res.airdropClaimData]);

  console.log(res.airdropClaimData);
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  const handleAirdropOperation = () => {
    localStorage.setItem(
      FIRST_TOKEN_AMOUNT,

      hasTweeted
        ? res.airdropClaimData.pendingClaimableAmount.toFixed(2)
        : res.airdropClaimData.pendingClaimableAmount
            .minus(res.airdropClaimData.perMissionAmount)
            .toFixed(2)
    );
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    setContentTransaction(`Claim airdrop ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} PLY`);
    claimAirdrop(
      res.airdropClaimData.claimData,
      hasTweeted,
      transactionSubmitModal,
      undefined,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Claim airdrop ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} PLY`,
        linkText: "View in Explorer",
        isLoading: true,
        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setTimeout(() => {
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Claim airdrop ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} PLY`,
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
          setShowTransactionSubmitModal(false);
        }, 2000);

        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      } else {
        setShowConfirmTransaction(false);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `claim airdrop ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} PLY`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);

        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const ClaimButton = useMemo(() => {
    if (userAddress) {
      if (res.fetching) {
        return (
          <Button color="disabled" width="w-full">
            Fetching data...
          </Button>
        );
      } else if (res.airdropClaimData.eligible && res.airdropClaimData.success) {
        if (res.airdropClaimData.pendingClaimableAmount.isGreaterThan(0) && hasTweeted) {
          return (
            <button
              className={clsx(
                "bg-primary-500 h-13 text-black w-full rounded-2xl font-title3-bold cursor-pointer"
              )}
              onClick={handleAirdropOperation}
            >
              Claim {res.airdropClaimData.pendingClaimableAmount.toFixed(2)} PLY
            </button>
          );
        } else if (
          res.airdropClaimData.pendingClaimableAmount
            .minus(res.airdropClaimData.perMissionAmount)
            .isGreaterThan(0) &&
          !hasTweeted
        ) {
          return (
            <button
              className={clsx(
                "bg-primary-500 text-black  h-13  w-full rounded-2xl font-title3-bold cursor-pointer"
              )}
              onClick={handleAirdropOperation}
            >
              Claim{" "}
              {res.airdropClaimData.pendingClaimableAmount
                .minus(res.airdropClaimData.perMissionAmount)
                .toFixed(2)}{" "}
              PLY
            </button>
          );
        } else if (res.airdropClaimData.pendingClaimableAmount.isEqualTo(0)) {
          return (
            <button
              className={clsx(
                "bg-primary-600 text-text-600 h-13  w-full rounded-2xl font-title3-bold"
              )}
            >
              All claimed
            </button>
          );
        } else if (
          res.airdropClaimData.pendingClaimableAmount
            .minus(res.airdropClaimData.perMissionAmount)
            .isEqualTo(0) &&
          !hasTweeted
        ) {
          return (
            <button
              className={clsx(
                "bg-primary-600 text-text-600 h-13  w-full rounded-2xl font-title3-bold cursor-pointer"
              )}
            >
              Claim
            </button>
          );
        }
      } else if (
        res.airdropClaimData.eligible === false ||
        res.airdropClaimData.success === false
      ) {
        if (res.airdropClaimData.message === "GET_TEZ_FOR_FEES") {
          return (
            <Button
              color="primary"
              onClick={() => window.open("https://tezos.com/tez/#buy-tez", "_blank")}
              width="w-full"
            >
              Get some XTZ for fees
            </Button>
          );
        } else {
          return (
            <Button color="disabled" width="w-full">
              Not eligible
            </Button>
          );
        }
      }
    } else {
      return (
        <Button color="primary" onClick={connectTempleWallet} width="w-full">
          Connect wallet
        </Button>
      );
    }
  }, [props, userAddress, res, hasTweeted]);
  const handleTwitter = () => {
    isUserAuthenticated(userAddress).then((res) => {
      if (res.authenticated) {
        tweetForUser(userAddress, AIRDROP_TWEET_TEXT).then((res) => {
          if (res.status) {
            setTwitterAction("Completed");
            setHasTweeted(res.status);
            dispatch(
              setFlashMessage({
                flashType: Flashtype.Success,
                transactionId: "",
                headerText: "",
                trailingText: `Tweeted succesfully`,
                linkText: "",
                isLoading: true,
              })
            );
          } else {
            console.log(res.message);
            dispatch(
              setFlashMessage({
                flashType: Flashtype.Info,
                transactionId: "",
                headerText: "",
                trailingText: `Failed to tweet`,
                linkText: "",
                isLoading: true,
              })
            );
          }
        });
      } else {
        authenticateUser(userAddress).then((res) => {
          if (res.success) {
            window.location.replace(res.redirectUrl);
          } else {
            console.log("server error");
            dispatch(
              setFlashMessage({
                flashType: Flashtype.Info,
                transactionId: "",
                headerText: "",
                trailingText: `Server error`,
                linkText: "",
                isLoading: true,
              })
            );
          }
        });
      }
    });
  };

  return (
    <>
      <div className="mt-3 border border-muted-300 bg-muted-400 rounded-xl py-5">
        <Progress
          res={res.airdropClaimData}
          claimData={res.airdropClaimData.claimData}
          fetching={res.fetching}
          twitterAction={twitterAction}
          hasTweeted={hasTweeted}
        />
        <div className="border-t border-text-800 my-3"></div>
        <Steps
          claimData={res.airdropClaimData}
          fetching={res.fetching}
          twitterAction={twitterAction}
          handleTwitter={handleTwitter}
          hasTweeted={hasTweeted}
        />
      </div>
      <div className="flex mt-3 gap-2">
        <div className="py-1.5 md:h-[42px]  px-2 rounded-lg  flex items-center bg-info-500/[0.1]">
          <p className="relative top-0.5">
            <Image src={info} />
          </p>
          <p className="font-body2 text-info-500 px-3 sm:w-[50%] md:w-[480px]">
            {isMobile
              ? "lock your PLY and vote to earn rewards."
              : "After claiming your PLY, lock your PLY and vote to earn fees and bribes."}
          </p>
        </div>

        <div
          className="ml-auto bg-primary-500/[0.1] text-primary-500 font-caption2 w-[180px]  cursor-pointer md:h-[42px] rounded-lg  flex items-center justify-center px-2"
          onClick={() => setShowCreateLockModal(true)}
        >
          {" "}
          Create lock
        </div>
      </div>

      <div className="mt-[18px]">{ClaimButton}</div>
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
      {/* {showVideoModal && <VideoModal closefn={setShowVideoModal} linkString={"jjsL5qce3ks"} />} */}
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
          plyBalance={new BigNumber(userBalances["PLY"])}
        />
      )}
    </>
  );
}

export default TezosChain;
