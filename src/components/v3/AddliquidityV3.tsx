import { BigNumber } from "bignumber.js";
import Image from "next/image";
import * as React from "react";
import add from "../../../src/assets/icon/pools/addIcon.svg";
import wallet from "../../../src/assets/icon/pools/wallet.svg";
import nFormatter, {
  changeSource,
  imageExists,
  nFormatterWithLesserNumber,
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";

import { useAppDispatch, useAppSelector } from "../../redux";
import fallback from "../../../src/assets/icon/pools/fallback.png";
import lock from "../../../src/assets/icon/poolsv3/Lock.svg";
import { tokenIcons } from "../../constants/tokensList";
import fromExponential from "from-exponential";
import { tokenParameterLiquidity } from "../Liquidity/types";
import clsx from "clsx";
import { estimateTokenXFromTokenY, estimateTokenYFromTokenX } from "../../api/v3/liquidity";
import { setInputDisable } from "../../redux/poolsv3";
import { getRealPriceFromTick } from "../../api/v3/helper";
import { isMobile } from "react-device-detect";

interface IAddLiquidityProps {
  firstTokenAmount: string | number;
  secondTokenAmount: string | number;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  userBalances: {
    [key: string]: string;
  };
  setFirstTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  setSecondTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;

  tokenPrice: {
    [id: string]: number;
  };
  selectedFeeTier: number;
}
function AddLiquidityV3(props: IAddLiquidityProps) {
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const rightbrush = useAppSelector((state) => state.poolsv3.rightbrush);
  const leftbrush = useAppSelector((state) => state.poolsv3.leftbrush);
  const currentPrice = useAppSelector((state) => state.poolsv3.currentPrice);
  const brightbrush = useAppSelector((state) => state.poolsv3.Brightbrush);
  const bleftbrush = useAppSelector((state) => state.poolsv3.Bleftbrush);
  const bcurrentPrice = useAppSelector((state) => state.poolsv3.BcurrentPrice);
  const tokens = useAppSelector((state) => state.config.tokens);

  const tokeninorg = useAppSelector((state) => state.poolsv3.tokenInOrg);
  const topLevelSelectedToken = useAppSelector((state) => state.poolsv3.topLevelSelectedToken);
  const [isFirstLaoding, setFirstLoading] = React.useState(false);
  const [isSecondLaoding, setSecondLoading] = React.useState(false);
  const isLoadingData = useAppSelector((state) => state.poolsv3.isLoading);
  const minTickA = useAppSelector((state) => state.poolsv3.minTickA);
  const maxTickA = useAppSelector((state) => state.poolsv3.maxTickA);
  const minTickB = useAppSelector((state) => state.poolsv3.minTickB);
  const maxTickB = useAppSelector((state) => state.poolsv3.maxTickB);
  const inputDisabled = useAppSelector((state) => state.poolsv3.inputDisable);

  const dispatch = useAppDispatch();
  React.useEffect(() => {
    Number(props.secondTokenAmount) !== 0 &&
      handleLiquidityInput(Number(props.secondTokenAmount).toFixed(4), "tokenIn");
  }, [topLevelSelectedToken]);

  React.useEffect(() => {
    Number(props.firstTokenAmount) !== 0 && handleLiquidityInput(props.firstTokenAmount, "tokenIn");

    if (
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? Number(leftbrush) < Number(currentPrice) && rightbrush < currentPrice
        : Number(leftbrush) < Number(bcurrentPrice) && Number(brightbrush) < Number(bcurrentPrice)
    ) {
      dispatch(setInputDisable("first"));
    } else if (
      topLevelSelectedToken.symbol === tokeninorg.symbol
        ? Number(leftbrush) > Number(currentPrice) && Number(rightbrush) > Number(currentPrice)
        : Number(bleftbrush) > Number(bcurrentPrice) && Number(brightbrush) > Number(bcurrentPrice)
    ) {
      dispatch(setInputDisable("second"));
    } else {
      dispatch(setInputDisable("false"));
    }
  }, [minTickA, maxTickA, minTickB, maxTickB, leftbrush, bleftbrush, rightbrush, brightbrush]);
  const timeout = React.useRef<any>();
  const handleLiquidityInput = function (
    input: string | number,
    tokenType: "tokenIn" | "tokenOut"
  ) {
    clearTimeout(timeout.current);
    if (input == ".") {
      props.setSecondTokenAmount("0.");
      props.setFirstTokenAmount("0.");
      return;
    }
    if (input === "" || isNaN(Number(input))) {
      setSecondLoading(false);
      setFirstLoading(false);
      props.setSecondTokenAmount("");
      props.setFirstTokenAmount("");
      return;
    } else if (tokenType === "tokenIn") {
      const decimal = new BigNumber(input).decimalPlaces();

      if (
        input !== null &&
        decimal !== null &&
        new BigNumber(decimal).isGreaterThan(tokens[props.tokenIn.name].decimals)
      ) {
      } else {
        props.setSecondTokenAmount("");
        props.setFirstTokenAmount(input.toString().trim());
      }
      setSecondLoading(true);

      if (topLevelSelectedToken.symbol === tokeninorg.symbol) {
        //const response = debounce(
        timeout.current = setTimeout(() => {
          estimateTokenYFromTokenX(
            new BigNumber(input),
            props.tokenIn.symbol,
            props.tokenOut.symbol,
            minTickA,
            maxTickA,
            props.selectedFeeTier
          ).then((response) => {
            setSecondLoading(false);
            inputDisabled === "false"
              ? props.setSecondTokenAmount(response)
              : props.setSecondTokenAmount(0);
          });
        }, 600);
      } else {
        timeout.current = setTimeout(() => {
          estimateTokenXFromTokenY(
            new BigNumber(input),
            props.tokenOut.symbol,
            props.tokenIn.symbol,
            minTickB,
            maxTickB,
            props.selectedFeeTier
          ).then((response) => {
            setSecondLoading(false);
            inputDisabled === "false"
              ? props.setSecondTokenAmount(response)
              : props.setSecondTokenAmount(0);
          });
        }, 600);
      }
    } else if (tokenType === "tokenOut") {
      const decimal = new BigNumber(input).decimalPlaces();

      if (
        input !== null &&
        decimal !== null &&
        new BigNumber(decimal).isGreaterThan(tokens[props.tokenOut.name].decimals)
      ) {
      } else {
        props.setFirstTokenAmount("");

        props.setSecondTokenAmount(input.toString().trim());
      }
      setFirstLoading(true);
      if (topLevelSelectedToken.symbol === tokeninorg.symbol) {
        timeout.current = setTimeout(() => {
          estimateTokenXFromTokenY(
            new BigNumber(input),
            props.tokenIn.symbol,
            props.tokenOut.symbol,
            minTickA,
            maxTickA,
            props.selectedFeeTier
          ).then((response) => {
            setFirstLoading(false);
            inputDisabled === "false"
              ? props.setFirstTokenAmount(response)
              : props.setFirstTokenAmount(0);
          });
        }, 600);
      } else {
        timeout.current = setTimeout(() => {
          estimateTokenYFromTokenX(
            new BigNumber(input),
            props.tokenOut.symbol,
            props.tokenIn.symbol,
            minTickB,
            maxTickB,
            props.selectedFeeTier
          ).then((response) => {
            setFirstLoading(false);
            inputDisabled === "false"
              ? props.setFirstTokenAmount(response.toString())
              : props.setFirstTokenAmount(0);
          });
        }, 600);
      }
    }
  };

  const onClickAmount = () => {
    props.setSecondTokenAmount("");

    props.tokenIn.name === "tez"
      ? handleLiquidityInput(Number(props.userBalances[props.tokenIn.name]) - 0.02, "tokenIn")
      : handleLiquidityInput(props.userBalances[props.tokenIn.name], "tokenIn");
  };
  const onClickSecondAmount = () => {
    props.setFirstTokenAmount("");

    props.tokenOut.name === "tez"
      ? handleLiquidityInput(Number(props.userBalances[props.tokenOut.name]) - 0.02, "tokenOut")
      : handleLiquidityInput(props.userBalances[props.tokenOut.name], "tokenOut");
  };
  return (
    <div className="border fade-in-light relative border-text-800 bg-card-200 p-4 rounded-2xl mt-0.5">
      <div className="border hover:border-text-700/[0.8] relative flex border-text-800/[0.5] rounded-2xl h-[72px]">
        <div className="w-[45%] md:w-[40%] rounded-l-2xl  border-r items-center flex border-text-800/[0.5] bg-card-300">
          <div className="ml-2 md:ml-5">
            <img
              src={
                tokenIcons[props.tokenIn.symbol]
                  ? tokenIcons[props.tokenIn.symbol].src
                  : tokens[props.tokenIn.symbol.toString()]?.iconUrl
                  ? tokens[props.tokenIn.symbol.toString()].iconUrl
                  : `/assets/Tokens/fallback.png`
              }
              className="tokenIconLiq"
              width={"32px"}
              height={"32px"}
              onError={changeSource}
            />
          </div>
          <div className="ml-1 md:ml-2">
            <p className="text-text-900 font-body2">Input</p>
            <p className="font-caption1 md:font-title3 text-white">
              {tEZorCTEZtoUppercase(props.tokenIn.name)}
            </p>
          </div>
        </div>
        <div className="pl-[10px] md:pl-[25px] w-[100%] pr-2 md:pr-[18px] items-center  flex bg-muted-200/[0.1]">
          <div className="w-0 flex-auto">
            <p>
              {isFirstLaoding ? (
                <p className=" my-[4px] w-[100px] h-[28px] md:h-[32px] rounded animate-pulse bg-shimmer-100"></p>
              ) : (
                <input
                  type="text"
                  className="text-white bg-muted-200/[0.1] text-left border-0 font-input-text  md:font-medium2 outline-none w-[100%] placeholder:text-text-400"
                  value={fromExponential(props.firstTokenAmount)}
                  placeholder="0.0"
                  onChange={(e) => {
                    handleLiquidityInput(e.target.value, "tokenIn");
                  }}
                />
              )}
            </p>
            <p>
              <span className="mt-1 ml-1 font-body2 md:font-body2  text-text-400">
                {" "}
                ~$
                {props.firstTokenAmount && props.tokenPrice[props.tokenIn.name]
                  ? Number(
                      Number(props.firstTokenAmount) * Number(props.tokenPrice[props.tokenIn.name])
                    ).toFixed(2)
                  : "0.00"}
              </span>
            </p>
          </div>
          {walletAddress && (
            <div className="ml-auto border border-text-800/[0.5] rounded-lg  bg-cardBackGround h-[36px] md:h-[48px] items-center flex px-1 md:px-3">
              <div className="relative top-0.5 md:top-0">
                <Image alt={"alt"} src={wallet} className="walletIcon" />
              </div>
              <div
                className="ml-1 flex cursor-pointer text-primary-500 hover:text-primary-500/[0.8]  font-caption1-small md:font-body2"
                onClick={onClickAmount}
              >
                {!(Number(props.userBalances[props.tokenIn.name]) >= 0) ? (
                  <p className=" w-8 mr-2  h-[16px] rounded animate-pulse bg-shimmer-100"></p>
                ) : (
                  <span className="mr-1">
                    {nFormatterWithLesserNumber(
                      new BigNumber(props.userBalances[props.tokenIn.name])
                    )}{" "}
                  </span>
                )}
                {!isMobile && tEZorCTEZtoUppercase(props.tokenIn.name)}
              </div>
            </div>
          )}
        </div>
      </div>

      {!isLoadingData &&
        Number(currentPrice) !== 0 &&
        Number(bcurrentPrice) !== 0 &&
        (topLevelSelectedToken.symbol === tokeninorg.symbol
          ? Number(leftbrush) !== 0
          : Number(bleftbrush) !== 0) &&
        (topLevelSelectedToken.symbol === tokeninorg.symbol
          ? Number(rightbrush) !== 0
          : Number(brightbrush) !== 0) &&
        (topLevelSelectedToken.symbol === tokeninorg.symbol
          ? Number(leftbrush) < Number(currentPrice) && Number(rightbrush) < Number(currentPrice)
          : Number(bleftbrush) < Number(bcurrentPrice) &&
            Number(brightbrush) < Number(bcurrentPrice)) && (
          <div className="fade-in-light absolute top-[18px] bg-card-500/[0.6] flex items-center h-[70px] rounded-lg pl-2 md:pl-7 backdrop-blur-[6px]  md:w-[480px]">
            <Image src={lock} />
            <span className="font-caption1-small  md:font-subtitle3 w-[250px] md:w-[318px] ml-2 md:ml-5">
              The market price is outside your specified price range. Single-asset deposit only.
            </span>
          </div>
        )}
      {(
        topLevelSelectedToken.symbol === tokeninorg.symbol
          ? Number(leftbrush) < Number(currentPrice) && Number(rightbrush) > Number(currentPrice)
          : Number(bleftbrush) < Number(bcurrentPrice) &&
            Number(brightbrush) > Number(bcurrentPrice)
      ) ? (
        <div className="relative -top-[9px] left-[25%]">
          <Image alt={"alt"} src={add} width={"24px"} height={"24px"} />
        </div>
      ) : (
        <div className="h-[30px]"></div>
      )}

      <div
        className={clsx(
          false ? "mt-[1px]" : "-mt-[25px]",
          "border flex hover:border-text-700/[0.8] border-text-800/[0.5] rounded-2xl h-[72px]"
        )}
      >
        <div className="w-[45%] md:w-[40%] rounded-l-2xl border-r items-center flex border-text-800/[0.5] bg-card-300">
          <div className="ml-2 md:ml-5">
            <img
              src={
                tokenIcons[props.tokenOut.symbol]
                  ? tokenIcons[props.tokenOut.symbol].src
                  : tokens[props.tokenOut.symbol.toString()]?.iconUrl
                  ? tokens[props.tokenOut.symbol.toString()].iconUrl
                  : `/assets/Tokens/fallback.png`
              }
              className="tokenIconLiq"
              width={"32px"}
              height={"32px"}
              onError={changeSource}
            />
          </div>
          <div className="ml-1 md:ml-2">
            <p className="text-text-900 font-body2">Input</p>
            <p className="font-caption1 md:font-title3 text-white">
              {tEZorCTEZtoUppercase(props.tokenOut.name)}
            </p>
          </div>
        </div>
        <div className="pl-[10px] md:pl-[25px] w-[100%] pr-2 md:pr-[18px] items-center  flex bg-muted-200/[0.1]">
          <div className="w-0 flex-auto">
            <p>
              {isSecondLaoding ? (
                <p className=" my-[4px] w-[100px] h-[28px] md:h-[32px] rounded animate-pulse bg-shimmer-100"></p>
              ) : (
                <input
                  type="text"
                  value={fromExponential(props.secondTokenAmount)}
                  className="text-white bg-muted-200/[0.1] text-left border-0 font-input-text  md:font-medium2 outline-none w-[100%] placeholder:text-text-400"
                  placeholder="0.0"
                  onChange={(e) => handleLiquidityInput(e.target.value, "tokenOut")}
                />
              )}
            </p>
            <p>
              <span className="mt-1 ml-1 font-body2 md:font-body2 text-text-400">
                ~$
                {props.secondTokenAmount && props.tokenPrice[props.tokenOut.name]
                  ? Number(
                      Number(props.secondTokenAmount) *
                        Number(props.tokenPrice[props.tokenOut.name])
                    ).toFixed(2)
                  : "0.00"}
              </span>
            </p>
          </div>
          {walletAddress && (
            <div className="ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[36px] md:h-[48px] items-center flex px-1 md:px-3">
              <div className="relative top-0.5 md:top-0">
                <Image alt={"alt"} src={wallet} className="walletIcon" />
              </div>
              <div
                className="ml-1 cursor-pointer flex text-primary-500  hover:text-primary-500/[0.8]  font-caption1-small md:font-body2"
                onClick={onClickSecondAmount}
              >
                {!(Number(props.userBalances[props.tokenOut.name]) >= 0) ? (
                  <p className=" w-6 mr-2  h-[16px] rounded animate-pulse bg-shimmer-100"></p>
                ) : (
                  <span className="mr-1">
                    {nFormatterWithLesserNumber(
                      new BigNumber(props.userBalances[props.tokenOut.name])
                    )}
                  </span>
                )}
                {!isMobile && tEZorCTEZtoUppercase(props.tokenOut.name)}
              </div>
            </div>
          )}
        </div>
      </div>

      {!isLoadingData &&
        (topLevelSelectedToken.symbol === tokeninorg.symbol
          ? Number(leftbrush) > Number(currentPrice) && Number(rightbrush) > Number(currentPrice)
          : Number(bleftbrush) > Number(bcurrentPrice) &&
            Number(brightbrush) > Number(bcurrentPrice)) && (
          <div className="fade-in-light absolute top-[93px] bg-card-500/[0.6] flex items-center h-[70px] rounded-lg pl-2 md:pl-7 backdrop-blur-[6px]  md:w-[480px]">
            <Image src={lock} />
            <span className="font-caption1-small  md:font-subtitle3 w-[250px] md:w-[318px] ml-2 md:ml-5">
              The market price is outside your specified price range. Single-asset deposit only.
            </span>
          </div>
        )}
    </div>
  );
}

export default AddLiquidityV3;
