import Image from "next/image";
import * as React from "react";

import infoBlue from "../../../../src/assets/icon/pools/InfoBlue.svg";
import violetNode from "../../../../src/assets/icon/common/violetNode.svg";

import greyNode from "../../../../src/assets/icon/common/greyNode.svg";
import vectorDown from "../../../assets/icon/common/vector.svg";

import add from "../../../../src/assets/icon/pools/addIcon.svg";
import { useMemo, useRef, useState, useEffect } from "react";

import { BigNumber } from "bignumber.js";
import Button from "../../Button/Button";

import wallet from "../../../../src/assets/icon/pools/wallet.svg";
import { AppDispatch, useAppSelector } from "../../../redux";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../../redux/wallet/wallet";

import { tokenParameterLiquidity } from "../../Liquidity/types";
import clsx from "clsx";
import { tokenType } from "../../../constants/swap";

import { getDexAddress } from "../../../api/util/fetchConfig";

import nFormatter, {
  changeSource,
  imageExists,
  tEZorCTEZtoUppercase,
} from "../../../api/util/helpers";
import { IAllTokensBalance } from "../../../api/util/types";
import { tokenIcons } from "../../../constants/tokensList";

import fromExponential from "from-exponential";
import FeeTierMainNewPool from "./FeeTierNewPool";

interface ILiquidityProps {
  setSelectedFeeTier: React.Dispatch<React.SetStateAction<string>>;
  selectedFeeTier: string;
  inputRef?: any;
  value?: string | "";
  onChange?: any;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  userBalances: IAllTokensBalance;
  setShowConfirmPool: React.Dispatch<React.SetStateAction<boolean>>;

  pair: string;
  priceAmount: string;
  setPriceAmount: React.Dispatch<React.SetStateAction<string>>;
  handleTokenType: (type: tokenType) => void;
  isLoading: boolean;
  setPair: React.Dispatch<React.SetStateAction<string>>;
  setShowLiquidityModal: (val: boolean) => void;
  showLiquidityModal: boolean;
  contractTokenBalance: IAllTokensBalance;
  setShowLiquidityModalPopup: React.Dispatch<React.SetStateAction<boolean>>;
  isExist: any;
}
export const Pair = {
  VOLATILE: "Volatile pair",
  STABLE: "Stable pair",
};
function NewPoolMain(props: ILiquidityProps) {
  const TOKEN = useAppSelector((state) => state.config.tokens);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };

  const [showNewPoolsManage, setShowNewPoolsManage] = useState<boolean>(false);

  const handleNewPoolsManagePopup = (val: boolean) => {
    setShowNewPoolsManage(val);
  };
  const [selectedToken, setSelectedToken] = useState({} as tokenParameterLiquidity);

  useEffect(() => {
    if (
      Object.prototype.hasOwnProperty.call(props.tokenIn, "symbol") &&
      Object.prototype.hasOwnProperty.call(props.tokenOut, "symbol")
    ) {
      setSelectedToken(props.tokenIn);
    }
  }, [props.tokenIn, props.tokenOut]);

  const AddButton = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button onClick={connectTempleWallet} color={"primary"}>
          Connect wallet
        </Button>
      );
    } else if (
      !props.tokenIn.name ||
      !props.tokenOut.name ||
      props.priceAmount === "" ||
      props.selectedFeeTier === ""
    ) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Create pool
        </Button>
      );
    } else if (walletAddress && props.pair === Pair.STABLE) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Enter the same amount for both tokens
        </Button>
      );
    } else if (walletAddress && false) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Insufficient balance
        </Button>
      );
    } else {
      return (
        <Button color={"primary"} onClick={() => props.setShowConfirmPool(true)}>
          Create pool
        </Button>
      );
    }
  }, [props.pair, props.tokenIn, props.tokenOut, props.userBalances, props]);

  const handleLiquidityInput = async (input: string | number) => {
    if (input == ".") {
      props.setPriceAmount("0.");

      return;
    }
    if (input === "" || isNaN(Number(input))) {
      props.setPriceAmount("");

      return;
    } else {
      props.setPriceAmount(input.toString());
    }
  };
  const handlechange = (value: string) => {
    if (value === "" || isNaN(Number(value))) {
      props.setPriceAmount("");
    } else {
      if (value == "0") {
        props.setPriceAmount("0");
      } else {
        props.setPriceAmount((1 / Number(value)).toString());
      }
    }
  };

  return (
    <>
      <div className="border rounded-2xl border-text-800 bg-card-200 px-[10px] md:px-3.5 pt-4 pb-4  mb-3">
        <>
          <div className=" relative gap-1.5 flex border-text-800/[0.5] rounded-2xl h-[89px]">
            <div
              className="w-[50%] rounded-l-2xl border items-center flex border-text-800/[0.5] hover:border-text-700 bg-card-300 hover:bg-blue-800 cursor-pointer"
              onClick={() => props.handleTokenType("tokenIn")}
            >
              <div className="ml-3 md:ml-5 ">
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
                  className=""
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
            <div className="absolute top-[38%] left-[47%] md:left-[48%]">
              <Image alt={"alt"} src={add} width={"24px"} height={"24px"} />
            </div>
            <div
              className="w-[50%] rounded-r-2xl border items-center flex border-text-800/[0.5] bg-card-300 hover:border-text-700 hover:bg-blue-800 cursor-pointer"
              onClick={() => props.handleTokenType("tokenOut")}
            >
              <div className="ml-5 md:ml-5 ">
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
                  className=""
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
          </div>

          <div
            className={clsx(
              "border  pl-4 pr-5 mt-[12px] bg-muted-200/[0.1] items-center flex  rounded-2xl h-[86px] hover:border-text-700",
              "border-text-800 "
            )}
          >
            <div className="w-0 flex-auto">
              <p>
                <span className="mt-2  font-body4 text-text-400">
                  INITIAL PRIZE{" "}
                  {selectedToken.symbol
                    ? `: 1 ${
                        selectedToken.symbol === props.tokenIn.symbol
                          ? tEZorCTEZtoUppercase(props.tokenIn.name)
                          : tEZorCTEZtoUppercase(props.tokenOut.symbol)
                      } =`
                    : null}
                </span>
              </p>
              <p className="flex items-center w-[90%]">
                <input
                  type="text"
                  style={{ width: (props.priceAmount.length + 6) * 10 + "px" }}
                  className={clsx(
                    "text-white bg-muted-200/[0.1] text-left border-0 ml-0 font-medium2  lg:font-medium1 outline-none   placeholder:text-text-500 "
                  )}
                  placeholder="0.0"
                  value={props.priceAmount ? props.priceAmount : ""}
                  onChange={(e) => handleLiquidityInput(e.target.value)}
                />
                {props.tokenIn.symbol && props.tokenOut.symbol && (
                  <div className="bg-muted-600 rounded-3xl px-2 py-1.5 flex ">
                    <img
                      src={
                        props.tokenOut.symbol && props.tokenIn.symbol
                          ? tokenIcons[
                              selectedToken.symbol === props.tokenIn.symbol
                                ? props.tokenOut.symbol
                                : props.tokenIn.symbol
                            ]
                            ? tokenIcons[
                                selectedToken.symbol === props.tokenIn.symbol
                                  ? props.tokenOut.symbol
                                  : props.tokenIn.symbol
                              ].src
                            : TOKEN[
                                selectedToken.symbol === props.tokenIn.symbol
                                  ? props.tokenOut.symbol.toString()
                                  : props.tokenIn.symbol.toString()
                              ]?.iconUrl
                            ? TOKEN[
                                selectedToken.symbol === props.tokenIn.symbol
                                  ? props.tokenOut.symbol.toString()
                                  : props.tokenIn.symbol.toString()
                              ].iconUrl
                            : `/assets/Tokens/fallback.png`
                          : `/assets/icon/emptyIcon.svg`
                      }
                      className=""
                      width={"16px"}
                      height={"16px"}
                      onError={changeSource}
                    />
                    <span className="ml-1 font-caption1 ">
                      {tEZorCTEZtoUppercase(
                        selectedToken.symbol === props.tokenIn.symbol
                          ? props.tokenOut.name
                          : props.tokenIn.symbol
                      )}
                    </span>
                  </div>
                )}{" "}
              </p>
            </div>
            {props.tokenIn.symbol && props.tokenOut.symbol && (
              <div>
                <div className="border border-text-800 rounded-lg	bg-info-900 h-[27px] p-[1px] cursor-pointer flex items-center w-fit ml-auto ">
                  <div
                    className={clsx(
                      selectedToken.symbol === props.tokenIn.symbol
                        ? "h-[23px] px-2  bg-shimmer-200 rounded-[6px]	"
                        : "text-text-250 px-2 hover:text-white",
                      "font-subtitle1223"
                    )}
                    onClick={() => {
                      handlechange(props.priceAmount);
                      setSelectedToken(props.tokenIn);
                    }}
                  >
                    {tEZorCTEZtoUppercase(props.tokenIn.symbol)}
                  </div>
                  <div
                    className={clsx(
                      selectedToken.symbol === props.tokenOut.symbol
                        ? "h-[23px] px-2  bg-shimmer-200 rounded-[6px]	"
                        : "text-text-250 px-2 hover:text-white",
                      "font-subtitle1223"
                    )}
                    onClick={() => {
                      handlechange(props.priceAmount);
                      setSelectedToken(props.tokenOut);
                    }}
                  >
                    {tEZorCTEZtoUppercase(props.tokenOut.symbol)}
                  </div>
                </div>
                <div className="font-body1 md:font-body3  text-text-600 mt-[5.5px]">
                  Select initial price token
                </div>
              </div>
            )}
          </div>
        </>
      </div>
      {props.tokenIn.symbol && props.tokenOut.symbol && (
        <FeeTierMainNewPool
          setSelectedFeeTier={props.setSelectedFeeTier}
          selectedFeeTier={props.selectedFeeTier}
          feeTier={""}
          isExist={props.isExist}
        />
      )}

      <div className="">{AddButton}</div>
    </>
  );
}

export default NewPoolMain;
