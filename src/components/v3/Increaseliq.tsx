import infoOrange from "../../../src/assets/icon/poolsv3/infoOrange.svg";
import infoGreen from "../../../src/assets/icon/poolsv3/infoGreen.svg";
import { tokenIcons } from "../../constants/tokensList";
import { ISwapData, tokenParameterLiquidity } from "../Liquidity/types";
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
import { ActivePopUp } from "./ManageTabV3";
import IncreaseLiquidityInputV3 from "./IncreaseliqInput";

interface IIncLiquidityProp {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  firstTokenAmount: string | number;
  secondTokenAmount: string | number;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;

  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setFirstTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  setSecondTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;

  userBalances: {
    [key: string]: string;
  };
}
export default function IncreaseLiq(props: IIncLiquidityProp) {
  const [selectedToken, setSelectedToken] = useState(props.tokenIn);
  const tokens = useAppSelector((state) => state.config.tokens);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const selectedPosition = useAppSelector((state) => state.poolsv3.selectedPosition);
  const dispatch = useDispatch<AppDispatch>();
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };

  const IncreaseButton = useMemo(() => {
    if (!walletAddress) {
      return (
        <Button onClick={connectTempleWallet} color={"primary"}>
          Connect wallet
        </Button>
      );
    } else if (Number(props.firstTokenAmount) <= 0 || Number(props.secondTokenAmount) <= 0) {
      return (
        <Button onClick={() => null} color={"disabled"}>
          Add
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
            props.setShow(true);
            props.setScreen(ActivePopUp.ConfirmExisting);
          }}
        >
          Add
        </Button>
      );
    }
  }, [props]);
  return (
    <>
      <div className="mt-[17px] border border-text-800 bg-card-200 rounded-2xl py-5 mb-3">
        <div className="flex items-center px-5">
          <div className="text-text-250 font-body4 ">You are depositing</div>{" "}
          <div className=" ml-auto">
            {true ? (
              <span className="w-fit h-[28px] px-3 flex items-center font-caption2 gap-1 rounded-lg	 text-error-300 bg-error-300/[0.1] ">
                <Image src={infoOrange} />
                Out of range
              </span>
            ) : (
              <div className="w-fit h-[28px] px-3 flex items-center font-caption2 gap-1  rounded-lg	text-success-500 bg-success-500/[0.1]">
                <Image src={infoGreen} />
                In Range
              </div>
            )}
          </div>
        </div>
        <div className="flex mt-3 h-[50px] items-center border-t border-b border-text-800/[0.5] bg-card-500 px-5">
          <div className="flex items-center">
            <span className="relative ">
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
              {nFormatterWithLesserNumber(new BigNumber(selectedPosition.liquidity.x))}{" "}
              {tEZorCTEZtoUppercase(props.tokenIn.name)} (+
              {nFormatterWithLesserNumber(new BigNumber(selectedPosition.fees.x))} fees)
            </span>
          </div>
          <div className="ml-auto font-body4 text-text-400">
            $
            {Number(
              Number(selectedPosition.liquidity.x) * Number(tokenPrice[props.tokenIn.name] ?? 0)
            ).toFixed(2)}
          </div>
        </div>
        <div className="flex  h-[50px] items-center border-b border-text-800/[0.5] bg-card-500 px-5">
          <div className="flex items-center">
            <span className="relative ">
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
              {nFormatterWithLesserNumber(new BigNumber(selectedPosition.liquidity.y))}{" "}
              {tEZorCTEZtoUppercase(props.tokenOut.name)} (+
              {nFormatterWithLesserNumber(new BigNumber(selectedPosition.fees.y))} fees)
            </span>
          </div>
          <div className="ml-auto font-body4 text-text-400">
            $
            {Number(
              Number(selectedPosition.liquidity.y) * Number(tokenPrice[props.tokenOut.name] ?? 0)
            ).toFixed(2)}
          </div>
        </div>

        <div className="flex  h-[50px] items-center border-b border-text-800/[0.5] bg-card-500 px-5">
          <div className="flex items-center">
            <span className=" font-subtitle3  text-text-400">Fee tier</span>
          </div>
          <div className="ml-auto font-body4 text-white">0.3%</div>
        </div>

        <div className="flex  items-center   px-5 py-5">
          <div className="font-subtitle3  text-text-50">Selected range</div>
          <div className="ml-auto font-body2 flex cursor-pointer">
            <div
              className={clsx(
                selectedToken.symbol === props.tokenIn.symbol
                  ? "rounded-l-lg	 border border-primary-500 bg-primary-500/[0.2] text-white"
                  : "text-text-400 bg-background-600 rounded-l-xl",
                "px-[30px] py-[5px]"
              )}
              onClick={() => setSelectedToken(props.tokenIn)}
            >
              {tEZorCTEZtoUppercase(props.tokenIn.symbol)}
            </div>
            <div
              className={clsx(
                selectedToken.symbol === props.tokenOut.symbol
                  ? "rounded-r-lg	 border border-primary-500 bg-primary-500/[0.2] text-white"
                  : "text-text-400 bg-background-600 rounded-r-xl",
                "px-[30px] py-[5px]"
              )}
              onClick={() => setSelectedToken(props.tokenOut)}
            >
              {tEZorCTEZtoUppercase(props.tokenOut.symbol)}
            </div>
          </div>
        </div>

        <div className="sm:flex gap-4 mt-2 px-5">
          <div>
            <div className="flex text-text-250">
              <span className="font-caption1 pl-1">Min Price</span>
              <span className="font-mobile-f1020 ">
                ({tEZorCTEZtoUppercase(props.tokenIn.symbol)} per{" "}
                {tEZorCTEZtoUppercase(props.tokenOut.symbol)})
              </span>
            </div>
            <div className="mt-1 border border-text-800 rounded-2xl	bg-card-200 h-[70px] w-auto sm:w-[163px] text-center py-2">
              <div className="font-title3">
                {selectedToken.symbol === props.tokenIn.symbol
                  ? selectedPosition.minPrice.toFixed(2)
                  : new BigNumber(1).dividedBy(selectedPosition.maxPrice).toFixed(2)}
              </div>
              <div className="font-subtitle5 text-text-250 mt-[1.5px]">
                {" "}
                $
                {(
                  Number(
                    selectedToken.symbol === props.tokenIn.symbol
                      ? selectedPosition.minPrice
                      : new BigNumber(1).dividedBy(selectedPosition.maxPrice)
                  ) *
                  Number(
                    tokenPrice[
                      selectedToken.symbol === props.tokenIn.symbol
                        ? props.tokenIn.name
                        : props.tokenOut.name
                    ]
                  )
                ).toFixed(2)}
              </div>
            </div>
          </div>
          <div>
            <div className="flex text-text-250 mt-3 sm:mt-0">
              <span className="font-caption1 pl-1">Max Price</span>
              <span className="font-mobile-f1020">
                ({tEZorCTEZtoUppercase(props.tokenIn.symbol)} per{" "}
                {tEZorCTEZtoUppercase(props.tokenOut.symbol)})
              </span>
            </div>
            <div className="mt-1 border border-text-800 rounded-2xl	bg-card-200 h-[70px] w-auto sm:w-[163px] text-center py-2">
              <div className="font-title3">
                {" "}
                {selectedToken.symbol === props.tokenIn.symbol
                  ? selectedPosition.maxPrice.toFixed(2)
                  : new BigNumber(1).dividedBy(selectedPosition.minPrice).toFixed(2)}
              </div>
              <div className="font-subtitle5 text-text-250 mt-[1.5px]">
                $
                {(
                  Number(
                    selectedToken.symbol === props.tokenIn.symbol
                      ? selectedPosition.maxPrice
                      : new BigNumber(1).dividedBy(selectedPosition.minPrice)
                  ) *
                  Number(
                    tokenPrice[
                      selectedToken.symbol === props.tokenIn.symbol
                        ? props.tokenIn.name
                        : props.tokenOut.name
                    ]
                  )
                ).toFixed(2)}
              </div>
            </div>
          </div>
          <div>
            <div className="flex text-text-250 mt-3 sm:mt-0">
              <span className="font-caption1 pl-1">Current price</span>
            </div>
            <div className="mt-1 border border-text-800 rounded-2xl	bg-card-200 h-[70px] w-auto sm:w-[163px] text-center py-2">
              <div className="font-title3">820.63</div>
              <div className="font-subtitle5 text-text-250 mt-[1.5px]">$23.38</div>
            </div>
          </div>
        </div>
      </div>
      <IncreaseLiquidityInputV3
        tokenIn={props.tokenIn}
        tokenOut={props.tokenOut}
        firstTokenAmount={props.firstTokenAmount}
        secondTokenAmount={props.secondTokenAmount}
        userBalances={props.userBalances}
        setSecondTokenAmount={props.setSecondTokenAmount}
        setFirstTokenAmount={props.setFirstTokenAmount}
        tokenPrice={tokenPrice}
      />
      <div className="mt-4"> {IncreaseButton}</div>
    </>
  );
}
