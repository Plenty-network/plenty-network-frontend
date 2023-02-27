import clsx from "clsx";
import "animate.css";
import { isMobile } from "react-device-detect";
import fromExponential from "from-exponential";
import Button from "../Button/Button";
import TokenDropdown from "../TokenDropdown/TokenDropdown";
import { useEffect, useMemo, useRef, useState } from "react";
import { ERRORMESSAGES, tokenParameter, tokensModal, tokenType } from "../../../src/constants/swap";

import info from "../../assets/icon/swap/info.svg";

import { BigNumber } from "bignumber.js";
import ply from "../../assets/Tokens/ply.png";

import ConfirmTransaction from "../ConfirmTransaction";
import TransactionSubmitted from "../TransactionSubmitted";
import { AppDispatch, store, useAppDispatch, useAppSelector } from "../../redux";
import { Position, ToolTip, TooltipType } from "../Tooltip/TooltipAdvanced";
import { getAllTokensBalanceFromTzkt } from "../../api/util/balance";
import {
  IAllBalanceResponse,
  IAllTokensBalance,
  IAllTokensBalanceResponse,
} from "../../api/util/types";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import Image from "next/image";
import ConfirmMigrate from "./ConfirmMigrate";
import ConfirmPLYVested from "./ClaimPLYVested";
import { setIsLoadingWallet } from "../../redux/walletLoading";
import { claim } from "../../operations/veSwap";
import { Flashtype } from "../FlashScreen";
import { setFlashMessage } from "../../redux/flashMessage";
import { getUserClaimAndVestAmount } from "../../api/migrate";
import { IVestAndClaim } from "../../api/migrate/types";
import { useCountdown } from "../../hooks/useCountDown";
import PieChartButton from "../LocksPosition/PieChart";
import { FIRST_TOKEN_AMOUNT } from "../../constants/localStorage";
import { tzktExplorer } from "../../common/walletconnect";
import { nFormatterWithLesserNumber } from "../../api/util/helpers";

interface IMigrateProps {
  vestedData: IVestAndClaim;
}

function ClaimVested(props: IMigrateProps) {
  const [firstTokenAmount, setFirstTokenAmount] = useState("");

  const tokens = useAppSelector((state) => state.config.tokens);
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  const [allBalance, setAllBalance] = useState<IAllTokensBalanceResponse>({
    success: false,
    allTokensBalances: {} as IAllTokensBalance,
  });
  useEffect(() => {
    setAllBalance({
      success: false,
      allTokensBalances: {} as IAllTokensBalance,
    });
    if (userAddress) {
      getAllTokensBalanceFromTzkt(Object.values(tokens), userAddress).then(
        (response: IAllTokensBalanceResponse) => {
          setAllBalance(response);
        }
      );
    } else {
      setAllBalance({
        success: false,
        allTokensBalances: {} as IAllTokensBalance,
      });
    }
  }, [userAddress, tokens, balanceUpdate]);
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);

  const [tokenOut, setTokenOut] = useState<tokenParameter>({
    name: "PLY",
    image: ply,
  });
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const resetAllValues = () => {};
  const [confirmPLYPopup, setConfirmPLYPopup] = useState(false);
  const handleClaimOperation = () => {
    setConfirmPLYPopup(false);
    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    localStorage.setItem(
      FIRST_TOKEN_AMOUNT,
      nFormatterWithLesserNumber(new BigNumber(props.vestedData.claimableAmount)).toString()
    );
    claim(transactionSubmitModal, resetAllValues, setShowConfirmTransaction, {
      flashType: Flashtype.Info,
      headerText: "Transaction submitted",
      trailingText: `Claim of ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} PLY `,
      linkText: "View in Explorer",
      isLoading: true,
      transactionId: "",
    }).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Claim of ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} PLY `,
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
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);

        dispatch(
          setFlashMessage({
            flashType: Flashtype.Rejected,
            headerText: "Rejected",
            trailingText: `Claim of ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} PLY `,
            linkText: "",
            isLoading: true,
            transactionId: "",
          })
        );
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const [days, hours, minutes, seconds] = useCountdown(
    props.vestedData?.nextClaim?.isGreaterThan(0)
      ? props.vestedData?.nextClaim?.toNumber()
      : Date.now()
  );
  const remainingTime = new BigNumber(props.vestedData.nextClaim).minus(Date.now());
  const totalWaitingTime = new BigNumber(props.vestedData.nextClaim).minus(
    props.vestedData.lastClaim
  );
  const remainingPercentage = remainingTime.multipliedBy(100).dividedBy(totalWaitingTime);
  const ClaimButton = useMemo(() => {
    if (userAddress) {
      return (
        <ToolTip
          position={Position.bottom}
          disable={props.vestedData.isClaimable}
          toolTipChild={
            <div>
              <span>{hours} h </span>:<span> {minutes} m </span>:<span> {seconds} s </span>
            </div>
          }
          id="tooltip9"
        >
          <div
            className={clsx(
              "h-[50px] cursor-pointer  flex items-center justify-center w-full rounded-xl  font-title3-bold ",
              props.vestedData.isClaimable
                ? "bg-primary-500 text-black"
                : "bg-blue-200 text-blue-300"
            )}
            onClick={props.vestedData.isClaimable ? () => setConfirmPLYPopup(true) : () => {}}
          >
            Claim
            {!props.vestedData.isClaimable && (
              <span className="ml-[6px]">
                <PieChartButton
                  violet={100 - Math.floor(Number(remainingPercentage))}
                  transparent={Math.floor(Number(remainingPercentage))}
                />
              </span>
            )}
          </div>
        </ToolTip>
      );
    } else {
      return (
        <Button color="primary" onClick={connectTempleWallet} width="w-full">
          Connect wallet
        </Button>
      );
    }
  }, [props]);

  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);

  return (
    <>
      <div
        className={clsx(
          "bg-card-500 md:border border-y border-text-800 mt-[36px]  md:rounded-3xl  text-white lg:w-640 pt-5 pb-2 mx-auto fade-in"
        )}
      >
        <div className="flex items-center flex-row px-5 lg:px-9 relative">
          <div className="font-title2">Claim Vested PLY</div>
        </div>
        <div className=" pt-[41px] mt-[16px] pb-5 border border-primary-500/[0.2] mx-px md:mx-2 lg:mx-2  px-5 lg:px-[22px] rounded-3xl bg-primary-500/[0.04]">
          <div
            className={clsx(
              "lg:w-580 secondtoken h-[102px] border border-text-800 rounded-2xl  px-4 border-primary-500/[0.2] hover:border-primary-500/[0.6] bg-card-500 hover:bg-primary-500/[0.02]"
            )}
          >
            <div className=" flex ">
              <div className={clsx(" mt-4", "flex-none")}>
                <TokenDropdown
                  tokenIcon={tokenOut.image}
                  tokenName={tokenOut.name}
                  isArrow={true}
                  tokenSymbol={tokenOut.name}
                />
              </div>
              <div className=" my-3 flex-auto">
                <div className="text-right font-body1 text-text-400">YOUR CLAIMABLE BALANCE</div>
                <div>
                  <input
                    type="text"
                    className={clsx(
                      "text-primary-500  inputSecond text-right border-0 font-input-text lg:font-medium1 outline-none w-[100%] placeholder:text-primary-500 "
                    )}
                    placeholder="0.0"
                    value={props.vestedData?.claimableAmount?.toFixed(6)}
                  />
                </div>
              </div>
            </div>
            <div className="flex -mt-[12px]">
              <div className="text-left">
                <span className="text-text-600 font-body3">Balance:</span>{" "}
                <span className="font-body4 cursor-pointer text-text-500 ">
                  {Number(allBalance.allTokensBalances[tokenOut.name]?.balance) >= 0 ? (
                    <ToolTip
                      message={fromExponential(
                        allBalance.allTokensBalances[tokenOut.name]?.balance.toString()
                      )}
                      disable={
                        Number(allBalance.allTokensBalances[tokenOut.name]?.balance) > 0
                          ? false
                          : true
                      }
                      id="tooltip9"
                      position={Position.right}
                    >
                      {Number(allBalance.allTokensBalances[tokenOut.name]?.balance) > 0
                        ? Number(allBalance.allTokensBalances[tokenOut.name]?.balance)?.toFixed(4)
                        : 0}
                    </ToolTip>
                  ) : (
                    "--"
                  )}
                </span>
              </div>
              <div className="text-right ml-auto font-body2 text-text-400 flex">
                <span className="text-white mr-1">
                  + {props.vestedData?.vestedAmount?.toFixed(2)} PLY
                </span>{" "}
                vested <span className="md:block hidden ml-1">for upto 05-Jan-2025</span>
                <span className="relative top-1 md:hidden">
                  <Image src={info} />
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5">{ClaimButton}</div>
        </div>
      </div>
      {/* <div className="font-body2 text-text-250 mt-4 mx-2 md:mx-auto md:w-[568px] text-center">
        Tip: Convert PLENTY/WRAP to PLY. By locking PLY, you&apos;re earning fees and bribe rewards
        from your veNFT, plus you may boost your gauge rewards.
      </div> */}

      {showConfirmTransaction && (
        <ConfirmTransaction
          show={showConfirmTransaction}
          setShow={setShowConfirmTransaction}
          content={`Claim of ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} PLY `}
        />
      )}
      {showTransactionSubmitModal && (
        <TransactionSubmitted
          show={showTransactionSubmitModal}
          setShow={setShowTransactionSubmitModal}
          onBtnClick={
            transactionId ? () => window.open(`${tzktExplorer}${transactionId}`, "_blank") : null
          }
          content={`Claim of ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} PLY `}
        />
      )}

      <ConfirmPLYVested
        show={confirmPLYPopup}
        setShow={setConfirmPLYPopup}
        handleClick={handleClaimOperation}
        vestedData={props.vestedData}
      />
    </>
  );
}

export default ClaimVested;
