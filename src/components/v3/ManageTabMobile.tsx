import { BigNumber } from "bignumber.js";
import Image from "next/image";
import * as React from "react";
import { useEffect, useState } from "react";
import close from "../../assets/icon/swap/closeIcon.svg";
import { POOL_TYPE } from "../../../pages/pools";
import clock from "../../../src/assets/icon/poolsv3/settingsClock.svg";
import { getBalanceFromTzkt, getTezBalance } from "../../api/util/balance";
import { nFormatterWithLesserNumber, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { tzktExplorer } from "../../common/walletconnect";

import {
  FIRST_TOKEN_AMOUNT,
  SECOND_TOKEN_AMOUNT,
  TOKEN_A,
  TOKEN_B,
} from "../../constants/localStorage";
import { useAppDispatch, useAppSelector } from "../../redux";
import { setFlashMessage } from "../../redux/flashMessage";
import { setIsLoadingWallet } from "../../redux/walletLoading";

import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import ConfirmTransaction from "../ConfirmTransaction";
import { Flashtype } from "../FlashScreen";
import PositionsPopup from "./Positions";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { VideoModal } from "../Modal/videoModal";
import { ActiveLiquidity } from "../Pools/ManageLiquidityHeader";
import { InfoIconToolTip } from "../Tooltip/InfoIconTooltip";
import TransactionSubmitted from "../TransactionSubmitted";
import LiquidityV3 from "./LiquidityV3";
import PriceRangeV3 from "./PriceRange";
import clsx from "clsx";
import Button from "../Button/Button";
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
import FeeTierMain from "./FeeTierMain";
import { isTablet } from "react-device-detect";
import IncreaseDecreaseLiqMain from "./IncreaseDecreaseliqMain";
import { ActiveIncDecState, ActivePopUp } from "./ManageTabV3";
import ConfirmIncreaseLiq from "./Confirmaddliq";
import ConfirmDecreaseLiq from "./Confirmremoveliq";
import {
  increaseLiquidity,
  LiquidityOperation,
  removeLiquidity,
} from "../../operations/v3/liquidity";
import TransactionSettingsV3 from "./TransactionSettingv3";
import { calculateCurrentPrice, getInitialBoundaries } from "../../api/v3/liquidity";
import { BalanceNat } from "../../api/v3/types";
import { collectFees } from "../../operations/v3/fee";

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

export function ManageTabMobile(props: IManageLiquidityProps) {
  const [activeStateIncDec, setActiveStateIncDec] = React.useState<ActiveIncDecState | string>(
    ActiveIncDecState.Increase
  );

  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [removePercentage, setRemovePercentage] = useState(25);
  const [slippage, setSlippage] = useState(30);
  const TOKEN = useAppSelector((state) => state.config.tokens);
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const [firstTokenAmountIncLiq, setFirstTokenAmountIncLiq] = React.useState<string | number>("");
  const [secondTokenAmountIncLiq, setSecondTokenAmountIncLiq] = React.useState<number | string>("");
  const [screen, setScreen] = React.useState(ActivePopUp.Positions);
  const [firstTokenAmountLiq, setFirstTokenAmountLiq] = React.useState<string | number>("");
  const [secondTokenAmountLiq, setSecondTokenAmountLiq] = React.useState<number | string>("");

  const [isAddLiquidity, setIsAddLiquidity] = useState(true);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const selectedPosition = useAppSelector((state) => state.poolsv3.selectedPosition);
  const [showConfirm, setShowConfirm] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const dispatch = useAppDispatch();
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };

  const [remove, setRemove] = useState({} as BalanceNat);
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);

  const [contentTransaction, setContentTransaction] = useState("");
  const minTickA = useAppSelector((state) => state.poolsv3.minTickA);
  const maxTickA = useAppSelector((state) => state.poolsv3.maxTickA);
  const minTickB = useAppSelector((state) => state.poolsv3.minTickB);
  const maxTickB = useAppSelector((state) => state.poolsv3.maxTickB);
  const tokeninorg = useAppSelector((state) => state.poolsv3.tokenInOrg);
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

  const [selectedFeeTier, setSelectedFeeTier] = useState(props.feeTier);
  const [isClearAll, setisClearAll] = useState(false);
  const resetAllValues = () => {
    setisClearAll(true);
    setFirstTokenAmountIncLiq("");
    setSecondTokenAmountIncLiq("");
    setRemove({} as BalanceNat);
    setFirstTokenAmountLiq("");
    setSecondTokenAmountLiq("");
    dispatch(settopLevelSelectedToken(props.tokenA));
    dispatch(setFullRange(false));
    setBalanceUpdate(false);
    setTimeout(() => {
      setisClearAll(false);
    }, 4000);
  };
  // const [deadline, setDeadline] = useState(0);
  // useEffect(() => {
  //   const n = slippage === 1 ? 60 : slippage === 2 ? 120 : Number(slippage);

  //   setDeadline(Math.floor(new Date().getTime() / 1000) + n * 60);
  // }, [slippage]);
  const handleAddLiquidityOperation = () => {
    setContentTransaction(
      `Mint Position ${nFormatterWithLesserNumber(
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
      "minTickA",
      minTickA,
      "maxTickA",
      maxTickA,
      "minTickB",
      minTickB,
      "maxTickB",
      maxTickB
    );
    console.log(
      "parameters",
      walletAddress,
      minTickA,
      maxTickA,
      minTickB,
      maxTickB,
      "ll",
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
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Mint Position ${localStorage.getItem(
          FIRST_TOKEN_AMOUNT
        )} ${localStorage.getItem(TOKEN_A)} / ${localStorage.getItem(
          SECOND_TOKEN_AMOUNT
        )} ${localStorage.getItem(TOKEN_B)}`,
        linkText: "View in Explorer",
        isLoading: true,
        transactionId: "",
      },
      Number(selectedFeeTier)
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
              trailingText: `Mint Position ${localStorage.getItem(
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
    } else if (Number(firstTokenAmountLiq) <= 0 || Number(secondTokenAmountLiq) <= 0) {
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
  }, [props, firstTokenAmountLiq, secondTokenAmountLiq]);
  const [selectedToken, setSelectedToken] = useState({} as tokenParameterLiquidity);
  useEffect(() => {
    setSelectedToken(props.tokenIn);
  }, []);
  useEffect(() => {
    dispatch(settopLevelSelectedToken(selectedToken));
  }, [selectedToken]);
  const [isFullRange, setFullRangee] = React.useState(false);
  const full = useAppSelector((state) => state.poolsv3.isFullRange);
  React.useEffect(() => {
    if (!isFullRange) {
      dispatch(setIsLoading(true));

      calculateCurrentPrice(
        props.tokenA.symbol,
        props.tokenB.symbol,
        props.tokenA.symbol,
        Number(selectedFeeTier)
      ).then((response) => {
        dispatch(setcurrentPrice(response.toFixed(6)));
      });
      calculateCurrentPrice(
        props.tokenA.symbol,
        props.tokenB.symbol,
        props.tokenB.symbol,
        Number(selectedFeeTier)
      ).then((response) => {
        dispatch(setBcurrentPrice(response.toFixed(6)));
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
            dispatch(setleftRangeInput(response.minValue.toFixed(6)));

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
    }
  }, [isFullRange, full]);
  const handleIncreaseLiquidityOperation = () => {
    setContentTransaction(
      `Increase Liquidity ${nFormatterWithLesserNumber(
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
    setScreen(ActivePopUp.ManageExisting);
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
      `Remove Liquidity ${nFormatterWithLesserNumber(remove.x)} ${tEZorCTEZtoUppercase(
        props.tokenA.name
      )} / ${nFormatterWithLesserNumber(remove.y)} ${tEZorCTEZtoUppercase(props.tokenB.name)} `
    );
    localStorage.setItem(TOKEN_A, tEZorCTEZtoUppercase(props.tokenA.name));
    localStorage.setItem(TOKEN_B, tEZorCTEZtoUppercase(props.tokenB.name));
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
      props.tokenA.symbol,
      props.tokenB.symbol,
      Number(selectedFeeTier),
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Remove Liquidity ${localStorage.getItem(
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
              trailingText: `Remove Liquidity ${localStorage.getItem(
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
              trailingText: `Remove Liquidity ${localStorage.getItem(
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

  const handleCollectFeeOperation = () => {
    setContentTransaction(`Collecting fee`);

    setShowConfirmTransaction(true);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));

    collectFees(
      selectedPosition,
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
        linkText: "View in Explorer",
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
  return true ? (
    <>
      <div
        id="modal_outer"
        className={clsx(
          true &&
            "z-index-max fixed top-[106px] left-0 flex flex-col gap-2 w-screen h-[81vh]  z-50 items-center justify-center topNavblurEffect overflow-y-auto swap"
        )}
      >
        <div
          className={clsx(
            screen === ActivePopUp.Positions
              ? "lg:w-[880px] lg:max-w-[880px] "
              : screen === ActivePopUp.ConfirmAddV3
              ? "lg:w-[602px] lg:max-w-[602px] md:w-[600px] md:max-w-[600px]"
              : "lg:w-[972px] lg:max-w-[972px] mt-[32px] md:w-[600px] md:max-w-[600px]",
            " w-screen   rounded-none sm:rounded-3xl   border-popUpNotification    bg-sideBar   border px-3 py-5 overflow-x-hidden"
          )}
        >
          {screen === ActivePopUp.NewPosition ? (
            <>
              <div className="flex gap-1 items-center">
                <p
                  className="cursor-pointer relative top-0.5"
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
              <div className="flex border-t border-text-800 pt-2.5 mt-[18px] items-center">
                <p className="ml-auto text-primary-500 font-subtitle1 ml-auto mr-5 cursor-pointer">
                  Clear all
                </p>
                <div className="flex items-center justify-between flex-row  relative mr-[8px]">
                  <div
                    ref={refSettingTab}
                    className="py-1  px-2 h-8 border border-text-700 cursor-pointer rounded-[12px] "
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

                <div className="border border-text-800 rounded-lg	bg-info-900 h-[27px] p-[1px] cursor-pointer flex items-center w-fit  mr-4">
                  <div
                    className={clsx(
                      selectedToken.symbol === props.tokenA.symbol
                        ? "h-[23px] px-2  bg-shimmer-200 rounded-lg	"
                        : "text-text-250 px-2",
                      "font-subtitle1223"
                    )}
                    onClick={() => setSelectedToken(props.tokenA)}
                  >
                    {tEZorCTEZtoUppercase(props.tokenA.symbol)}
                  </div>
                  <div
                    className={clsx(
                      selectedToken.symbol === props.tokenB.symbol
                        ? "h-[23px] px-2  bg-shimmer-200 rounded-lg	"
                        : "text-text-250 px-2",
                      "font-subtitle1223"
                    )}
                    onClick={() => setSelectedToken(props.tokenB)}
                  >
                    {tEZorCTEZtoUppercase(props.tokenB.symbol)}
                  </div>
                </div>
              </div>
              <div className="mx-auto mt-4 lg:flex">
                {!isTablet && (
                  <FeeTierMain
                    setSelectedFeeTier={setSelectedFeeTier}
                    selectedFeeTier={selectedFeeTier}
                    feeTier={props.feeTier}
                  />
                )}
                <PriceRangeV3
                  tokenIn={props.tokenIn}
                  tokenOut={props.tokenOut}
                  isClearAll={isClearAll}
                  selectedFeeTier={selectedFeeTier}
                  isFullRange={isFullRange}
                  setFullRange={setFullRangee}
                />
                <div className="mt-3">
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
              <div className="flex gap-1">
                <p className="text-white">
                  {props.activeState === ActiveLiquidity.Liquidity && "Manage liquidity"}
                </p>
                <p className="ml-1 relative top-[6px]">
                  <InfoIconToolTip message={"Add or remove liquidity from the selected pool."} />
                </p>
                <p className="ml-auto" onClick={closeModal}>
                  <Image alt={"alt"} src={close} />
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
                selectedFeeTier={Number(selectedFeeTier)}
                setActiveStateIncDec={setActiveStateIncDec}
                activeStateIncDec={activeStateIncDec}
                firstTokenAmount={firstTokenAmountIncLiq}
                secondTokenAmount={secondTokenAmountIncLiq}
                tokenIn={props.tokenA}
                tokenOut={props.tokenB}
                setRemove={setRemove}
                removePercentage={removePercentage}
                setRemovePercentage={setRemovePercentage}
                remove={remove}
                setScreen={setScreen}
                setShow={setShowConfirm}
                userBalances={userBalances}
                setSecondTokenAmount={setSecondTokenAmountIncLiq}
                setFirstTokenAmount={setFirstTokenAmountIncLiq}
              />
            </div>
          ) : null}
          {screen === ActivePopUp.NewPosition && <div className="mt-2">{AddButton}</div>}
          {props.activeState === ActiveLiquidity.Liquidity &&
            screen === ActivePopUp.ConfirmAddV3 && (
              <>
                <ConfirmAddLiquidityv3
                  setScreen={setScreen}
                  firstTokenAmount={firstTokenAmountLiq}
                  secondTokenAmount={secondTokenAmountLiq}
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
