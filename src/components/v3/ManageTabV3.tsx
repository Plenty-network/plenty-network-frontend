import { BigNumber } from "bignumber.js";
import Image from "next/image";

import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import clock from "../../../src/assets/icon/poolsv3/settingsClock.svg";
import * as React from "react";
import { useEffect, useState } from "react";
import { POOL_TYPE } from "../../../pages/pools";
import { getBalanceFromTzkt, getTezBalance } from "../../api/util/balance";
import {
  nFormatterWithLesserNumber,
  nFormatterWithLesserNumber5digit,
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";
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
  setIsLoading,
  setBcurrentPrice,
  setBleftbrush,
  setBleftRangeInput,
  setBrightbrush,
  setBRightRangeInput,
  setcurrentPrice,
  setFullRange,
  setInitBound,
  setleftbrush,
  setleftRangeInput,
  setmaxTickA,
  setmaxTickB,
  setminTickA,
  setminTickB,
  setrightbrush,
  setRightRangeInput,
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
import {
  increaseLiquidity,
  LiquidityOperation,
  removeLiquidity,
} from "../../operations/v3/liquidity";
import { calculateCurrentPrice, getInitialBoundaries } from "../../api/v3/liquidity";
import { BalanceNat, IV3PositionObject } from "../../api/v3/types";
import { collectFees } from "../../operations/v3/fee";
import FeeTierMain from "./FeeTierMain";
import Link from "next/link";
import TransactionSettings from "../TransactionSettings/TransactionSettings";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { WatchTutorial } from "../Button/watchTutorial";
import Tutorial from "../Tutorial";

export interface IManageLiquidityProps {
  closeFn: (val: boolean) => void;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  tokenA: tokenParameterLiquidity;
  tokenB: tokenParameterLiquidity;
  activeState: string;
  isGaugeAvailable: boolean;
  showLiquidityModal?: boolean;
  setShowLiquidityModalPopup: (val: boolean) => void;
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
  const [selectedFeeTier, setSelectedFeeTier] = useState(props.feeTier);
  const inputDisabled = useAppSelector((state) => state.poolsv3.inputDisable);
  const leftRangeInput = useAppSelector((state) => state.poolsv3.leftRangeInput);
  const rightRangeInput = useAppSelector((state) => state.poolsv3.RightRangeInput);
  const BleftRangeInput = useAppSelector((state) => state.poolsv3.BleftRangeInput);
  const BrightRangeInput = useAppSelector((state) => state.poolsv3.BRightRangeInput);
  const [showConfirm, setShowConfirm] = useState(false);
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);
  const minTickA = useAppSelector((state) => state.poolsv3.minTickA);
  const maxTickA = useAppSelector((state) => state.poolsv3.maxTickA);
  const [removePercentage, setRemovePercentage] = useState(25);
  const tokeninorg = useAppSelector((state) => state.poolsv3.tokenInOrg);
  const [remove, setRemove] = useState({} as BalanceNat);
  const minTickB = useAppSelector((state) => state.poolsv3.minTickB);
  const maxTickB = useAppSelector((state) => state.poolsv3.maxTickB);
  const selectedPosition = useAppSelector((state) => state.poolsv3.selectedPosition);
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
  const [firstTokenAmountIncLiq, setFirstTokenAmountIncLiq] = React.useState<string | number>("");
  const [secondTokenAmountIncLiq, setSecondTokenAmountIncLiq] = React.useState<number | string>("");

  const [isAddLiquidity, setIsAddLiquidity] = useState(true);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);

  const [transactionId, setTransactionId] = useState("");

  const dispatch = useAppDispatch();
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };

  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const handleCloseTransactionSubmitted = () => {
    setShowTransactionSubmitModal(false);
    setScreen(ActivePopUp.Positions);
  };

  const [contentTransaction, setContentTransaction] = useState("");
  const [contentTransactionSubmitted, setContentTransactionSubmitted] = useState("");

  const [settingsShow, setSettingsShow] = useState(false);
  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>({});
  const refSettingTab = React.useRef(null);
  // useOutsideClick(refSettingTab, () => {
  //   setSettingsShow(false);
  // });
  useEffect(() => {
    //topLevelSelectedToken.symbol === props.tokenIn.symbol
    dispatch(setTokenInV3(props.tokenIn));
    dispatch(setTokeOutV3(props.tokenOut));

    dispatch(setTokenInOrg(props.tokenA));
    dispatch(setTokeOutOrg(props.tokenB));
  }, [props.tokenIn, props.tokenA, props.tokenB]);
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
  const [isClearAll, setisClearAll] = useState(false);
  const [isFullRange, setFullRangee] = React.useState(false);
  const resetAllValues = () => {
    setFullRangee(false);
    setSelectedFeeTier(props.feeTier);
    setisClearAll(true);
    setFirstTokenAmountIncLiq("");
    setSecondTokenAmountIncLiq("");
    setRemove({} as BalanceNat);
    setFirstTokenAmountLiq("");
    setSecondTokenAmountLiq("");
    dispatch(setleftbrush(0));
    dispatch(setrightbrush(0));
    dispatch(setBleftbrush(0));
    dispatch(setBrightbrush(0));
    dispatch(settopLevelSelectedToken(props.tokenA));
    dispatch(setFullRange(false));
    setBalanceUpdate(false);
    setTimeout(() => {
      setisClearAll(false);
    }, 4000);
  };

  const handleAddLiquidityOperation = () => {
    setContentTransaction(
      `Mint position ${nFormatterWithLesserNumber(
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
      Math.floor(new Date().getTime() / 1000) + slippage * 60,
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
      Math.floor(new Date().getTime() / 1000) + slippage * 60,
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
      Number(selectedFeeTier),
      setScreen,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Mint position ${localStorage.getItem(
          FIRST_TOKEN_AMOUNT
        )} ${localStorage.getItem(TOKEN_A)} / ${localStorage.getItem(
          SECOND_TOKEN_AMOUNT
        )} ${localStorage.getItem(TOKEN_B)}`,
        linkText: "View in block explorer",
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
              trailingText: `Mint Position ${localStorage.getItem(
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
        }, 6000);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
        }, 12000);
        // setContentTransaction("");
      } else {
        setScreen(ActivePopUp.NewPosition);
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
              trailingText: `Mint position ${localStorage.getItem(
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

  const closeModal = () => {
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
      Number(
        topLevelSelectedToken.symbol === tokeninorg.symbol ? rightRangeInput : BrightRangeInput
      ) <=
      Number(topLevelSelectedToken.symbol === tokeninorg.symbol ? leftRangeInput : BleftRangeInput)
    ) {
      return (
        <Button height="52px" onClick={() => null} color={"disabled"}>
          Range is invalid
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
      (inputDisabled == "first" && Number(secondTokenAmountLiq) <= 0) ||
      (inputDisabled == "second" && Number(firstTokenAmountLiq) <= 0)
    ) {
      return (
        <Button height="52px" onClick={() => null} color={"disabled"}>
          Add
        </Button>
      );
    } else if (
      walletAddress &&
      ((firstTokenAmountLiq &&
        Number(firstTokenAmountLiq) > Number(userBalances[props.tokenIn.name])) ||
        (secondTokenAmountLiq &&
          Number(secondTokenAmountLiq) > Number(userBalances[props.tokenOut.name])))
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
  }, [
    props,
    firstTokenAmountLiq,
    secondTokenAmountLiq,
    inputDisabled,
    leftRangeInput,
    BleftRangeInput,
    rightRangeInput,
    BrightRangeInput,
  ]);
  const [selectedToken, setSelectedToken] = useState({} as tokenParameterLiquidity);
  useEffect(() => {
    setSelectedToken(props.tokenA);
  }, []);
  useEffect(() => {
    dispatch(settopLevelSelectedToken(selectedToken));
  }, [selectedToken]);

  React.useEffect(() => {
    //if (!isFullRange) {
    dispatch(setIsLoading(true));

    calculateCurrentPrice(
      props.tokenA.symbol,
      props.tokenB.symbol,
      props.tokenA.symbol,
      Number(selectedFeeTier)
    ).then((response) => {
      dispatch(setcurrentPrice(response?.toFixed(6)));
    });
    calculateCurrentPrice(
      props.tokenA.symbol,
      props.tokenB.symbol,
      props.tokenB.symbol,
      Number(selectedFeeTier)
    ).then((response) => {
      dispatch(setBcurrentPrice(response?.toFixed(6)));
    });
    dispatch(setIsLoading(true));
    getInitialBoundaries(props.tokenA.symbol, props.tokenB.symbol, Number(selectedFeeTier)).then(
      (response) => {
        dispatch(setInitBound(response));
        if (
          new BigNumber(1)
            .dividedBy(response.minValue)
            .isGreaterThan(new BigNumber(1).dividedBy(response.maxValue))
        ) {
          dispatch(setleftRangeInput(Number(response.minValue).toFixed(6)));

          dispatch(setBleftRangeInput(new BigNumber(1).dividedBy(response.maxValue).toFixed(6)));

          dispatch(setRightRangeInput(response.maxValue.toFixed(6)));

          dispatch(setBRightRangeInput(new BigNumber(1).dividedBy(response.minValue).toFixed(6)));

          dispatch(setleftbrush(response.minValue.toFixed(6)));

          dispatch(setBleftbrush(new BigNumber(1).dividedBy(response.maxValue).toFixed(6)));

          dispatch(setrightbrush(response.maxValue.toFixed(6)));

          dispatch(setBrightbrush(new BigNumber(1).dividedBy(response.minValue).toFixed(6)));

          dispatch(setIsLoading(false));
        } else {
          dispatch(setleftRangeInput(response.minValue.toFixed(6)));

          dispatch(setBleftRangeInput(new BigNumber(1).dividedBy(response.minValue).toFixed(6)));

          dispatch(setRightRangeInput(response.maxValue.toFixed(6)));

          dispatch(setBRightRangeInput(new BigNumber(1).dividedBy(response.maxValue).toFixed(6)));

          dispatch(setleftbrush(response.minValue.toFixed(6)));

          dispatch(setBleftbrush(new BigNumber(1).dividedBy(response.minValue).toFixed(6)));

          dispatch(setrightbrush(response.maxValue.toFixed(6)));

          dispatch(setBrightbrush(new BigNumber(1).dividedBy(response.maxValue).toFixed(6)));

          dispatch(setIsLoading(false));
        }

        dispatch(setminTickA(response.minTick.toString()));

        dispatch(setminTickB(response.minTick.toString()));

        dispatch(setmaxTickA(response.maxTick.toString()));

        dispatch(setmaxTickB(response.maxTick.toString()));
      }
    );
    //}
  }, [isClearAll, selectedFeeTier, props.tokenA.symbol, props.tokenB.symbol]);

  const handleIncreaseLiquidityOperation = () => {
    setContentTransaction(
      `Increase liquidity ${nFormatterWithLesserNumber(
        new BigNumber(firstTokenAmountIncLiq)
      )} ${tEZorCTEZtoUppercase(props.tokenIn.name)} / ${nFormatterWithLesserNumber(
        new BigNumber(secondTokenAmountIncLiq)
      )} ${tEZorCTEZtoUppercase(props.tokenOut.name)} `
    );
    localStorage.setItem(TOKEN_A, tEZorCTEZtoUppercase(props.tokenA.name));
    localStorage.setItem(TOKEN_B, tEZorCTEZtoUppercase(props.tokenB.name));
    localStorage.setItem(
      FIRST_TOKEN_AMOUNT,
      nFormatterWithLesserNumber(new BigNumber(firstTokenAmountIncLiq)).toString()
    );
    localStorage.setItem(
      SECOND_TOKEN_AMOUNT,
      nFormatterWithLesserNumber(new BigNumber(secondTokenAmountIncLiq)).toString()
    );
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));

    setShowConfirm(false);
    setShowConfirmTransaction(true);

    increaseLiquidity(
      selectedPosition,
      {
        x: new BigNumber(firstTokenAmountIncLiq),
        y: new BigNumber(secondTokenAmountIncLiq),
      },
      props.tokenA.symbol,
      props.tokenB.symbol,
      walletAddress,
      Number(selectedFeeTier),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      setScreen,
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
      )} ${tEZorCTEZtoUppercase(props.tokenA.name)} / ${nFormatterWithLesserNumber5digit(
        selectedPosition.liquidity.y.minus(remove.y)
      )} ${tEZorCTEZtoUppercase(props.tokenB.name)} `
    );
    localStorage.setItem(TOKEN_A, tEZorCTEZtoUppercase(props.tokenA.name));
    localStorage.setItem(TOKEN_B, tEZorCTEZtoUppercase(props.tokenB.name));
    localStorage.setItem(
      FIRST_TOKEN_AMOUNT,
      nFormatterWithLesserNumber5digit(selectedPosition.liquidity.x.minus(remove.x)).toString()
    );
    localStorage.setItem(
      SECOND_TOKEN_AMOUNT,
      nFormatterWithLesserNumber5digit(selectedPosition.liquidity.y.minus(remove.y)).toString()
    );
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));

    setShowConfirm(false);
    setShowConfirmTransaction(true);
    removeLiquidity(
      selectedPosition,
      removePercentage,
      walletAddress,
      props.tokenA.symbol,
      props.tokenB.symbol,
      Number(selectedFeeTier),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      setScreen,
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
        }, 6000);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
        }, 9000);
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

  const handleCollectFeeOperation = (selectedPositionParameter: IV3PositionObject) => {
    setContentTransaction(`Collecting fee`);

    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));

    collectFees(
      selectedPositionParameter,
      walletAddress,
      props.tokenA.symbol,
      props.tokenB.symbol,
      Number(selectedFeeTier),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Collecting fee`,
        linkText: "View in block explorer",
        isLoading: true,

        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        setTimeout(() => {
          dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Collecting fee`,
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
        }, 6000);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        setContentTransaction("");
        dispatch(
          setFlashMessage({
            flashType: Flashtype.Rejected,
            headerText: "Rejected",
            trailingText:
              response.error === "NOT_ENOUGH_TEZ" ? `You do not have enough tez` : `Collecting fee`,
            linkText: "",
            isLoading: true,
            transactionId: "",
          })
        );
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
      }
    });
  };
  const [showTutorial, setShowTutorial] = useState(false);
  return props.showLiquidityModal ? (
    <>
      <div
        id="modal_outer"
        className={clsx(
          screen === ActivePopUp.Positions
            ? "lg:w-[972px] lg:max-w-[972px] border  border-popUpNotification  lg:rounded-3xl py-5 px-3 md:p-5 "
            : screen === ActivePopUp.ConfirmAddV3
            ? "sm:w-[602px] sm:max-w-[602px] border  border-popUpNotification lg:rounded-3xl py-5 px-3 md:p-5 mb-[60px]"
            : screen === ActivePopUp.NewPosition
            ? " lg:w-[972px] lg:max-w-[972px] md:w-[602px] border  border-popUpNotification  md:rounded-3xl py-5 px-3 md:p-5"
            : "sm:w-[602px] sm:max-w-[602px] border md:rounded-3xl  border-popUpNotification  py-5 px-3 md:p-5 mb-[60px]",
          screen === ActivePopUp.ConfirmExisting && "hidden",
          "  mt-[70px]   lg:mt-[75px]  mx-auto fade-in  bg-card-500"
        )}
      >
        {screen === ActivePopUp.NewPosition ? (
          <>
            <div className="flex gap-1 items-center justify-between relative">
              <div className="flex items-center">
                <p
                  className="cursor-pointer relative top-[3px]"
                  onClick={() => setScreen(ActivePopUp.Positions)}
                >
                  <Image alt={"alt"} src={arrowLeft} />
                </p>
                <p className="text-white">
                  {props.activeState === ActiveLiquidity.Liquidity && "New position"}
                </p>
              </div>
              {/* <p className="ml-1 relative top-[0px]">
                <InfoIconToolTip message={"Add or remove liquidity from the selected pool."} />
              </p> */}

              <div className="lg:flex justify-end items-center hidden">
                {" "}
                <p
                  className="text-primary-500 hover:text-primary-500/[0.8] font-subtitle1 ml-auto mr-5 cursor-pointer"
                  onClick={resetAllValues}
                >
                  Clear all
                </p>
                <div className="border border-text-800 rounded-lg	bg-info-900 h-[27px] p-[1px] cursor-pointer flex items-center w-fit  mr-4">
                  <div
                    className={clsx(
                      selectedToken.symbol === props.tokenA.symbol
                        ? "h-[23px] px-2  bg-shimmer-200 rounded-[6px]	"
                        : "text-text-250 hover:text-white px-2",
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
                        : "text-text-250 hover:text-white px-2",
                      "font-subtitle1223"
                    )}
                    onClick={() => {
                      setSelectedToken(props.tokenB);
                    }}
                  >
                    {tEZorCTEZtoUppercase(props.tokenB.symbol)}
                  </div>
                </div>
                <div className="flex items-center justify-between flex-row   ">
                  <div
                    ref={refSettingTab}
                    className="py-1 bg-text-800/[0.25] hover:bg-text=800/[0.5] px-[8.5px] h-8 border border-text-700 hover:border-text-600 cursor-pointer rounded-lg flex items-center w-fit"
                    onClick={() => setSettingsShow(!settingsShow)}
                  >
                    <Image alt={"alt"} src={clock} height={"20px"} width={"20px"} />
                    <span className="text-white font-body4 ml-2 relative top-px">
                      {slippage ? slippage : "30"}m
                    </span>
                  </div>
                </div>
                <TransactionSettingsV3
                  show={settingsShow}
                  setSlippage={setSlippage}
                  slippage={slippage}
                  setSettingsShow={setSettingsShow}
                />
              </div>
            </div>

            <div className="flex items-center justify-end mt-1 lg:hidden">
              <p
                className="text-primary-500 hover:text-primary-500/[0.8] font-subtitle1 ml-auto mr-5 cursor-pointer"
                onClick={resetAllValues}
              >
                Clear all
              </p>
              <div className="border border-text-800 rounded-lg	bg-info-900 h-[27px] p-[1px] cursor-pointer flex items-center w-fit  mr-4">
                <div
                  className={clsx(
                    selectedToken.symbol === props.tokenA.symbol
                      ? "h-[23px] px-2  bg-shimmer-200 rounded-[6px]	"
                      : "text-text-250 hover:text-white px-2",
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
                      : "text-text-250 hover:text-white px-2",
                    "font-subtitle1223"
                  )}
                  onClick={() => {
                    setSelectedToken(props.tokenB);
                  }}
                >
                  {tEZorCTEZtoUppercase(props.tokenB.symbol)}
                </div>
              </div>
              <div className="flex items-center justify-between flex-row   ">
                <div
                  ref={refSettingTab}
                  className="py-1 bg-text-800/[0.25] hover:bg-text=800/[0.5] px-[8.5px] h-8 border border-text-700 hover:border-text-600 cursor-pointer rounded-lg flex items-center w-[80px]"
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
              </div>{" "}
            </div>

            <div className="mt-5 lg:hidden">
              <FeeTierMain
                setSelectedFeeTier={setSelectedFeeTier}
                selectedFeeTier={selectedFeeTier}
                feeTier={props.feeTier}
              />
            </div>

            <div className="lg:flex  mt-4">
              <PriceRangeV3
                tokenIn={props.tokenIn}
                tokenOut={props.tokenOut}
                isClearAll={isClearAll}
                selectedFeeTier={selectedFeeTier}
                isFullRange={isFullRange}
                setFullRange={setFullRangee}
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
                />
              </div>
            </div>
          </>
        ) : screen === ActivePopUp.Positions ? (
          <>
            <div className="flex gap-1 h-[32px] items-center">
              <Link href="/pools/v3">
                <p
                  className="cursor-pointer relative top-[3px]"
                  onClick={() => props.closeFn(false)}
                >
                  <Image alt={"alt"} src={arrowLeft} />
                </p>
              </Link>
              <p className="text-white">
                {props.activeState === ActiveLiquidity.Liquidity && "Manage liquidity"}
              </p>
              <p className="ml-1 relative ">
                <InfoIconToolTip
                  message={
                    "Create a new position or manage liquidity and collect fees for existing positions."
                  }
                />
              </p>
            </div>
            <PositionsPopup
              feeTier={props.feeTier}
              tokenIn={props.tokenA}
              tokenOut={props.tokenB}
              setScreen={setScreen}
              handleCollectFeeOperation={handleCollectFeeOperation}
            />
          </>
        ) : screen === ActivePopUp.ManageExisting ? (
          <div>
            <div className="flex items-center">
              <p
                className="cursor-pointer  relative top-[3px]"
                onClick={() => {
                  setFirstTokenAmountIncLiq("");
                  setSecondTokenAmountIncLiq("");
                  setScreen(ActivePopUp.Positions);
                }}
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
              selectedFeeTier={Number(selectedFeeTier)}
              activeStateIncDec={activeStateIncDec}
              firstTokenAmount={firstTokenAmountIncLiq}
              secondTokenAmount={secondTokenAmountIncLiq}
              tokenIn={props.tokenIn}
              setRemove={setRemove}
              removePercentage={removePercentage}
              setRemovePercentage={setRemovePercentage}
              remove={remove}
              tokenOut={props.tokenOut}
              setScreen={setScreen}
              setShow={setShowConfirm}
              userBalances={userBalances}
              setSecondTokenAmount={setSecondTokenAmountIncLiq}
              setFirstTokenAmount={setFirstTokenAmountIncLiq}
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
              selectedFeeTier={selectedFeeTier}
              tokenIn={props.tokenA}
              tokenOut={props.tokenB}
              tokenPrice={tokenPrice}
              slippage={slippage}
              handleAddLiquidityOperation={handleAddLiquidityOperation}
              topLevelSelectedToken={topLevelSelectedToken}
            />
          </>
        )}
      </div>
      <div
        className={clsx(
          screen === ActivePopUp.Positions || screen === ActivePopUp.NewPosition ? "" : "hidden",
          "flex justify-center items-center gap-3 text-center lg:w-[500px] lg:max-w-[500px] mt-5 mb-[60px] mx-auto"
        )}
      >
        Learn how to manage liquidity on V3{" "}
        <Image
          className="cursor-pointer hover:opacity-90"
          onClick={() => setShowVideoModal(true)}
          src={playBtn}
        />
      </div>
      {activeStateIncDec === ActiveIncDecState.Increase &&
        screen === ActivePopUp.ConfirmExisting && (
          <ConfirmIncreaseLiq
            setScreen={setScreen}
            tokenIn={props.tokenIn}
            tokenOut={props.tokenOut}
            addTokenA={firstTokenAmountIncLiq}
            addTokenB={secondTokenAmountIncLiq}
            show={showConfirm}
            setShow={setShowConfirm}
            handleClick={handleIncreaseLiquidityOperation}
          />
        )}
      {activeStateIncDec === ActiveIncDecState.Decrease &&
        screen === ActivePopUp.ConfirmExisting && (
          <ConfirmDecreaseLiq
            selectedPosition={selectedPosition}
            setScreen={setScreen}
            tokenIn={props.tokenIn}
            tokenOut={props.tokenOut}
            removeTokenA={remove.x}
            removeTokenB={remove.y}
            show={showConfirm}
            setShow={setShowConfirm}
            handleClick={handleRemoveLiquidityOperation}
          />
        )}
      {showVideoModal && <VideoModal closefn={setShowVideoModal} linkString={"lchYETZED_Y"} />}
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
          setShow={handleCloseTransactionSubmitted}
          onBtnClick={
            transactionId ? () => window.open(`${tzktExplorer}${transactionId}`, "_blank") : null
          }
          content={contentTransaction}
        />
      )}
    </>
  ) : null;
}
