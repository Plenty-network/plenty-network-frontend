import { BigNumber } from "bignumber.js";
import Image from "next/image";

import * as React from "react";
import { useEffect, useState } from "react";
import { getBalanceFromTzkt, getTezBalance } from "../../api/util/balance";
import { nFormatterWithLesserNumber, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { tzktExplorer } from "../../common/walletconnect";
import { useAppDispatch, useAppSelector } from "../../redux";
import ConfirmTransaction from "../ConfirmTransaction";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { PopUpModal } from "../Modal/popupModal";
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
      `Increase Liquidity ${nFormatterWithLesserNumber(
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
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Increase Liquidity ${localStorage.getItem(
          FIRST_TOKEN_AMOUNT
        )} ${localStorage.getItem(TOKEN_A)} / ${localStorage.getItem(
          SECOND_TOKEN_AMOUNT
        )} ${localStorage.getItem(TOKEN_B)}`,
        linkText: "View in Explorer",
        isLoading: true,
        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Increase Liquidity ${localStorage.getItem(
                FIRST_TOKEN_AMOUNT
              )} ${localStorage.getItem(TOKEN_A)} / ${localStorage.getItem(
                SECOND_TOKEN_AMOUNT
              )} ${localStorage.getItem(TOKEN_B)}`,
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
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
        }, 6000);

        // setContentTransaction("");
      } else {
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
              trailingText: `Increase Liquidity ${localStorage.getItem(
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
      `Remove liquidity ${nFormatterWithLesserNumber(remove.x)} ${tEZorCTEZtoUppercase(
        props.tokenIn.name
      )} / ${nFormatterWithLesserNumber(remove.y)} ${tEZorCTEZtoUppercase(props.tokenOut.name)} `
    );
    localStorage.setItem(TOKEN_A, tEZorCTEZtoUppercase(props.tokenIn.name));
    localStorage.setItem(TOKEN_B, tEZorCTEZtoUppercase(props.tokenOut.name));
    localStorage.setItem(FIRST_TOKEN_AMOUNT, nFormatterWithLesserNumber(remove.x).toString());
    localStorage.setItem(SECOND_TOKEN_AMOUNT, nFormatterWithLesserNumber(remove.y).toString());
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
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Remove liquidity ${localStorage.getItem(
          FIRST_TOKEN_AMOUNT
        )} ${localStorage.getItem(TOKEN_A)} / ${localStorage.getItem(
          SECOND_TOKEN_AMOUNT
        )} ${localStorage.getItem(TOKEN_B)}`,
        linkText: "View in Explorer",
        isLoading: true,
        transactionId: "",
      }
    ).then((response) => {
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
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
        }, 6000);

        // setContentTransaction("");
      } else {
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
      <PopUpModal
        onhide={closeModal}
        className={clsx(
          screen === ActivePopUp.Positions
            ? "sm:w-[880px] sm:max-w-[880px]"
            : screen === ActivePopUp.ConfirmAddV3
            ? "sm:w-[602px] sm:max-w-[602px]"
            : screen === ActivePopUp.NewPosition
            ? "sm:w-[972px] sm:max-w-[972px]"
            : "sm:w-[602px] sm:max-w-[602px]",
          "w-[414px] max-w-[414px]  rounded-none sm:rounded-3xl px-4"
        )}
        // footerChild={
        //   <div className="flex justify-center items-center gap-2 md:gap-4 px-4 md:px-0">
        //     <p className="font-subtitle1 md:text-f16 text-text-150">
        //       {props.activeState === ActiveLiquidity.Liquidity &&
        //         "Add liquidity, stake, and earn PLY"}
        //       {props.activeState === ActiveLiquidity.Staking &&
        //         "Add liquidity, stake, and earn PLY"}
        //       {props.activeState === ActiveLiquidity.Rewards &&
        //         "Add liquidity, stake, and earn PLY"}
        //     </p>
        //     <Image
        //       className="cursor-pointer hover:opacity-90"
        //       onClick={() => setShowVideoModal(true)}
        //       src={playBtn}
        //     />
        //   </div>
        // }
      >
        {screen === ActivePopUp.ManageExisting ? (
          <div>
            <div className="flex items-center">
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
      </PopUpModal>
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
