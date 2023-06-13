import infoOrange from "../../../src/assets/icon/poolsv3/infoOrange.svg";
import infoGreen from "../../../src/assets/icon/poolsv3/infoGreen.svg";
import { tokenIcons } from "../../constants/tokensList";
import { ISwapData, tokenParameterLiquidity } from "../Liquidity/types";

import info from "../../../src/assets/icon/common/infoIcon.svg";
import clsx from "clsx";
import nFormatter, {
  changeSource,
  imageExists,
  nFormatterWithLesserNumber,
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";
import { useMemo, useState } from "react";
import Image from "next/image";
import { BigNumber } from "bignumber.js";
import { AppDispatch, useAppSelector } from "../../redux";
import AddLiquidityV3 from "./AddliquidityV3";
import Button from "../Button/Button";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { RangeSliderDecLiq } from "./RangeSliderDecrease";
import { ActivePopUp } from "./ManageTabV3";

interface IDecLiquidityProp {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  firstTokenAmount: string | number;
  secondTokenAmount: string | number;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;
  tokenPrice: {
    [id: string]: number;
  };
  pnlpEstimates: string;
  sharePool: string;

  setFirstTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  setSecondTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  swapData: ISwapData;
  userBalances: {
    [key: string]: string;
  };
}
export default function DecreaseLiq(props: IDecLiquidityProp) {
  const [selectedToken, setSelectedToken] = useState(props.tokenIn);
  const tokens = useAppSelector((state) => state.config.tokens);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  enum DecreasePercentage {
    TWENTYFIVE = "25%",
    FIFTY = "50%",
    SEVEENTYFIVE = "75%",
    HUNDRED = "100%",
  }
  const [selectedPercentage, setSelectedPercentage] = useState(DecreasePercentage.TWENTYFIVE);
  const [removePercentage, setRemovePercentage] = useState(25);

  const DecreaseButton = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button onClick={connectTempleWallet} color={"primary"}>
          Connect wallet
        </Button>
      );
    } else if (Number(props.firstTokenAmount) <= 0 || Number(props.secondTokenAmount) <= 0) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Remove
        </Button>
      );
    } else if (
      walletAddress &&
      ((props.firstTokenAmount &&
        props.firstTokenAmount > Number(props.userBalances[props.tokenIn.name])) ||
        (props.secondTokenAmount && props.secondTokenAmount) >
          Number(props.userBalances[props.tokenOut.name]))
    ) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Insufficient balance
        </Button>
      );
    } else {
      return (
        <Button
          color={"primary"}
          onClick={() => {
            props.setScreen(ActivePopUp.ConfirmExisting);
          }}
        >
          Remove
        </Button>
      );
    }
  }, [props]);
  return (
    <>
      <div className="border border-text-800 bg-card-200 rounded-2xl	py-5 px-4 mt-5">
        <div className="flex gap-1 font-title3">
          Amount
          <div className="relative top-[2px]  cursor-pointer">
            <ToolTip
              id="tooltip2"
              disable={false}
              position={Position.top}
              toolTipChild={<div className="w-[100px] md:w-[150px]">Instructions for airdrop</div>}
            >
              <Image alt={"alt"} src={info} />
            </ToolTip>
          </div>
        </div>
        <div className="mt-[18px] flex gap-2 items-center mb-[40px]">
          <div className="font-f40-600 mr-[28px] w-[100px]">{removePercentage}%</div>
          <div
            className={clsx(
              selectedPercentage === DecreasePercentage.TWENTYFIVE
                ? "bg-primary-500 text-black"
                : "bg-muted-235 text-text-500",
              "cursor-pointer w-[91px] h-[36px] rounded-lg	text-center font-body4  py-2"
            )}
            onClick={() => setSelectedPercentage(DecreasePercentage.TWENTYFIVE)}
          >
            {DecreasePercentage.TWENTYFIVE}
          </div>
          <div
            className={clsx(
              selectedPercentage === DecreasePercentage.FIFTY
                ? "bg-primary-500 text-black"
                : "bg-muted-235 text-text-500 ",
              "cursor-pointer w-[91px] h-[36px] rounded-lg font-body4	 text-center py-2"
            )}
            onClick={() => setSelectedPercentage(DecreasePercentage.FIFTY)}
          >
            {DecreasePercentage.FIFTY}
          </div>
          <div
            className={clsx(
              selectedPercentage === DecreasePercentage.SEVEENTYFIVE
                ? "bg-primary-500 text-black"
                : "bg-muted-235 text-text-500",
              "cursor-pointer w-[91px] h-[36px] rounded-lg	font-body4 text-center py-2"
            )}
            onClick={() => setSelectedPercentage(DecreasePercentage.SEVEENTYFIVE)}
          >
            {DecreasePercentage.SEVEENTYFIVE}
          </div>
          <div
            className={clsx(
              selectedPercentage === DecreasePercentage.HUNDRED
                ? "bg-primary-500 text-black"
                : "bg-muted-235 text-text-500",
              "cursor-pointer w-[91px] h-[36px] rounded-lg	font-body4  text-center py-2"
            )}
            onClick={() => setSelectedPercentage(DecreasePercentage.HUNDRED)}
          >
            {DecreasePercentage.HUNDRED}
          </div>
        </div>
        <RangeSliderDecLiq
          decreaseValue={removePercentage}
          setRemovePercentage={setRemovePercentage}
        />
      </div>
      <div className="border border-text-800 bg-card-200 rounded-2xl	py-5  mt-3">
        <div className="bg-card-500">
          <div className="border-t border-text-800/[0.5] mb-3"></div>
          <div className="flex px-5">
            <p className="font-body4 text-text-400">
              Pooled {tEZorCTEZtoUppercase(props.tokenIn.symbol)}
            </p>
            <p className="ml-auto flex gap-2 items-center">
              <span className="font-body4">12.7644</span>
              <span className="font-body4">{tEZorCTEZtoUppercase(props.tokenIn.symbol)}</span>
              <span>
                {" "}
                <img
                  alt={"alt"}
                  src={
                    tokenIcons[props.tokenIn.symbol]
                      ? tokenIcons[props.tokenIn.symbol].src
                      : tokens[props.tokenIn.symbol.toString()]?.iconUrl
                      ? tokens[props.tokenIn.symbol.toString()].iconUrl
                      : `/assets/Tokens/fallback.png`
                  }
                  width={"24px"}
                  height={"24px"}
                  onError={changeSource}
                />
              </span>
            </p>
          </div>

          <div className="flex px-5 my-3">
            <p className="font-body4 text-text-400">
              Pooled {tEZorCTEZtoUppercase(props.tokenOut.symbol)}
            </p>
            <p className="ml-auto flex gap-2 items-center">
              <span className="font-body4">12.7644</span>
              <span className="font-body4">{tEZorCTEZtoUppercase(props.tokenOut.symbol)}</span>
              <span>
                {" "}
                <img
                  alt={"alt"}
                  src={
                    tokenIcons[props.tokenOut.symbol]
                      ? tokenIcons[props.tokenOut.symbol].src
                      : tokens[props.tokenOut.symbol.toString()]?.iconUrl
                      ? tokens[props.tokenOut.symbol.toString()].iconUrl
                      : `/assets/Tokens/fallback.png`
                  }
                  width={"24px"}
                  height={"24px"}
                  onError={changeSource}
                />
              </span>
            </p>
          </div>
          <div className="border-t border-text-800/[0.5] mb-3"></div>
          <div className="flex my-3 px-5">
            <p className="font-body4 text-text-400">
              {tEZorCTEZtoUppercase(props.tokenIn.symbol)} fees earned
            </p>
            <p className="ml-auto flex gap-2 items-center">
              <span className="font-body4">12.7644</span>

              <span>
                {" "}
                <img
                  alt={"alt"}
                  src={
                    tokenIcons[props.tokenIn.symbol]
                      ? tokenIcons[props.tokenIn.symbol].src
                      : tokens[props.tokenIn.symbol.toString()]?.iconUrl
                      ? tokens[props.tokenIn.symbol.toString()].iconUrl
                      : `/assets/Tokens/fallback.png`
                  }
                  width={"24px"}
                  height={"24px"}
                  onError={changeSource}
                />
              </span>
            </p>
          </div>
          <div className="flex my-3 px-5">
            <p className="font-body4 text-text-400">
              {tEZorCTEZtoUppercase(props.tokenOut.symbol)} fees earned
            </p>
            <p className="ml-auto flex gap-2 items-center">
              <span className="font-body4">12.7644</span>

              <span>
                {" "}
                <img
                  alt={"alt"}
                  src={
                    tokenIcons[props.tokenOut.symbol]
                      ? tokenIcons[props.tokenOut.symbol].src
                      : tokens[props.tokenOut.symbol.toString()]?.iconUrl
                      ? tokens[props.tokenOut.symbol.toString()].iconUrl
                      : `/assets/Tokens/fallback.png`
                  }
                  width={"24px"}
                  height={"24px"}
                  onError={changeSource}
                />
              </span>
            </p>
          </div>
          <div className="border-t border-text-800/[0.5] mb-3"></div>
        </div>
      </div>
      <div className="mt-4"> {DecreaseButton}</div>
    </>
  );
}
