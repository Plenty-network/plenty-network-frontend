import { BigNumber } from "bignumber.js";
import Image from "next/image";

import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import * as React from "react";
import { useEffect, useState } from "react";
import { getBalanceFromTzkt, getTezBalance } from "../../api/util/balance";
import {
  nFormatterWithLesserNumber,
  nFormatterWithLesserNumber5digit,
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";
import { tzktExplorer } from "../../common/walletconnect";
import { useAppDispatch, useAppSelector } from "../../redux";
import ConfirmTransaction from "../ConfirmTransaction";
import { tokenParameterLiquidity } from "../Liquidity/types";

import { VideoModal } from "../Modal/videoModal";
import { ActiveLiquidity } from "../Pools/ManageLiquidityHeader";
import { InfoIconToolTip } from "../Tooltip/InfoIconTooltip";
import TransactionSubmitted from "../TransactionSubmitted";

import clsx from "clsx";

import IncreaseDecreaseLiqMain from "../v3/IncreaseDecreaseliqMain";
import ConfirmIncreaseLiq from "../v3/Confirmaddliq";
import ConfirmDecreaseLiq from "../v3/Confirmremoveliq";
import {
  FIRST_TOKEN_AMOUNT,
  SECOND_TOKEN_AMOUNT,
  TOKEN_A,
  TOKEN_B,
} from "../../constants/localStorage";
import { setIsLoadingWallet } from "../../redux/walletLoading";
import { increaseLiquidity, removeLiquidity } from "../../operations/v3/liquidity";
import { Flashtype } from "../FlashScreen";
import { setFlashMessage } from "../../redux/flashMessage";
import { BalanceNat } from "../../api/v3/types";

export interface IManageLiquidityProps {
  closeFn: (val: boolean) => void;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  setActiveState: React.Dispatch<React.SetStateAction<string>>;
  activeState: string;
  showLiquidityModal?: boolean;
  setShowLiquidityModalPopup: React.Dispatch<React.SetStateAction<boolean>>;
  feeTier: string;
}
export enum ActiveIncDecState {
  Increase = "Increase liquidity",
  Decrease = "Remove liquidity",
}
export enum ActivePopUp {
  Positions = "Positions",
  NewPosition = "NewPosition",
  ManageExisting = "ManageExisting",
  ConfirmAddV3 = "ConfirmAddV3",
  ConfirmExisting = "ConfirmExisting",
}

export function ManagePoolsV3(props: IManageLiquidityProps) {
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const TOKEN = useAppSelector((state) => state.config.tokens);

  const walletAddress = useAppSelector((state) => state.wallet.address);
  const selectedPosition = useAppSelector((state) => state.poolsv3.selectedPosition);
  const [activeStateIncDec, setActiveStateIncDec] = React.useState<ActiveIncDecState | string>(
    ActiveIncDecState.Increase
  );
  const [removePercentage, setRemovePercentage] = useState(25);
  const [screen, setScreen] = React.useState(ActivePopUp.ManageExisting);
  const [firstTokenAmountLiq, setFirstTokenAmountLiq] = React.useState<string | number>("");
  const [secondTokenAmountLiq, setSecondTokenAmountLiq] = React.useState<number | string>("");

  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);

  const [transactionId, setTransactionId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useAppDispatch();

  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };

  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);

  const [contentTransaction, setContentTransaction] = useState("");

  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>({});

  const [remove, setRemove] = useState({} as BalanceNat);

  useEffect(() => {
    const updateBalance = async () => {
      const balancePromises = [];

      if (walletAddress) {
        if (
          props.tokenIn.symbol.toLowerCase() === "xtz" ||
          props.tokenOut.symbol.toLowerCase() === "xtz"
        ) {
          balancePromises.push(getTezBalance(walletAddress));
        }

        props.tokenIn.symbol &&
          props.tokenIn.symbol.toLowerCase() !== "xtz" &&
          balancePromises.push(
            getBalanceFromTzkt(
              String(TOKEN[props.tokenIn.symbol]?.address),
              TOKEN[props.tokenIn.symbol].tokenId,
              TOKEN[props.tokenIn.symbol].standard,
              walletAddress,
              props.tokenIn.symbol
            )
          );
        props.tokenOut.symbol &&
          props.tokenOut.symbol.toLowerCase() !== "xtz" &&
          balancePromises.push(
            getBalanceFromTzkt(
              String(TOKEN[props.tokenOut.symbol]?.address),
              TOKEN[props.tokenOut.symbol].tokenId,
              TOKEN[props.tokenOut.symbol].standard,

              walletAddress,
              props.tokenOut.symbol
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
  }, [walletAddress, TOKEN, balanceUpdate, props.tokenIn.symbol, props.tokenOut.symbol]);
  const resetAllValues = () => {
    setFirstTokenAmountLiq("");
    setSecondTokenAmountLiq("");
    setBalanceUpdate(false);
  };

  const closeModal = () => {
    props.closeFn(false);
  };

  const handleIncreaseLiquidityOperation = () => {
    setContentTransaction(
      `Increase liquidity ${nFormatterWithLesserNumber(
        new BigNumber(firstTokenAmountLiq)
      )} ${tEZorCTEZtoUppercase(props.tokenIn.name)} / ${nFormatterWithLesserNumber(
        new BigNumber(secondTokenAmountLiq)
      )} ${tEZorCTEZtoUppercase(props.tokenOut.name)} `
    );
    localStorage.setItem(TOKEN_A, tEZorCTEZtoUppercase(props.tokenIn.name));
    localStorage.setItem(TOKEN_B, tEZorCTEZtoUppercase(props.tokenOut.name));
    localStorage.setItem(
      FIRST_TOKEN_AMOUNT,
      nFormatterWithLesserNumber(new BigNumber(firstTokenAmountLiq)).toString()
    );
    localStorage.setItem(
      SECOND_TOKEN_AMOUNT,
      nFormatterWithLesserNumber(new BigNumber(secondTokenAmountLiq)).toString()
    );
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    setScreen(ActivePopUp.ManageExisting);

    setShowConfirm(false);
    setShowConfirmTransaction(true);
    increaseLiquidity(
      selectedPosition,
      {
        x: new BigNumber(firstTokenAmountLiq),
        y: new BigNumber(secondTokenAmountLiq),
      },
      props.tokenIn.symbol,
      props.tokenOut.symbol,
      walletAddress,
      Number(props.feeTier),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      undefined,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Increase liquidity ${localStorage.getItem(
          FIRST_TOKEN_AMOUNT
        )} ${localStorage.getItem(TOKEN_A)} / ${localStorage.getItem(
          SECOND_TOKEN_AMOUNT
        )} ${localStorage.getItem(TOKEN_B)}`,
        linkText: "View in block explorer",
        isLoading: true,
        transactionId: "",
      }
    ).then((response) => {
      props.setShowLiquidityModalPopup(false);
      if (response.success) {
        setBalanceUpdate(true);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);

          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Increase liquidity ${localStorage.getItem(
                FIRST_TOKEN_AMOUNT
              )} ${localStorage.getItem(TOKEN_A)} / ${localStorage.getItem(
                SECOND_TOKEN_AMOUNT
              )} ${localStorage.getItem(TOKEN_B)}`,
              linkText: "View in block explorer",
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
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
        }, 6000);

        // setContentTransaction("");
      } else {
        setScreen(ActivePopUp.ManageExisting);
        setBalanceUpdate(true);
        //resetAllValues();
        setShowConfirmTransaction(false);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Increase liquidity ${localStorage.getItem(
                FIRST_TOKEN_AMOUNT
              )} ${localStorage.getItem(TOKEN_A)} / ${localStorage.getItem(
                SECOND_TOKEN_AMOUNT
              )} ${localStorage.getItem(TOKEN_B)}`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);

        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
        // setContentTransaction("");
      }
    });
  };

  const handleRemoveLiquidityOperation = () => {
    setContentTransaction(
      `Remove liquidity ${nFormatterWithLesserNumber5digit(
        selectedPosition.liquidity.x.minus(remove.x)
      )} ${tEZorCTEZtoUppercase(props.tokenIn.name)} / ${nFormatterWithLesserNumber5digit(
        selectedPosition.liquidity.y.minus(remove.y)
      )} `
    );
    localStorage.setItem(TOKEN_A, tEZorCTEZtoUppercase(props.tokenIn.name));
    localStorage.setItem(TOKEN_B, tEZorCTEZtoUppercase(props.tokenOut.name));
    localStorage.setItem(
      FIRST_TOKEN_AMOUNT,
      nFormatterWithLesserNumber5digit(selectedPosition.liquidity.x.minus(remove.x)).toString()
    );
    localStorage.setItem(
      SECOND_TOKEN_AMOUNT,
      nFormatterWithLesserNumber5digit(selectedPosition.liquidity.y.minus(remove.y)).toString()
    );
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    setScreen(ActivePopUp.ManageExisting);
    setShowConfirm(false);
    setShowConfirmTransaction(true);
    removeLiquidity(
      selectedPosition,
      removePercentage,
      walletAddress,
      props.tokenIn.symbol,
      props.tokenOut.symbol,
      Number(props.feeTier),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      undefined,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Remove liquidity ${localStorage.getItem(
          FIRST_TOKEN_AMOUNT
        )} ${localStorage.getItem(TOKEN_A)} / ${localStorage.getItem(
          SECOND_TOKEN_AMOUNT
        )} ${localStorage.getItem(TOKEN_B)}`,
        linkText: "View in block explorer",
        isLoading: true,
        transactionId: "",
      }
    ).then((response) => {
      props.setShowLiquidityModalPopup(false);
      if (response.success) {
        setBalanceUpdate(true);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);

          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Remove liquidity ${localStorage.getItem(
                FIRST_TOKEN_AMOUNT
              )} ${localStorage.getItem(TOKEN_A)} / ${localStorage.getItem(
                SECOND_TOKEN_AMOUNT
              )} ${localStorage.getItem(TOKEN_B)}`,
              linkText: "View in block explorer",
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
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
        }, 6000);

        // setContentTransaction("");
      } else {
        setScreen(ActivePopUp.ManageExisting);
        setBalanceUpdate(true);
        //resetAllValues();
        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Remove liquidity ${localStorage.getItem(
                FIRST_TOKEN_AMOUNT
              )} ${localStorage.getItem(TOKEN_A)} / ${localStorage.getItem(
                SECOND_TOKEN_AMOUNT
              )} ${localStorage.getItem(TOKEN_B)}`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);

        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
        // setContentTransaction("");
      }
    });
  };

  return true ? (
    <>
      <div
        id="modal_outer"
        className={clsx(
          screen === ActivePopUp.Positions
            ? "lg:w-[972px] lg:max-w-[972px] border  border-popUpNotification  lg:rounded-3xl p-5"
            : screen === ActivePopUp.ConfirmAddV3
            ? "sm:w-[602px] sm:max-w-[602px] border  border-popUpNotification lg:rounded-3xl  p-5"
            : screen === ActivePopUp.NewPosition
            ? "lg:w-[972px] lg:max-w-[972px] md:w-[602px] border  border-popUpNotification  md:rounded-3xl p-5"
            : "sm:w-[602px] sm:max-w-[602px] border md:rounded-3xl  border-popUpNotification   p-5",
          screen === ActivePopUp.ConfirmExisting && "hidden",
          "  mt-[70px] mb-[60px] lg:mt-[75px]  mx-auto fade-in  bg-card-500"
        )}
      >
        {screen === ActivePopUp.ManageExisting ? (
          <div>
            <div className="flex items-center">
              <p
                className="cursor-pointer relative top-[3px]"
                onClick={() => props.setShowLiquidityModalPopup(false)}
              >
                <Image alt={"alt"} src={arrowLeft} />
              </p>
              <p className="text-white">
                {props.activeState === ActiveLiquidity.Liquidity && "Manage liquidity"}
              </p>
              <p className="ml-1 relative top-[0px]">
                <InfoIconToolTip message={"Add or remove liquidity from the selected pool."} />
              </p>
            </div>
            <IncreaseDecreaseLiqMain
              selectedFeeTier={Number(props.feeTier)}
              setActiveStateIncDec={setActiveStateIncDec}
              activeStateIncDec={activeStateIncDec}
              firstTokenAmount={firstTokenAmountLiq}
              secondTokenAmount={secondTokenAmountLiq}
              tokenIn={props.tokenIn}
              tokenOut={props.tokenOut}
              setScreen={setScreen}
              setRemove={setRemove}
              removePercentage={removePercentage}
              setRemovePercentage={setRemovePercentage}
              remove={remove}
              setShow={setShowConfirm}
              userBalances={userBalances}
              setSecondTokenAmount={setSecondTokenAmountLiq}
              setFirstTokenAmount={setFirstTokenAmountLiq}
            />
          </div>
        ) : null}
      </div>
      {activeStateIncDec === ActiveIncDecState.Increase &&
        screen === ActivePopUp.ConfirmExisting && (
          <ConfirmIncreaseLiq
            setScreen={setScreen}
            tokenIn={props.tokenIn}
            tokenOut={props.tokenOut}
            addTokenA={firstTokenAmountLiq}
            addTokenB={secondTokenAmountLiq}
            show={showConfirm}
            setShow={setShowConfirm}
            handleClick={handleIncreaseLiquidityOperation}
          />
        )}
      {activeStateIncDec === ActiveIncDecState.Decrease &&
        screen === ActivePopUp.ConfirmExisting && (
          <ConfirmDecreaseLiq
            setScreen={setScreen}
            tokenIn={props.tokenIn}
            tokenOut={props.tokenOut}
            removeTokenA={remove.x}
            setShow={setShowConfirm}
            removeTokenB={remove.y}
            show={showConfirm}
            selectedPosition={selectedPosition}
            handleClick={handleRemoveLiquidityOperation}
          />
        )}
      {showVideoModal && <VideoModal closefn={setShowVideoModal} linkString={"HtDOhje7Y5A"} />}
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
    </>
  ) : null;
}
