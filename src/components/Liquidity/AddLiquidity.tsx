import { BigNumber } from "bignumber.js";
import Image from "next/image";
import add from "../../../src/assets/icon/pools/addIcon.svg";
import wallet from "../../../src/assets/icon/pools/wallet.svg";
import { estimateOtherTokenAmount } from "../../api/liquidity";
import { imageExists, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { IAllTokensBalanceResponse } from "../../api/util/types";
import { useAppSelector } from "../../redux";
import { ISwapData, tokenParameterLiquidity } from "./types";
import fallback from "../../../src/assets/icon/pools/fallback.png";

interface IAddLiquidityProps {
  firstTokenAmount: string | number;
  secondTokenAmount: string | number;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  userBalances: IAllTokensBalanceResponse;
  setFirstTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  setSecondTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  swapData: ISwapData;
  tokenPrice: {
    [id: string]: number;
  };
}
function AddLiquidity(props: IAddLiquidityProps) {
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const tokens = useAppSelector((state) => state.config.tokens);
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
        props.setFirstTokenAmount(input);
      }
      const res = estimateOtherTokenAmount(
        input.toString(),
        props.swapData.tokenInSupply as BigNumber,
        props.swapData.tokenOutSupply as BigNumber,
        props.tokenOut.symbol
      );
      props.setSecondTokenAmount(res.otherTokenAmount);
    } else if (tokenType === "tokenOut") {
      const decimal = new BigNumber(input).decimalPlaces();

      if (
        input !== null &&
        decimal !== null &&
        new BigNumber(decimal).isGreaterThan(tokens[props.tokenOut.name].decimals)
      ) {
      } else {
        props.setSecondTokenAmount(input);
      }

      const res = estimateOtherTokenAmount(
        input.toString(),
        props.swapData.tokenOutSupply as BigNumber,
        props.swapData.tokenInSupply as BigNumber,
        props.tokenIn.symbol
      );
      props.setFirstTokenAmount(res.otherTokenAmount);
    }
  };

  const onClickAmount = () => {
    props.setSecondTokenAmount("");

    props.tokenIn.name === "tez"
      ? handleLiquidityInput(
          Number(props.userBalances?.allTokensBalances[props.tokenIn.name]?.balance) - 0.02,
          "tokenIn"
        )
      : handleLiquidityInput(
          Number(props.userBalances?.allTokensBalances[props.tokenIn.name]?.balance),
          "tokenIn"
        );
  };
  const onClickSecondAmount = () => {
    props.setFirstTokenAmount("");

    props.tokenOut.name === "tez"
      ? handleLiquidityInput(
          Number(props.userBalances?.allTokensBalances[props.tokenOut.name]?.balance) - 0.02,
          "tokenOut"
        )
      : handleLiquidityInput(
          Number(props.userBalances?.allTokensBalances[props.tokenOut.name]?.balance),
          "tokenOut"
        );
  };
  return (
    <>
      <div className="border mt-[10px] flex border-text-800/[0.5] rounded-2xl h-[88px]">
        <div className="w-[50%] rounded-l-2xl border-r items-center flex border-text-800/[0.5] bg-card-300">
          <div className="ml-2 md:ml-5">
            <img
              src={
                imageExists(props.tokenIn.image)
                  ? props.tokenIn.image
                  : Object.prototype.hasOwnProperty.call(
                      tokens[props.tokenIn.symbol.toString()],
                      "iconUrl"
                    )
                  ? tokens[props.tokenIn.symbol.toString()].iconUrl
                  : `/assets/Tokens/fallback.png`
              }
              className="tokenIconLiq"
              width={"42px"}
              height={"42px"}
            />
          </div>
          <div className="ml-1 md:ml-2">
            <p className="text-text-900 font-body2">Input</p>
            <p className="font-caption1 md:font-title2 text-white">
              {tEZorCTEZtoUppercase(props.tokenIn.name)}
            </p>
          </div>
        </div>
        <div className="pl-[10px] md:pl-[25px] w-[100%] pr-2 md:pr-[18px] items-center  flex bg-muted-200/[0.1]">
          <div className="">
            <p>
              {props.swapData.isloading ? (
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
                {props.firstTokenAmount && props.tokenPrice[props.tokenIn.name]
                  ? Number(
                      Number(props.firstTokenAmount) * Number(props.tokenPrice[props.tokenIn.name])
                    ).toFixed(2)
                  : "0.00"}
              </span>
            </p>
          </div>
          {walletAddress && (
            <div className="ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[36px] md:h-[48px] items-center flex px-2 md:px-3">
              <div className="relative top-0.5 md:top-0">
                <Image alt={"alt"} src={wallet} className="walletIcon" />
              </div>
              <div
                className="ml-1 flex cursor-pointer text-primary-500 font-caption1-small md:font-body2"
                onClick={onClickAmount}
              >
                {!(
                  Number(props.userBalances?.allTokensBalances[props.tokenIn.name]?.balance) >= 0
                ) ? (
                  <p className=" w-8 mr-2  h-[16px] rounded animate-pulse bg-shimmer-100"></p>
                ) : (
                  <span className="mr-1">
                    {Number(props.userBalances?.allTokensBalances[props.tokenIn.name]?.balance) > 0
                      ? Number(
                          props.userBalances?.allTokensBalances[props.tokenIn.name]?.balance
                        ).toFixed(4)
                      : 0}{" "}
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
        <div className="w-[50%] rounded-l-2xl border-r items-center flex border-text-800/[0.5] bg-card-300">
          <div className="ml-2 md:ml-5">
            <img
              src={
                imageExists(props.tokenOut.image)
                  ? props.tokenOut.image
                  : Object.prototype.hasOwnProperty.call(
                      tokens[props.tokenOut.image.toString()],
                      "iconUrl"
                    )
                  ? tokens[props.tokenOut.image.toString()].iconUrl
                  : `/assets/Tokens/fallback.png`
              }
              className="tokenIconLiq"
              width={"42px"}
              height={"42px"}
            />
          </div>
          <div className="ml-1 md:ml-2">
            <p className="text-text-900 font-body2">Input</p>
            <p className="font-caption1 md:font-title2 text-white">
              {tEZorCTEZtoUppercase(props.tokenOut.name)}
            </p>
          </div>
        </div>
        <div className="pl-[10px] md:pl-[25px] w-[100%] pr-2 md:pr-[18px] items-center  flex bg-muted-200/[0.1]">
          <div className="">
            <p>
              {props.swapData.isloading ? (
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
            <div className="ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[36px] md:h-[48px] items-center flex px-2 md:px-3">
              <div className="relative top-0.5 md:top-0">
                <Image alt={"alt"} src={wallet} className="walletIcon" />
              </div>
              <div
                className="ml-1 cursor-pointer flex text-primary-500  font-caption1-small md:font-body2"
                onClick={onClickSecondAmount}
              >
                {!(
                  Number(props.userBalances?.allTokensBalances[props.tokenOut.name]?.balance) >= 0
                ) ? (
                  <p className=" w-6 mr-2  h-[16px] rounded animate-pulse bg-shimmer-100"></p>
                ) : (
                  <span className="mr-1">
                    {Number(props.userBalances?.allTokensBalances[props.tokenOut.name]?.balance) > 0
                      ? Number(
                          props.userBalances?.allTokensBalances[props.tokenOut.name]?.balance
                        ).toFixed(4)
                      : 0}{" "}
                  </span>
                )}
                {tEZorCTEZtoUppercase(props.tokenOut.name)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AddLiquidity;
