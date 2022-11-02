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
import { getCompleteUserBalace } from "../../api/util/balance";
import { IAllBalanceResponse } from "../../api/util/types";
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

interface IMigrateProps {
  vestedData: IVestAndClaim;
}

function ClaimVested(props: IMigrateProps) {
  const [firstTokenAmount, setFirstTokenAmount] = useState("");
  const [allBalance, setAllBalance] = useState<{
    success: boolean;
    userBalance: { [id: string]: BigNumber };
  }>({ success: false, userBalance: {} });

  const tokens = useAppSelector((state) => state.config.standard);
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  useEffect(() => {
    setAllBalance({ success: false, userBalance: {} });
    if (userAddress) {
      getCompleteUserBalace(userAddress).then((response: IAllBalanceResponse) => {
        setAllBalance(response);
      });
    } else {
      setAllBalance({ success: true, userBalance: {} });
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

    claim(transactionSubmitModal, resetAllValues, setShowConfirmTransaction, {
      flashType: Flashtype.Info,
      headerText: "Transaction submitted",
      trailingText: `claim`,
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
              trailingText: `claim`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
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
            trailingText: `claim`,
            linkText: "",
            isLoading: true,
            transactionId: "",
          })
        );
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const ClaimButton = useMemo(() => {
    if (userAddress) {
      return (
        <Button color="primary" width="w-full" onClick={() => setConfirmPLYPopup(true)}>
          Confirm
        </Button>
      );
    } else {
      return (
        <Button color="primary" onClick={connectTempleWallet} width="w-full">
          Connect Wallet
        </Button>
      );
    }
  }, [props]);

  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);

  return (
    <>
      <div
        className={clsx(
          "bg-card-500 md:border border-y border-text-800 mt-[16px]  md:rounded-3xl  text-white lg:w-640 pt-5 pb-2 mx-auto fade-in"
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
                    value={props.vestedData.claimableAmount.toString()}
                  />
                </div>
              </div>
            </div>
            <div className="flex -mt-[12px]">
              <div className="text-left">
                <span className="text-text-600 font-body3">Balance:</span>{" "}
                <span className="font-body4 text-text-500 ">
                  {Number(allBalance.userBalance[tokenOut.name]) >= 0 ? (
                    <ToolTip
                      message={fromExponential(allBalance.userBalance[tokenOut.name].toString())}
                      disable={Number(allBalance.userBalance[tokenOut.name]) > 0 ? false : true}
                      id="tooltip9"
                      position={Position.right}
                    >
                      {Number(allBalance.userBalance[tokenOut.name]) > 0
                        ? Number(allBalance.userBalance[tokenOut.name]).toFixed(4)
                        : 0}
                    </ToolTip>
                  ) : (
                    "--"
                  )}
                </span>
              </div>
              <div className="text-right ml-auto font-body2 text-text-400 flex">
                <span className="text-white mr-1">
                  + {props.vestedData.vestedAmount.toFixed(2)} PLY
                </span>{" "}
                vested <span className="md:block hidden ml-1">for upto 25-Aug-2024</span>
                <span className="relative top-1 md:hidden">
                  <Image src={info} />
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5">{ClaimButton}</div>
        </div>
      </div>
      <div className="font-body2 text-text-250 mt-4 mx-2 md:mx-auto md:w-[568px] text-center">
        Tip: Convert PLENTY/WRAP to PLY. By locking PLY, you&apos;re earning fees and bribe rewards
        from your veNFT, plus you may boost your gauge rewards.
      </div>

      {showConfirmTransaction && (
        <ConfirmTransaction
          show={showConfirmTransaction}
          setShow={setShowConfirmTransaction}
          content={`claim`}
        />
      )}
      {showTransactionSubmitModal && (
        <TransactionSubmitted
          show={showTransactionSubmitModal}
          setShow={setShowTransactionSubmitModal}
          onBtnClick={
            transactionId
              ? () => window.open(`https://ghostnet.tzkt.io/${transactionId}`, "_blank")
              : null
          }
          content={`claim`}
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
