import clsx from "clsx";
import Image from "next/image";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";

import { BigNumber } from "bignumber.js";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import ctez from "../../../src/assets/Tokens/ctez.png";
import add from "../../../src/assets/icon/pools/addIcon.svg";
import Button from "../Button/Button";
import { PopUpModal } from "../Modal/popupModal";
import { tokenParameterLiquidity } from "./types";
import nFormatter, {
  changeSource,
  imageExists,
  nFormatterWithLesserNumber,
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";
import { useAppSelector } from "../../redux";
import fallback from "../../../src/assets/icon/pools/fallback.png";
import { tokenIcons } from "../../constants/tokensList";

interface IConfirmRemoveLiquidityProps {
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;

  tokenPrice: {
    [id: string]: number;
  };
  pnlpEstimates: string;
  sharePool: string;
  handleRemoveLiquidityOperation: () => void;
  burnAmount: string | number;
  removeTokenAmount: {
    tokenOneAmount: string;
    tokenTwoAmount: string;
  };
}
function ConfirmRemoveLiquidity(props: IConfirmRemoveLiquidityProps) {
  const tokens = useAppSelector((state) => state.config.tokens);
  return (
    <>
      <div className="flex">
        <div className="cursor-pointer" onClick={() => props.setScreen("1")}>
          <Image alt={"alt"} src={arrowLeft} />
        </div>
        <div className="mx-2 text-white font-title3">Confirm Remove liquidity </div>
        {/* <div className="relative cursor-pointer top-[2px]">
          <Image alt={"alt"} src={info} />
        </div> */}
      </div>
      <div className="mt-5 text-text-500 font-body4">
        Output is estimated. If the price changes by more than 0.5% your transaction will revert
      </div>
      <div className="mt-[17px] border border-text-800 bg-card-200 rounded-2xl py-5">
        <p className="text-text-250 font-body4 px-5">You are removing</p>
        <div className="flex mt-3 h-[50px] items-center border-t border-b border-text-800/[0.5] bg-card-500 px-5">
          <div className="flex items-center">
            <span className="relative top-[3px]">
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
            <span className="text-white font-body4 ml-5 relative top-[1px]">
              {props.removeTokenAmount.tokenOneAmount} {tEZorCTEZtoUppercase(props.tokenIn.name)}
            </span>
          </div>
          <div className="ml-auto font-body4 text-text-400">
            $
            {Number(
              Number(props.removeTokenAmount.tokenOneAmount) *
                Number(props.tokenPrice[props.tokenIn.name] ?? 0)
            ).toFixed(2)}
          </div>
        </div>
        <div className="flex  h-[50px] items-center border-b border-text-800/[0.5] bg-card-500 px-5">
          <div className="flex items-center">
            <span className="relative top-[3px]">
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
            <span className="text-white font-body4 ml-5 relative top-[1px]">
              {nFormatterWithLesserNumber(new BigNumber(props.removeTokenAmount.tokenTwoAmount))}{" "}
              {tEZorCTEZtoUppercase(props.tokenOut.name)}
            </span>
          </div>
          <div className="ml-auto font-body4 text-text-400">
            $
            {Number(
              Number(props.removeTokenAmount.tokenTwoAmount) *
                Number(props.tokenPrice[props.tokenIn.name] ?? 0)
            ).toFixed(2)}
          </div>
        </div>
        <div className="mt-4 px-5 text-text-250 font-body4 ">PNLP being burnt (atleast)</div>
        <div className="mt-1 px-5 text-white font-title2 ">
          {nFormatterWithLesserNumber(new BigNumber(props.burnAmount))} PNLP
        </div>
        <div className="mt-5 border-t border-text-800/[0.5]"></div>
        <div className="px-5 mt-[18px] flex justify-between">
          <p className="text-text-250 font-body2">Share of pool</p>
          <p className="font-body4 text-white">
            {nFormatterWithLesserNumber(new BigNumber(props.sharePool))}%{" "}
          </p>
        </div>
      </div>
      <div className="mt-5">
        <Button color={"primary"} onClick={props.handleRemoveLiquidityOperation}>
          Confirm
        </Button>
      </div>
    </>
  );
}

export default ConfirmRemoveLiquidity;
