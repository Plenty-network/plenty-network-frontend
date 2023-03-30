import fromExponential from "from-exponential";
import Image from "next/image";
import * as React from "react";
import zoomin from "../../assets/icon/poolsv3/zoomin.svg";
import zoomout from "../../assets/icon/poolsv3/zoomout.svg";
import { tokenParameterLiquidity } from "../Liquidity/types";

interface IPriceRangeProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
}
function PriceRangeV3(props: IPriceRangeProps) {
  const [isFullRange, setFullRange] = React.useState(false);
  const [minPriceInput, setminPriceInput] = React.useState(110);
  const [maxPriceInput, setmaxPriceInput] = React.useState(300);
  return (
    <div>
      <div className=" w-[362px]   px-[10px]  pt-4 pb-6  mb-5 h-[254px]">
        <div className="flex justify-between">
          <div className="font-body4 ">Set Price Range</div>
          <div className="flex gap-1">
            <Image src={zoomin} />
            <Image src={zoomout} />
          </div>
        </div>
        <div className="mt-[19.5px] text-center font-mobile-f1020">
          Current Price: 1637.85{" "}
          <span className="font-mobile-f9 ml-[6px]">
            ({props.tokenIn.symbol} per {props.tokenOut.symbol})
          </span>
        </div>
      </div>
      {isFullRange ? (
        <div className="h-[78px] mt-[10px] flex items-center justify-center px-[24px] bg-error-300/[0.1]  rounded-lg	">
          <span className=" text-error-300 text-[13px] leading-[20px] ">
            Full range liquidity is highly capital inefficient. Please proceed with caution.
          </span>
        </div>
      ) : (
        <div className="flex gap-[14px] justify-between	mt-[16px]">
          <div>
            <div className="font-body4 text-text-250">
              Min Price{" "}
              <span className="font-caption1-small">
                ({props.tokenIn.symbol} per {props.tokenOut.symbol})
              </span>
            </div>
            <div className="border border-text-800 bg-card-200 rounded-2xl	py-4 px-2.5 flex items-center justify-between	w-[172px] mt-[4px] h-[55px]">
              <div
                className="w-[24px] h-[24px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center"
                onClick={() => setminPriceInput(minPriceInput - 1)}
              >
                -
              </div>
              <div className="text-center">
                <div className="font-body4 text-white">
                  <input
                    type="text"
                    className="text-white font-body4 bg-muted-200 text-center border-0    outline-none  placeholder:text-text-400 w-[100%]"
                    value={fromExponential(minPriceInput)}
                    placeholder="0.0"
                    onChange={(e) => setminPriceInput(Number(e.target.value))}
                  />
                </div>
                <div className="font-body2 text-text-250">$9.8</div>
              </div>
              <div
                className=" w-[24px] h-[24px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center"
                onClick={() => setminPriceInput(minPriceInput + 1)}
              >
                +
              </div>
            </div>
          </div>
          <div>
            <div className="font-body4 text-text-250">
              Max Price{" "}
              <span className="font-caption1-small">
                ({props.tokenIn.symbol} per {props.tokenOut.symbol})
              </span>
            </div>
            <div className="border border-text-800 bg-card-200 rounded-2xl	py-4 px-2.5 flex items-center justify-between	w-[172px] mt-[4px] h-[55px]">
              <div
                className="w-[24px] h-[24px] text-white rounded bg-info-600  flex items-center cursor-pointer justify-center"
                onClick={() => setmaxPriceInput(maxPriceInput - 1)}
              >
                -
              </div>
              <div className="text-center">
                <div className="font-body4 text-white">
                  <input
                    type="text"
                    className="text-white font-body4 bg-muted-200 text-center border-0    outline-none  placeholder:text-text-400 w-[100%]"
                    value={fromExponential(maxPriceInput)}
                    placeholder="0.0"
                    onChange={(e) => setmaxPriceInput(Number(e.target.value))}
                  />
                </div>
                <div className="font-body2 text-text-250">$9.8</div>
              </div>
              <div
                className="w-[24px] h-[24px] text-white rounded bg-info-600 cursor-pointer flex items-center justify-center"
                onClick={() => setmaxPriceInput(maxPriceInput + 1)}
              >
                +
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className="mt-3 cursor-pointer border border-info-700 rounded-lg	text-center py-2.5 font-body1"
        onClick={() => setFullRange(!isFullRange)}
      >
        Full Range
      </div>
      {/* <div className="mt-3 border border-text-800/[0.5] bg-cardBackGround rounded-lg	text-center py-4 font-body1 text-primary-500 h-[52px]">
        View all positions
      </div> */}
    </div>
  );
}

export default PriceRangeV3;
