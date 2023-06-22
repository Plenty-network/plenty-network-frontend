import { tokenIcons } from "../../constants/tokensList";
import { tokenParameterLiquidity } from "../Liquidity/types";

import info from "../../../src/assets/icon/common/infoIcon.svg";
import clsx from "clsx";
import {
  changeSource,
  nFormatterWithLesserNumber,
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";
import { useMemo, useEffect } from "react";
import Image from "next/image";
import { AppDispatch, useAppSelector } from "../../redux";

import Button from "../Button/Button";
import { useDispatch } from "react-redux";
import { walletConnection } from "../../redux/wallet/wallet";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { RangeSliderDecLiq } from "./RangeSliderDecrease";
import { ActivePopUp } from "./ManageTabV3";
import { calculateTokensForRemoveLiquidity } from "../../api/v3/positions";
import { BalanceNat } from "../../api/v3/types";

interface IDecLiquidityProp {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  firstTokenAmount: string | number;
  secondTokenAmount: string | number;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;

  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setFirstTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  setSecondTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  setRemove: React.Dispatch<React.SetStateAction<BalanceNat>>;
  remove: BalanceNat;
  userBalances: {
    [key: string]: string;
  };
  setRemovePercentage: React.Dispatch<React.SetStateAction<number>>;
  removePercentage: number;
}
export default function DecreaseLiq(props: IDecLiquidityProp) {
  const tokens = useAppSelector((state) => state.config.tokens);
  const walletAddress = useAppSelector((state) => state.wallet.address);

  const selectedPosition = useAppSelector((state) => state.poolsv3.selectedPosition);
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  // const DecreaseButton = useMemo(() => {
  //   if (!walletAddress) {
  //     return (
  //       <Button onClick={connectTempleWallet} color={"primary"}>
  //         Connect wallet
  //       </Button>
  //     );
  //   } else if (props.removePercentage === 0) {
  //     return (
  //       <Button onClick={() => null} color={"disabled"}>
  //         Remove
  //       </Button>
  //     );
  //   } else {
  //     return (
  //       <Button
  //         color={"primary"}
  //         onClick={() => {
  //           props.setShow(true);
  //           props.setScreen(ActivePopUp.ConfirmExisting);
  //         }}
  //       >
  //         Remove
  //       </Button>
  //     );
  //   }
  // }, [props.removePercentage, walletAddress]);

  useEffect(() => {
    calculateTokensForRemoveLiquidity(
      Number(props.removePercentage),
      props.tokenIn.symbol,
      props.tokenOut.symbol,
      selectedPosition
    ).then((res) => {
      props.setRemove(res);
    });
  }, [props.removePercentage]);

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
          <div className="font-f40-600 mr-[28px] w-[100px]">{props.removePercentage}%</div>
          <div
            className={clsx(
              props.removePercentage === 25
                ? "bg-primary-500 text-black"
                : "bg-muted-235 text-text-500",
              "cursor-pointer w-[91px] h-[36px] rounded-lg	text-center font-body4  py-2"
            )}
            onClick={() => props.setRemovePercentage(25)}
          >
            25%
          </div>
          <div
            className={clsx(
              props.removePercentage === 50
                ? "bg-primary-500 text-black"
                : "bg-muted-235 text-text-500 ",
              "cursor-pointer w-[91px] h-[36px] rounded-lg font-body4	 text-center py-2"
            )}
            onClick={() => props.setRemovePercentage(50)}
          >
            50%
          </div>
          <div
            className={clsx(
              props.removePercentage === 75
                ? "bg-primary-500 text-black"
                : "bg-muted-235 text-text-500",
              "cursor-pointer w-[91px] h-[36px] rounded-lg	font-body4 text-center py-2"
            )}
            onClick={() => props.setRemovePercentage(75)}
          >
            75%
          </div>
          <div
            className={clsx(
              props.removePercentage === 100
                ? "bg-primary-500 text-black"
                : "bg-muted-235 text-text-500",
              "cursor-pointer w-[91px] h-[36px] rounded-lg	font-body4  text-center py-2"
            )}
            onClick={() => props.setRemovePercentage(100)}
          >
            100%
          </div>
        </div>
        <RangeSliderDecLiq
          decreaseValue={props.removePercentage}
          setRemovePercentage={props.setRemovePercentage}
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
              <span className="font-body4">
                {props.remove?.x ? nFormatterWithLesserNumber(props.remove?.x) : 0}
              </span>
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
              <span className="font-body4">
                {props.remove?.y ? nFormatterWithLesserNumber(props.remove?.y) : 0}
              </span>
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
              <span className="font-body4">{selectedPosition.fees?.x.toFixed(2)}</span>

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
              <span className="font-body4">{selectedPosition.fees?.y.toFixed(2)}</span>

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

      <Button onClick={connectTempleWallet} color={"primary"}>
        Connect wallet
      </Button>

      {/* <div className="mt-4"> {DecreaseButton}</div> */}
    </>
  );
}
