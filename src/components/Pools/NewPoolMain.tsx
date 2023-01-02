import Image from "next/image";
import * as React from "react";
import settings from "../../../src/assets/icon/swap/settings.svg";

import infoBlue from "../../../src/assets/icon/pools/InfoBlue.svg";
import violetNode from "../../../src/assets/icon/common/violetNode.svg";
import empty from "../../../src/assets/icon/pools/emptyIcon.svg";
import greyNode from "../../../src/assets/icon/common/greyNode.svg";
import vectorDown from "../../assets/icon/common/vector.svg";

import add from "../../../src/assets/icon/pools/addIcon.svg";
import { useMemo, useRef, useState, useEffect } from "react";

import info from "../../../src/assets/icon/swap/info.svg";
import { BigNumber } from "bignumber.js";
import Button from "../Button/Button";

import wallet from "../../../src/assets/icon/pools/wallet.svg";
import { AppDispatch, useAppSelector } from "../../redux";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";

import { tokenParameterLiquidity } from "../Liquidity/types";
import clsx from "clsx";
import { tokenType } from "../../constants/swap";

import { getDexAddress } from "../../api/util/fetchConfig";
import { ManageLiquidity } from "./ManageLiquidity";
import { ActiveLiquidity } from "./ManageLiquidityHeader";
import nFormatter, {
  changeSource,
  imageExists,
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";
import { IAllTokensBalance } from "../../api/util/types";
import { tokenIcons } from "../../constants/tokensList";

interface ILiquidityProps {
  firstTokenAmount: string | number;
  secondTokenAmount: string | number;
  setFirstTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  setSecondTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  inputRef?: any;
  value?: string | "";
  onChange?: any;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  userBalances: IAllTokensBalance;
  setShowConfirmPool: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  isAddLiquidity: boolean;
  pnlpBalance: string;
  setBurnAmount: React.Dispatch<React.SetStateAction<string | number>>;
  burnAmount: string | number;
  setRemoveTokenAmount: React.Dispatch<
    React.SetStateAction<{
      tokenOneAmount: string;
      tokenTwoAmount: string;
    }>
  >;
  removeTokenAmount: {
    tokenOneAmount: string;
    tokenTwoAmount: string;
  };
  pair: string;
  setSlippage: React.Dispatch<React.SetStateAction<string>>;
  slippage: string;
  handleTokenType: (type: tokenType) => void;
  isLoading: boolean;
  setPair: React.Dispatch<React.SetStateAction<string>>;
  setShowLiquidityModal: (val: boolean) => void;
  showLiquidityModal: boolean;
  contractTokenBalance: IAllTokensBalance;
}
export const Pair = {
  VOLATILE: "Volatile pair",
  STABLE: "Stable pair",
};
function NewPoolMain(props: ILiquidityProps) {
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const amm = useAppSelector((state) => state.config.AMMs);
  const TOKEN = useAppSelector((state) => state.config.tokens);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  const [activeState, setActiveState] = React.useState<ActiveLiquidity | string>(
    ActiveLiquidity.Liquidity
  );
  const [isExist, setIsExist] = useState(false);
  const [isGauge, setIsGauge] = useState(false);
  useEffect(() => {
    if (
      Object.prototype.hasOwnProperty.call(props.tokenIn, "symbol") &&
      Object.prototype.hasOwnProperty.call(props.tokenOut, "symbol")
    ) {
      const res = getDexAddress(props.tokenIn.symbol, props.tokenOut.symbol);

      if (res !== "false") {
        setIsExist(true);
        if (amm[res]?.gauge !== undefined) {
          setIsGauge(true);
        } else {
          setIsGauge(false);
        }
      } else {
        setIsExist(false);
        setIsGauge(false);
      }
    }
  }, [props.tokenIn, props.tokenOut]);

  const AddButton = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button onClick={connectTempleWallet} color={"primary"}>
          Connect Wallet
        </Button>
      );
    } else if (
      !props.tokenIn.name ||
      !props.tokenOut.name ||
      Number(props.firstTokenAmount) <= 0 ||
      Number(props.secondTokenAmount) <= 0 ||
      props.pair === "" ||
      isExist
    ) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Create pool
        </Button>
      );
    } else if (
      walletAddress &&
      props.pair === Pair.STABLE &&
      props.firstTokenAmount &&
      props.secondTokenAmount &&
      props.firstTokenAmount !== props.secondTokenAmount
    ) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Enter the same amount for both tokens
        </Button>
      );
    } else if (
      walletAddress &&
      ((props.firstTokenAmount &&
        props.firstTokenAmount > Number(props.userBalances[props.tokenIn.name]?.balance)) ||
        (props.secondTokenAmount && props.secondTokenAmount) >
          Number(props.userBalances[props.tokenOut.name]?.balance))
    ) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Insufficient Balance
        </Button>
      );
    } else {
      return (
        <Button color={"primary"} onClick={() => props.setShowConfirmPool(true)}>
          Create pool
        </Button>
      );
    }
  }, [
    props.pair,
    props.tokenIn,
    props.tokenOut,
    props.firstTokenAmount,
    props.secondTokenAmount,
    props.userBalances,
    isExist,
  ]);

  const handleLiquidityInput = async (
    input: string | number,
    tokenType: "tokenIn" | "tokenOut"
  ) => {
    if (input == ".") {
      props.setSecondTokenAmount("0.");
      props.setFirstTokenAmount("0.");
      return;
    }
    if (input === "" || isNaN(Number(input))) {
      if (tokenType === "tokenIn") {
        props.setFirstTokenAmount("");
      } else if (tokenType === "tokenOut") {
        props.setSecondTokenAmount("");
      }

      return;
    } else if (tokenType === "tokenIn") {
      const decimal = new BigNumber(input).decimalPlaces();

      props.setFirstTokenAmount(input);
    } else if (tokenType === "tokenOut") {
      const decimal = new BigNumber(input).decimalPlaces();

      props.setSecondTokenAmount(input);
    }
  };
  const onClickAmount = () => {
    props.tokenIn.name === "tez"
      ? handleLiquidityInput(
          Number(props.userBalances[props.tokenIn.name]?.balance) - 0.02,
          "tokenIn"
        )
      : handleLiquidityInput(props.userBalances[props.tokenIn.name]?.balance.toNumber(), "tokenIn");
  };

  const onClickSecondAmount = () => {
    props.tokenOut.name === "tez"
      ? handleLiquidityInput(
          Number(props.userBalances[props.tokenOut.name]?.balance) - 0.02,
          "tokenOut"
        )
      : handleLiquidityInput(
          props.userBalances[props.tokenOut.name]?.balance.toNumber(),
          "tokenOut"
        );
  };

  return (
    <>
      <div className="border rounded-2xl border-text-800 bg-card-200 px-[10px] md:px-3.5 pt-4 pb-4  mb-3">
        <>
          <div className="border  flex border-text-800/[0.5] rounded-2xl h-[88px]">
            <div
              className="w-[50%] rounded-l-2xl border-r items-center flex border-text-800/[0.5] bg-card-300 cursor-pointer"
              onClick={() => props.handleTokenType("tokenIn")}
            >
              <div className="ml-2 md:ml-5 -mb-1">
                <img
                  src={
                    props.tokenIn.image
                      ? tokenIcons[props.tokenIn.name]
                        ? tokenIcons[props.tokenIn.name].src
                        : TOKEN[props.tokenIn.name.toString()]?.iconUrl
                        ? TOKEN[props.tokenIn.name.toString()].iconUrl
                        : `/assets/Tokens/fallback.png`
                      : `/assets/icon/emptyIcon.svg`
                  }
                  className="tokenIconLiq"
                  width={"42px"}
                  height={"42px"}
                  onError={changeSource}
                />
              </div>
              <div className="ml-1 md:ml-2">
                <p className="text-text-900 font-body2">Input</p>
                <p className="font-caption1 md:font-title2 text-white">
                  {props.tokenIn.name ? tEZorCTEZtoUppercase(props.tokenIn.name) : "Select"}
                  <span className="relative ml-2 -top-[1.5px]">
                    <Image alt={"alt"} className="rotate-180" src={vectorDown} />
                  </span>
                </p>
              </div>
            </div>
            <div className="pl-[10px] md:pl-[25px] w-[100%] pr-2 md:pr-[18px] items-center  flex bg-muted-200/[0.1]">
              <div className="w-0 flex-auto">
                <p>
                  {false ? (
                    <p className=" my-[4px] w-[100px] h-[28px] md:h-[32px] rounded animate-pulse bg-shimmer-100"></p>
                  ) : (
                    <input
                      type="text"
                      className="text-white bg-muted-200/[0.1] text-left border-0 font-input-text  md:font-medium1 outline-none w-[100%] placeholder:text-text-400"
                      value={props.firstTokenAmount}
                      placeholder="0.0"
                      onChange={(e) => handleLiquidityInput(e.target.value, "tokenIn")}
                    />
                  )}
                </p>
                <p>
                  <span className="mt-2 ml-1 font-body2 md:font-body4 text-text-400">
                    {" "}
                    ~$
                    {props.firstTokenAmount && tokenPrice[props.tokenIn.name]
                      ? Number(
                          Number(props.firstTokenAmount) * Number(tokenPrice[props.tokenIn.name])
                        ).toFixed(2)
                      : "0.00"}
                  </span>
                </p>
              </div>
              {walletAddress && props.tokenIn.name && (
                <div className=" border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[36px] md:h-[48px] items-center flex px-2 md:px-3 ml-auto">
                  <div className="relative top-0.5 md:top-0">
                    <Image alt={"alt"} src={wallet} className="walletIcon" />
                  </div>
                  <div
                    className="ml-1 flex cursor-pointer text-primary-500 font-caption1-small md:font-body2"
                    onClick={onClickAmount}
                  >
                    {!(
                      Number(props.userBalances[props.tokenIn.name]?.balance) >= 0 ||
                      Number(props.contractTokenBalance[props.tokenIn.name]?.balance) >= 0
                    ) ? (
                      <p className=" w-8 mr-2  h-[16px] rounded animate-pulse bg-shimmer-100"></p>
                    ) : (
                      <span className="mr-1">
                        {Number(props.userBalances[props.tokenIn.name]?.balance) > 0
                          ? new BigNumber(
                              props.userBalances[props.tokenIn.name]?.balance
                            ).isLessThan(0.01)
                            ? "<0.01"
                            : nFormatter(
                                new BigNumber(props.userBalances[props.tokenIn.name]?.balance)
                              )
                          : props.contractTokenBalance[props.tokenIn.name]
                          ? Number(props.contractTokenBalance[props.tokenIn.name]?.balance) > 0
                            ? new BigNumber(
                                props.contractTokenBalance[props.tokenIn.name]?.balance
                              ).isLessThan(0.01)
                              ? "<0.01"
                              : nFormatter(
                                  new BigNumber(
                                    props.contractTokenBalance[props.tokenIn.name]?.balance
                                  )
                                )
                            : "0.0"
                          : "0.0"}{" "}
                      </span>
                    )}
                    {tEZorCTEZtoUppercase(props.tokenIn.name)}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="relative -top-[9px] left-[95px] md:left-[162.5px]">
            <Image alt={"alt"} src={add} width={"24px"} height={"24px"} />
          </div>
          <div className="border -mt-[25px] flex border-text-800/[0.5] rounded-2xl h-[88px]">
            <div
              className="w-[50%] rounded-l-2xl border-r items-center flex border-text-800/[0.5] bg-card-300 cursor-pointer"
              onClick={() => props.handleTokenType("tokenOut")}
            >
              <div className="ml-2 md:ml-5 -mb-1">
                <img
                  src={
                    props.tokenOut.image
                      ? tokenIcons[props.tokenOut.name]
                        ? tokenIcons[props.tokenOut.name].src
                        : TOKEN[props.tokenOut.name.toString()]?.iconUrl
                        ? TOKEN[props.tokenOut.name.toString()].iconUrl
                        : `/assets/Tokens/fallback.png`
                      : `/assets/icon/emptyIcon.svg`
                  }
                  className="tokenIconLiq"
                  width={"42px"}
                  height={"42px"}
                  onError={changeSource}
                />
              </div>
              <div className="ml-1 md:ml-2">
                <p className="text-text-900 font-body2">Input</p>
                <p className="font-caption1 md:font-title2 text-white">
                  {props.tokenOut.name ? tEZorCTEZtoUppercase(props.tokenOut.name) : "Select"}
                  <span className="relative ml-2 -top-[1.5px]">
                    <Image alt={"alt"} className="rotate-180" src={vectorDown} />
                  </span>
                </p>
              </div>
            </div>
            <div className="pl-[10px] md:pl-[25px] w-[100%] pr-2 md:pr-[18px] items-center  flex bg-muted-200/[0.1]">
              <div className="w-0 flex-auto">
                <p>
                  {false ? (
                    <p className=" my-[4px] w-[100px] h-[28px] md:h-[32px] rounded animate-pulse bg-shimmer-100"></p>
                  ) : (
                    <input
                      type="text"
                      value={props.secondTokenAmount}
                      className="text-white bg-muted-200/[0.1] text-left border-0 font-input-text  md:font-medium1 outline-none w-[100%] placeholder:text-text-400"
                      placeholder="0.0"
                      onChange={(e) => handleLiquidityInput(e.target.value, "tokenOut")}
                    />
                  )}
                </p>
                <p>
                  <span className="mt-2 ml-1 font-body2 md:font-body4 text-text-400">
                    ~$
                    {props.secondTokenAmount && tokenPrice[props.tokenOut.name]
                      ? Number(
                          Number(props.secondTokenAmount) * Number(tokenPrice[props.tokenOut.name])
                        ).toFixed(2)
                      : "0.00"}
                  </span>
                </p>
              </div>
              {walletAddress && props.tokenOut.name && (
                <div className="ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[36px] md:h-[48px] items-center flex px-2 md:px-3">
                  <div className="relative top-0.5 md:top-0">
                    <Image alt={"alt"} src={wallet} className="walletIcon" />
                  </div>
                  <div
                    className="ml-1 cursor-pointer flex text-primary-500  font-caption1-small md:font-body2"
                    onClick={onClickSecondAmount}
                  >
                    {!(
                      Number(props.userBalances[props.tokenOut.name]?.balance) >= 0 ||
                      Number(props.contractTokenBalance[props.tokenOut.name]?.balance) >= 0
                    ) ? (
                      <p className=" w-6 mr-2  h-[16px] rounded animate-pulse bg-shimmer-100"></p>
                    ) : (
                      <span className="mr-1">
                        {Number(props.userBalances[props.tokenOut.name]?.balance) > 0
                          ? new BigNumber(
                              props.userBalances[props.tokenOut.name]?.balance
                            ).isLessThan(0.01)
                            ? "<0.01"
                            : nFormatter(
                                new BigNumber(props.userBalances[props.tokenOut.name]?.balance)
                              )
                          : props.contractTokenBalance[props.tokenOut.name]
                          ? Number(props.contractTokenBalance[props.tokenOut.name]?.balance) > 0
                            ? new BigNumber(
                                props.contractTokenBalance[props.tokenOut.name]?.balance
                              ).isLessThan(0.01)
                              ? "<0.01"
                              : nFormatter(
                                  new BigNumber(
                                    props.contractTokenBalance[props.tokenOut.name]?.balance
                                  )
                                )
                            : "0.0"
                          : "0.0"}{" "}
                      </span>
                    )}
                    {tEZorCTEZtoUppercase(props.tokenOut.name)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      </div>
      <div className="flex gap-2 mb-5">
        <div
          onClick={() => props.setPair(Pair.STABLE)}
          className={clsx(
            "  px-4 border w-full flex items-center h-[54px] z-10 cursor-pointer font-body4 rounded-2xl ",
            props.pair === Pair.STABLE
              ? "bg-muted-500 border-primary-500  text-primary-500"
              : "text-text-700 bg-card-500 border-text-800"
          )}
        >
          {props.pair === Pair.STABLE ? (
            <Image src={violetNode} height={"20px"} width={"20px"} />
          ) : (
            <Image src={greyNode} height={"20px"} width={"20px"} />
          )}
          <span className="ml-4">Stable pair</span>
        </div>
        <div
          onClick={() => props.setPair(Pair.VOLATILE)}
          className={clsx(
            "  px-4 border w-full flex items-center h-[54px] z-10 cursor-pointer font-body4 rounded-2xl ",
            props.pair === Pair.VOLATILE
              ? "bg-muted-500 border-primary-500  text-primary-500"
              : "text-text-700 bg-card-500 border-text-800"
          )}
        >
          {props.pair === Pair.VOLATILE ? (
            <Image src={violetNode} height={"20px"} width={"20px"} />
          ) : (
            <Image src={greyNode} height={"20px"} width={"20px"} />
          )}
          <span className="ml-4">Volatile pair</span>
        </div>
      </div>
      {isExist && (
        <div className="h-[46px]  px-2 rounded-lg my-3 flex items-center bg-info-500/[0.1]">
          <p className="relative top-0.5">
            <Image src={infoBlue} />
          </p>
          <p className="font-body2 text-info-500 px-3 md:w-auto w-[249px]">
            {isGauge
              ? "There is already a pool and gauge for the tokens selected."
              : " There is already a pool for the tokens selected."}
          </p>
          <p
            className="ml-auto relative top-[0px] bg-info-500/[0.1] text-info-500 cursor-pointer font-body2 rounded-[6px] px-3 py-2 h-[34px]"
            onClick={() => props.setShowLiquidityModal(true)}
          >
            Manage
          </p>
        </div>
      )}
      <div className="">{AddButton}</div>
      {props.showLiquidityModal && (
        <ManageLiquidity
          tokenIn={props.tokenIn}
          tokenOut={props.tokenOut}
          closeFn={props.setShowLiquidityModal}
          showLiquidityModal={props.showLiquidityModal}
          setActiveState={setActiveState}
          activeState={activeState}
          isGaugeAvailable={isExist && isGauge}
        />
      )}
    </>
  );
}

export default NewPoolMain;
