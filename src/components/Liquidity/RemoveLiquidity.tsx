import clsx from "clsx";
import Image from "next/image";
import { BigNumber } from "bignumber.js";
import wallet from "../../../src/assets/icon/pools/wallet.svg";
import { ISwapData, tokenParameterLiquidity } from "./types";
import { getOutputTokensAmount } from "../../api/liquidity";
import { useAppSelector } from "../../redux";
import nFormatter, {
  changeSource,
  imageExists,
  nFormatterWithLesserNumber,
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";
import fallback from "../../../src/assets/icon/pools/fallback.png";
import fromExponential from "from-exponential";
import { tokenIcons } from "../../constants/tokensList";
interface IRemoveLiquidityProps {
  swapData: ISwapData;
  pnlpBalance: string;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
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

  slippage: string | number;
  lpTokenPrice: BigNumber;
}
function RemoveLiquidity(props: IRemoveLiquidityProps) {
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const tokens = useAppSelector((state) => state.config.tokens);
  const handleInputPercentage = (value: number) => {
    props.setBurnAmount(value * Number(props.pnlpBalance));
    handleRemoveLiquidityInput(value * Number(props.pnlpBalance));
  };
  const handleRemoveLiquidityInput = async (input: string | number) => {
    props.setBurnAmount(input.toString().trim());
    if (input == ".") {
      props.setBurnAmount("0.");

      return;
    }
    if (input === "" || isNaN(Number(input))) {
      props.setBurnAmount("");
      props.setRemoveTokenAmount({
        tokenOneAmount: "",
        tokenTwoAmount: "",
      });
      return;
    } else {
      const res = getOutputTokensAmount(
        input.toString(),
        props.tokenIn.symbol,
        props.tokenOut.symbol,
        props.swapData.tokenInSupply as BigNumber,
        props.swapData.tokenOutSupply as BigNumber,
        props.swapData.lpTokenSupply,
        props.slippage.toString()
      );
      props.setRemoveTokenAmount({
        tokenOneAmount: res.tokenOneAmount,
        tokenTwoAmount: res.tokenTwoAmount,
      });
    }
  };
  const onClickAmount = () => {
    handleRemoveLiquidityInput(props.pnlpBalance);
  };
  return (
    <>
      <div className="flex items-end mt-[10px]">
        <div className="font-body2 md:font-body4 ml-2 text-text-500">How much PNLP to remove? </div>
        <div className="ml-auto flex font-body2">
          <p
            className={clsx(
              "cursor-pointer rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[28px] md:h-[32px] px-[8.5px] md:px-[13px] items-center flex",
              props.burnAmount === 0.25 * Number(props.pnlpBalance) &&
                "border-primary-500 bg-primary-500/[0.20]"
            )}
            {...(!walletAddress || Number(props.pnlpBalance) === 0
              ? {}
              : { onClick: () => handleInputPercentage(0.25) })}
          >
            25%
          </p>
          <p
            className={clsx(
              "cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[28px] md:h-[32px] px-[8.5px] md:px-[13px] items-center flex",
              props.burnAmount === 0.5 * Number(props.pnlpBalance) &&
                "border-primary-500 bg-primary-500/[0.20]"
            )}
            {...(!walletAddress || Number(props.pnlpBalance) === 0
              ? {}
              : { onClick: () => handleInputPercentage(0.5) })}
          >
            50%
          </p>
          <p
            className={clsx(
              "cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[28px] md:h-[32px] px-[8.5px] md:px-[13px] items-center flex",
              props.burnAmount === 0.75 * Number(props.pnlpBalance) &&
                "border-primary-500 bg-primary-500/[0.20]"
            )}
            {...(!walletAddress || Number(props.pnlpBalance) === 0
              ? {}
              : { onClick: () => handleInputPercentage(0.75) })}
          >
            75%
          </p>
        </div>
      </div>
      <div className="border pl-4 pr-5 mt-[10px] items-center flex border-text-800/[0.5] rounded-2xl h-[86px]">
        <div className="flex-auto">
          <p>
            {props.swapData.isloading ? (
              <p className=" my-[4px] w-[100px] h-[28px] md:h-[32px] rounded animate-pulse bg-shimmer-100"></p>
            ) : (
              <input
                type="text"
                className="text-white bg-muted-200/[0.1] text-left border-0 font-input-text  md:font-medium1 outline-none w-[100%] placeholder:text-text-400"
                placeholder="0.0"
                value={fromExponential(props.burnAmount)}
                onChange={(e) => handleRemoveLiquidityInput(e.target.value)}
              />
            )}
          </p>
          <p>
            <span className="mt-2 ml-1 font-body2 md:font-body4 text-text-400">
              ~$
              {!isNaN(Number(props.lpTokenPrice))
                ? Number(Number(props.burnAmount) * Number(props.lpTokenPrice)).toFixed(2)
                : "0.00"}
            </span>
          </p>
        </div>
        {walletAddress && (
          <div className="ml-auto w-[79%] sm:w-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[48px] items-center flex px-3">
            <div>
              <Image alt={"alt"} src={wallet} width={"32px"} height={"32px"} />
            </div>
            <div
              className="ml-1 text-primary-500 font-body2 cursor-pointer"
              onClick={onClickAmount}
            >
              {nFormatterWithLesserNumber(new BigNumber(props.pnlpBalance))} PNLP
            </div>
          </div>
        )}
      </div>

      <div className="border mt-3 flex border-text-800/[0.5] rounded-2xl h-[88px]">
        <div className="w-[30%] md:w-[40%] rounded-l-2xl border-r items-center flex border-text-800/[0.5] ">
          <div className="ml-2 md:ml-5 font-body2 md:font-body4 text-white">You will receive</div>
        </div>
        <div className="px-2 md:px-5 w-[100%]  items-center  flex ">
          <div className="border border-text-800/[0.5] flex  items-center rounded-2xl w-[120px] md:w-[166px] pl-[10px] py-2 h-[66px] bg-cardBackGround">
            <div>
              <img
                src={
                  tokenIcons[props.tokenIn.symbol]
                    ? tokenIcons[props.tokenIn.symbol].src
                    : tokens[props.tokenIn.symbol.toString()]?.iconUrl
                    ? tokens[props.tokenIn.symbol.toString()].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                className="tokenIconLiqRemove"
                width={"34px"}
                height={"34px"}
                onError={changeSource}
              />
            </div>
            <div className="md:ml-2.5 ">
              <p className=" md:font-title1 font-title3 text-white">
                {props.removeTokenAmount.tokenOneAmount
                  ? Number(props.removeTokenAmount.tokenOneAmount) > 0
                    ? new BigNumber(props.removeTokenAmount.tokenOneAmount).isLessThan(0.01)
                      ? "<0.01"
                      : nFormatter(new BigNumber(props.removeTokenAmount.tokenOneAmount))
                    : "0"
                  : "--"}
              </p>
              <p>
                <span className="mt-2  font-mobile-400 md:font-body4 text-text-400">
                  {tEZorCTEZtoUppercase(props.tokenIn.name)}
                </span>
              </p>
            </div>
          </div>
          <div className="border border-text-800/[0.5] ml-3 flex  items-center rounded-2xl w-[120px] md:w-[166px] pl-[10px] py-2 h-[66px] bg-cardBackGround">
            <div>
              <img
                src={
                  tokenIcons[props.tokenOut.symbol]
                    ? tokenIcons[props.tokenOut.symbol].src
                    : tokens[props.tokenOut.symbol.toString()]?.iconUrl
                    ? tokens[props.tokenOut.symbol.toString()].iconUrl
                    : `/assets/Tokens/fallback.png`
                }
                className="tokenIconLiqRemove"
                width={"34px"}
                height={"34px"}
                onError={changeSource}
              />
            </div>
            <div className="md:ml-2.5 ">
              <p className=" md:font-title1 font-title3 text-white">
                {props.removeTokenAmount.tokenTwoAmount
                  ? Number(props.removeTokenAmount.tokenTwoAmount) > 0
                    ? new BigNumber(props.removeTokenAmount.tokenTwoAmount).isLessThan(0.01)
                      ? "<0.01"
                      : nFormatter(new BigNumber(props.removeTokenAmount.tokenTwoAmount))
                    : "0"
                  : "--"}
              </p>
              <p>
                <span className="mt-2 font-mobile-400 md:font-body4 text-text-400">
                  {tEZorCTEZtoUppercase(props.tokenOut.name)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RemoveLiquidity;
