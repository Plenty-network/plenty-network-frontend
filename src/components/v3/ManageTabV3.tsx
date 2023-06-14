import { BigNumber } from "bignumber.js";
import Image from "next/image";

import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import clock from "../../../src/assets/icon/poolsv3/settingsClock.svg";
import * as React from "react";
import { useEffect, useState } from "react";
import { POOL_TYPE } from "../../../pages/pools";
import { getBalanceFromTzkt, getTezBalance } from "../../api/util/balance";
import { nFormatterWithLesserNumber, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import playBtn from "../../assets/icon/common/playBtn.svg";
import { tzktExplorer } from "../../common/walletconnect";

import {
  FIRST_TOKEN_AMOUNT,
  SECOND_TOKEN_AMOUNT,
  TOKEN_A,
  TOKEN_B,
} from "../../constants/localStorage";
import { AppDispatch, useAppDispatch, useAppSelector } from "../../redux";
import { setFlashMessage } from "../../redux/flashMessage";
import { setIsLoadingWallet } from "../../redux/walletLoading";
import ConfirmTransaction from "../ConfirmTransaction";
import { Flashtype } from "../FlashScreen";
import Liquidity from "../Liquidity";
import PositionsPopup from "./Positions";
import { ISwapData, tokenParameterLiquidity } from "../Liquidity/types";
import { PopUpModal } from "../Modal/popupModal";
import { VideoModal } from "../Modal/videoModal";
import { ActiveLiquidity } from "../Pools/ManageLiquidityHeader";
import { InfoIconToolTip } from "../Tooltip/InfoIconTooltip";
import TransactionSubmitted from "../TransactionSubmitted";
import LiquidityV3 from "./LiquidityV3";
import PriceRangeV3 from "./PriceRange";
import clsx from "clsx";
import Button from "../Button/Button";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";

import ConfirmAddLiquidityv3 from "./ConfirmAddLiqV3";
import {
  setFullRange,
  setTokenInOrg,
  setTokenInV3,
  setTokeOutOrg,
  setTokeOutV3,
  settopLevelSelectedToken,
} from "../../redux/poolsv3";
import IncreaseDecreaseLiqMain from "./IncreaseDecreaseliqMain";
import ConfirmIncreaseLiq from "./Confirmaddliq";
import ConfirmDecreaseLiq from "./Confirmremoveliq";
import TransactionSettingsV3 from "./TransactionSettingv3";
import { LiquidityOperation } from "../../operations/v3/liquidity";
import { getPositons } from "../../api/v3/positions";

export interface IManageLiquidityProps {
  closeFn: (val: boolean) => void;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  tokenA: tokenParameterLiquidity;
  tokenB: tokenParameterLiquidity;
  setActiveState: React.Dispatch<React.SetStateAction<string>>;
  activeState: string;
  isGaugeAvailable: boolean;
  showLiquidityModal?: boolean;
  setShowLiquidityModalPopup: React.Dispatch<React.SetStateAction<boolean>>;
  filter?: POOL_TYPE | undefined;
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

export function ManageTabV3(props: IManageLiquidityProps) {
  const [selectedFeeTier, setSelectedFeeTier] = useState("0.01");
  const inputDisabled = useAppSelector((state) => state.poolsv3.inputDisable);
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);
  const minTickA = useAppSelector((state) => state.poolsv3.minTickA);
  const maxTickA = useAppSelector((state) => state.poolsv3.maxTickA);
  const tokeninorg = useAppSelector((state) => state.poolsv3.tokenInOrg);

  const minTickB = useAppSelector((state) => state.poolsv3.minTickB);
  const maxTickB = useAppSelector((state) => state.poolsv3.maxTickB);

  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [slippage, setSlippage] = useState(30);
  const TOKEN = useAppSelector((state) => state.config.tokens);

  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);

  const walletAddress = useAppSelector((state) => state.wallet.address);
  const [activeStateIncDec, setActiveStateIncDec] = React.useState<ActiveIncDecState | string>(
    ActiveIncDecState.Increase
  );
  const [screen, setScreen] = React.useState(ActivePopUp.Positions);
  const [firstTokenAmountLiq, setFirstTokenAmountLiq] = React.useState<string | number>("");
  const [secondTokenAmountLiq, setSecondTokenAmountLiq] = React.useState<number | string>("");

  const [isAddLiquidity, setIsAddLiquidity] = useState(true);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);

  const [transactionId, setTransactionId] = useState("");

  const dispatch = useAppDispatch();
  const [pnlpEstimates, setPnlpEstimates] = useState("");
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };

  const [sharePool, setSharePool] = useState("");
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [contentTransaction, setContentTransaction] = useState("");

  const [settingsShow, setSettingsShow] = useState(false);
  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>({});
  const refSettingTab = React.useRef(null);
  useEffect(() => {
    //topLevelSelectedToken.symbol === props.tokenIn.symbol
    dispatch(setTokenInV3(props.tokenIn));
    dispatch(setTokeOutV3(props.tokenOut));

    dispatch(setTokenInOrg(props.tokenA));
    dispatch(setTokeOutOrg(props.tokenB));
  }, [props.tokenIn, props.tokenA, props.tokenB]);
  useEffect(() => {
    /*     getPositons(
      props.tokenIn.symbol,
      props.tokenOut.symbol,
      "0.05",
      walletAddress,
      tokenPrice
    ).then((res) => {
      console.log("positions", res);
    }); */
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
  const [isClearAll, setisClearAll] = useState(false);
  const resetAllValues = () => {
    setisClearAll(true);
    setFirstTokenAmountLiq("");
    setSecondTokenAmountLiq("");
    dispatch(settopLevelSelectedToken(props.tokenA));
    dispatch(setFullRange(false));
    setBalanceUpdate(false);
    setTimeout(() => {
      setisClearAll(false);
    }, 4000);
  };
  const [deadline, setDeadline] = useState(0);
  useEffect(() => {
    const n = slippage === 1 ? 60 : slippage === 2 ? 120 : Number(slippage);

    setDeadline(Math.floor(new Date().getTime() / 1000) + n * 60);
  }, [slippage]);
  const handleAddLiquidityOperation = () => {
    setContentTransaction(
      `Mint ${nFormatterWithLesserNumber(
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
    setShowConfirmTransaction(true);
    setScreen(ActivePopUp.NewPosition);
    console.log(
      "parameters",
      walletAddress,
      topLevelSelectedToken.symbol === tokeninorg.symbol ? minTickA : minTickB,
      topLevelSelectedToken.symbol === tokeninorg.symbol ? maxTickA : maxTickB,
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? props.tokenIn.symbol
        : props.tokenOut.symbol,
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? props.tokenOut.symbol
        : props.tokenIn.symbol,
      deadline,
      {
        x:
          topLevelSelectedToken.symbol === tokeninorg.symbol
            ? new BigNumber(firstTokenAmountLiq).toString()
            : new BigNumber(secondTokenAmountLiq).toString(),
        y:
          topLevelSelectedToken.symbol === tokeninorg.symbol
            ? new BigNumber(secondTokenAmountLiq).toString()
            : new BigNumber(firstTokenAmountLiq).toString(),
      }
    );
    LiquidityOperation(
      walletAddress,
      topLevelSelectedToken.symbol === tokeninorg.symbol ? minTickA : minTickB,
      topLevelSelectedToken.symbol === tokeninorg.symbol ? maxTickA : maxTickB,
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? props.tokenIn.symbol
        : props.tokenOut.symbol,
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? props.tokenOut.symbol
        : props.tokenIn.symbol,
      deadline,
      {
        x:
          topLevelSelectedToken.symbol === tokeninorg.symbol
            ? new BigNumber(firstTokenAmountLiq)
            : new BigNumber(secondTokenAmountLiq),
        y:
          topLevelSelectedToken.symbol === tokeninorg.symbol
            ? new BigNumber(secondTokenAmountLiq)
            : new BigNumber(firstTokenAmountLiq),
      },
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `add liq`,
        linkText: "View in Explorer",
        isLoading: true,
        transactionId: "",
      }
    ).then((response) => {
      console.log("res", response);
      if (response.success) {
        setBalanceUpdate(true);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Add ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} ${localStorage.getItem(
                TOKEN_A
              )} and ${localStorage.getItem(SECOND_TOKEN_AMOUNT)} ${localStorage.getItem(TOKEN_B)}`,
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
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
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
              trailingText: `Add ${localStorage.getItem(FIRST_TOKEN_AMOUNT)} ${localStorage.getItem(
                TOKEN_A
              )} and ${localStorage.getItem(SECOND_TOKEN_AMOUNT)} ${localStorage.getItem(TOKEN_B)}`,
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

  const closeModal = () => {
    // props.setShowLiquidityModalPopup(false);
    props.closeFn(false);
  };
  const handleAddLiquidity = () => {
    setScreen(ActivePopUp.ConfirmAddV3);
  };

  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const AddButton = React.useMemo(() => {
    if (!walletAddress) {
      return (
        <Button height="52px" onClick={connectTempleWallet} color={"primary"}>
          Connect wallet
        </Button>
      );
    } else if (
      (inputDisabled == "false" && Number(firstTokenAmountLiq) <= 0) ||
      (inputDisabled == "false" && Number(secondTokenAmountLiq) <= 0)
    ) {
      return (
        <Button height="52px" onClick={() => null} color={"disabled"}>
          Add
        </Button>
      );
    } else if (
      walletAddress &&
      ((firstTokenAmountLiq && firstTokenAmountLiq > Number(userBalances[props.tokenIn.name])) ||
        (secondTokenAmountLiq && secondTokenAmountLiq) > Number(userBalances[props.tokenOut.name]))
    ) {
      return (
        <Button height="52px" onClick={() => null} color={"disabled"}>
          Insufficient balance
        </Button>
      );
    } else {
      return (
        <Button height="52px" color={"primary"} onClick={handleAddLiquidity}>
          Add
        </Button>
      );
    }
  }, [props, firstTokenAmountLiq, secondTokenAmountLiq, inputDisabled]);
  const [selectedToken, setSelectedToken] = useState({} as tokenParameterLiquidity);
  useEffect(() => {
    setSelectedToken(props.tokenA);
  }, []);
  useEffect(() => {
    dispatch(settopLevelSelectedToken(selectedToken));
  }, [selectedToken]);

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
        {screen === ActivePopUp.NewPosition ? (
          <>
            <div className="flex gap-1 items-center">
              <p
                className="cursor-pointer relative top-[3px]"
                onClick={() => setScreen(ActivePopUp.Positions)}
              >
                <Image alt={"alt"} src={arrowLeft} />
              </p>
              <p className="text-white">
                {props.activeState === ActiveLiquidity.Liquidity && "Manage liquidity"}
              </p>
              <p className="ml-1 relative top-[0px]">
                <InfoIconToolTip message={"Add or remove liquidity from the selected pool."} />
              </p>
              <p
                className="text-primary-500 font-subtitle1 ml-auto mr-5 cursor-pointer"
                onClick={resetAllValues}
              >
                Clear All
              </p>
              <div className="border border-text-800 rounded-lg	bg-info-900 h-[27px] p-[1px] cursor-pointer flex items-center w-fit  mr-4">
                <div
                  className={clsx(
                    selectedToken.symbol === props.tokenA.symbol
                      ? "h-[23px] px-2  bg-shimmer-200 rounded-[6px]	"
                      : "text-text-250 px-2",
                    "font-subtitle1223"
                  )}
                  onClick={() => {
                    setSelectedToken(props.tokenA);
                  }}
                >
                  {tEZorCTEZtoUppercase(props.tokenA.symbol)}
                </div>
                <div
                  className={clsx(
                    selectedToken.symbol === props.tokenB.symbol
                      ? "h-[23px] px-2  bg-shimmer-200 rounded-[6px]	"
                      : "text-text-250 px-2",
                    "font-subtitle1223"
                  )}
                  onClick={() => {
                    setSelectedToken(props.tokenB);
                  }}
                >
                  {tEZorCTEZtoUppercase(props.tokenB.symbol)}
                </div>
              </div>
              <div className="flex items-center justify-between flex-row  relative mr-[48px]">
                <div
                  ref={refSettingTab}
                  className="py-1  px-[8.5px] h-8 border border-text-700 cursor-pointer rounded-lg flex items-center w-[80px]"
                  onClick={() => setSettingsShow(!settingsShow)}
                >
                  <Image alt={"alt"} src={clock} height={"20px"} width={"20px"} />
                  <span className="text-white font-body4 ml-2 relative top-px">
                    {slippage ? slippage : "30"}m
                  </span>
                </div>
                <TransactionSettingsV3
                  show={settingsShow}
                  setSlippage={setSlippage}
                  slippage={slippage}
                  setSettingsShow={setSettingsShow}
                />
              </div>
            </div>

            <div className="sm:flex  mt-4">
              <PriceRangeV3
                tokenIn={props.tokenIn}
                tokenOut={props.tokenOut}
                isClearAll={isClearAll}
                selectedFeeTier={selectedFeeTier}
              />
              <div className="">
                <LiquidityV3
                  setSelectedFeeTier={setSelectedFeeTier}
                  selectedFeeTier={selectedFeeTier}
                  setScreen={setScreen}
                  feeTier={props.feeTier}
                  firstTokenAmount={firstTokenAmountLiq}
                  secondTokenAmount={secondTokenAmountLiq}
                  userBalances={userBalances}
                  setSecondTokenAmount={setSecondTokenAmountLiq}
                  setFirstTokenAmount={setFirstTokenAmountLiq}
                  tokenIn={props.tokenIn}
                  tokenOut={props.tokenOut}
                  setIsAddLiquidity={setIsAddLiquidity}
                  isAddLiquidity={isAddLiquidity}
                  setSlippage={setSlippage}
                  slippage={slippage}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </>
        ) : screen === ActivePopUp.Positions ? (
          <>
            <div className="flex gap-1">
              <p className="text-white">
                {props.activeState === ActiveLiquidity.Liquidity && "Manage liquidity"}
              </p>
              <p className="ml-1 relative top-[3px]">
                <InfoIconToolTip message={"Add or remove liquidity from the selected pool."} />
              </p>
            </div>
            <PositionsPopup
              tokenIn={props.tokenIn}
              tokenOut={props.tokenOut}
              setScreen={setScreen}
            />
          </>
        ) : screen === ActivePopUp.ManageExisting ? (
          <div>
            <div className="flex items-center">
              <p
                className="cursor-pointer  relative top-[3px]"
                onClick={() => setScreen(ActivePopUp.Positions)}
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
        {screen === ActivePopUp.NewPosition && <div className="mt-2">{AddButton}</div>}
        {props.activeState === ActiveLiquidity.Liquidity && screen === ActivePopUp.ConfirmAddV3 && (
          <>
            <ConfirmAddLiquidityv3
              setScreen={setScreen}
              firstTokenAmount={firstTokenAmountLiq}
              secondTokenAmount={secondTokenAmountLiq}
              tokenIn={props.tokenA}
              tokenOut={props.tokenB}
              tokenPrice={tokenPrice}
              pnlpEstimates={pnlpEstimates}
              sharePool={sharePool}
              slippage={slippage}
              handleAddLiquidityOperation={handleAddLiquidityOperation}
            />
          </>
        )}
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
