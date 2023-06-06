import { BigNumber } from "bignumber.js";
import Image from "next/image";

import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import clock from "../../../src/assets/icon/poolsv3/settingsClock.svg";
import * as React from "react";
import { useEffect, useState } from "react";
import { POOL_TYPE } from "../../../pages/pools";
import {
  getBalanceFromTzkt,
  getPnlpBalance,
  getStakedBalance,
  getTezBalance,
} from "../../api/util/balance";
import { nFormatterWithLesserNumber, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { getLPTokenPrice } from "../../api/util/price";
import { ELocksState } from "../../api/votes/types";
import playBtn from "../../assets/icon/common/playBtn.svg";
import { tzktExplorer } from "../../common/walletconnect";
import { AppDispatch, useAppDispatch, useAppSelector } from "../../redux";
import ConfirmTransaction from "../ConfirmTransaction";
import { ISwapData, tokenParameterLiquidity } from "../Liquidity/types";
import { PopUpModal } from "../Modal/popupModal";
import { VideoModal } from "../Modal/videoModal";
import { ActiveLiquidity, ManageLiquidityHeader } from "../Pools/ManageLiquidityHeader";
import { InfoIconToolTip } from "../Tooltip/InfoIconTooltip";
import TransactionSubmitted from "../TransactionSubmitted";

import clsx from "clsx";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";

import { setFullRange, settopLevelSelectedToken } from "../../redux/poolsv3";
import IncreaseDecreaseLiqMain from "../v3/IncreaseDecreaseliqMain";
import ConfirmIncreaseLiq from "../v3/Confirmaddliq";
import ConfirmDecreaseLiq from "../v3/Confirmremoveliq";

export interface IManageLiquidityProps {
  closeFn: (val: boolean) => void;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  setActiveState: React.Dispatch<React.SetStateAction<string>>;
  activeState: string;
  showLiquidityModal?: boolean;
  setShowLiquidityModalPopup: React.Dispatch<React.SetStateAction<boolean>>;
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

  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);

  const walletAddress = useAppSelector((state) => state.wallet.address);
  const [activeStateIncDec, setActiveStateIncDec] = React.useState<ActiveIncDecState | string>(
    ActiveIncDecState.Increase
  );
  const [screen, setScreen] = React.useState(ActivePopUp.ManageExisting);
  const [firstTokenAmountLiq, setFirstTokenAmountLiq] = React.useState<string | number>("");
  const [secondTokenAmountLiq, setSecondTokenAmountLiq] = React.useState<number | string>("");

  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);

  const [transactionId, setTransactionId] = useState("");

  const dispatch = useAppDispatch();

  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };

  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);

  const [contentTransaction, setContentTransaction] = useState("");

  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>({});

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
    // props.setShowLiquidityModalPopup(false);
    props.closeFn(false);
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
        footerChild={
          <div className="flex justify-center items-center gap-2 md:gap-4 px-4 md:px-0">
            <p className="font-subtitle1 md:text-f16 text-text-150">
              {props.activeState === ActiveLiquidity.Liquidity &&
                "Add liquidity, stake, and earn PLY"}
              {props.activeState === ActiveLiquidity.Staking &&
                "Add liquidity, stake, and earn PLY"}
              {props.activeState === ActiveLiquidity.Rewards &&
                "Add liquidity, stake, and earn PLY"}
            </p>
            <Image
              className="cursor-pointer hover:opacity-90"
              onClick={() => setShowVideoModal(true)}
              src={playBtn}
            />
          </div>
        }
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
              setActiveStateIncDec={setActiveStateIncDec}
              activeStateIncDec={activeStateIncDec}
              firstTokenAmount={firstTokenAmountLiq}
              secondTokenAmount={secondTokenAmountLiq}
              tokenIn={props.tokenIn}
              tokenOut={props.tokenOut}
              setScreen={setScreen}
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
            addTokenA={2}
            addTokenB={5}
            existingTokenA={9}
            existingTokenB={9}
            show={true}
            setShow={() => {}}
            handleClick={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
      {activeStateIncDec === ActiveIncDecState.Decrease &&
        screen === ActivePopUp.ConfirmExisting && (
          <ConfirmDecreaseLiq
            setScreen={setScreen}
            tokenIn={props.tokenIn}
            tokenOut={props.tokenOut}
            removeTokenA={8}
            removeTokenB={9}
            show={true}
            setShow={() => {}}
            handleClick={function (): void {
              throw new Error("Function not implemented.");
            }}
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
