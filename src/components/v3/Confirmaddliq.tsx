import Image from "next/image";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import Button from "../Button/Button";
import { BigNumber } from "bignumber.js";
import add from "../../../src/assets/icon/pools/addIcon.svg";
import { useAppSelector } from "../../redux";
import {
  changeSource,
  nFormatterWithLesserNumber5digit,
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { tokenIcons } from "../../constants/tokensList";
import { ActivePopUp } from "./ManageTabV3";

import clsx from "clsx";

interface IConfirmIncreaseLiqProps {
  show: boolean;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;
  setShow: any;

  handleClick: () => void;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  addTokenA: string | number;
  addTokenB: string | number;
}
function ConfirmIncreaseLiq(props: IConfirmIncreaseLiqProps) {
  const tokens = useAppSelector((state) => state.config.tokens);
  const closeModal = () => {
    props.setScreen(ActivePopUp.ManageExisting);
    props.setShow(false);
  };

  const selectedPosition = useAppSelector((state) => state.poolsv3.selectedPosition);
  return props.show ? (
    <div
      className={clsx(
        "  mt-[70px] lg:mt-[75px] md:rounded-3xl mx-auto fade-in border  border-popUpNotification   p-5 bg-card-500 md:w-[602px] w-auto"
      )}
    >
      {
        <>
          <div className="flex">
            <div
              className="cursor-pointer  "
              onClick={() => props.setScreen(ActivePopUp.ManageExisting)}
            >
              <Image alt={"alt"} src={arrowLeft} />
            </div>
            <div className="mx-2 text-white font-title3">Confirm Increase liquidity</div>
            {/* <div className="relative top-[2px] cursor-pointer">
              <Image alt={'alt'} src={info} />
            </div> */}
          </div>
          <div className="border-t border-x border-text-800 bg-card-200 p-4 mt-3 rounded-t-2xl">
            <div className="text-text-400 font-body1 ">You are depositing</div>
            <div className="flex items-center gap-2 mt-3">
              <p>
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
              </p>
              <p className="font-title2-bold ml-1">
                {nFormatterWithLesserNumber5digit(new BigNumber(props.addTokenA))}
              </p>
              {/* <p className="font-body4 ">(+ {props.addTokenA} )</p> */}
              <p className="font-body4 "> {tEZorCTEZtoUppercase(props.tokenIn.symbol)}</p>{" "}
            </div>

            <div className="flex items-center gap-2 mt-1.5">
              <p>
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
              </p>
              <p className="font-title2-bold ml-1">
                {nFormatterWithLesserNumber5digit(new BigNumber(props.addTokenB))}
              </p>
              {/* <p className="font-body4 ">(+ {props.addTokenB} )</p> */}
              <p className="font-body4 "> {tEZorCTEZtoUppercase(props.tokenOut.symbol)}</p>{" "}
            </div>
          </div>
          <div className="relative z-10 -top-[12px] left-[85%]">
            <Image alt={"alt"} src={add} width={"24px"} height={"24px"} />
          </div>
          <div className="border border-text-800 bg-card-200 p-4  rounded-b-2xl -mt-[31px]">
            <div className="text-text-400 font-body1 ">Fees being reinvested</div>
            <div className="flex items-center gap-2 mt-3">
              <p>
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
              </p>
              <p className="font-title2-bold ml-1">
                {nFormatterWithLesserNumber5digit(selectedPosition.fees.x)}
              </p>
              {/* <p className="font-body4 ">(+ {props.addTokenA} )</p> */}
              <p className="font-body4 "> {tEZorCTEZtoUppercase(props.tokenIn.symbol)}</p>{" "}
            </div>

            <div className="flex items-center gap-2 mt-1.5">
              <p>
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
              </p>
              <p className="font-title2-bold ml-1">
                {nFormatterWithLesserNumber5digit(selectedPosition.fees.y)}
              </p>
              {/* <p className="font-body4 ">(+ {props.addTokenB} )</p> */}
              <p className="font-body4 "> {tEZorCTEZtoUppercase(props.tokenOut.symbol)}</p>{" "}
            </div>
          </div>
          <div className="border border-secondary-700 bg-card-200 p-4 mt-3 rounded-2xl">
            <div className="text-text-400 font-body1 ">Total</div>
            <div className="flex items-center gap-2 mt-3">
              <p>
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
              </p>
              <p className="font-title2-bold ml-1">
                {nFormatterWithLesserNumber5digit(
                  new BigNumber(selectedPosition.fees.x).plus(new BigNumber(props.addTokenA))
                )}
              </p>
              {/* <p className="font-body4 ">(+ {props.addTokenA} )</p> */}
              <p className="font-body4 "> {tEZorCTEZtoUppercase(props.tokenIn.symbol)}</p>{" "}
            </div>

            <div className="flex items-center gap-2 mt-1.5">
              <p>
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
              </p>
              <p className="font-title2-bold ml-1">
                {nFormatterWithLesserNumber5digit(
                  selectedPosition.fees.y.plus(new BigNumber(props.addTokenB))
                )}
              </p>
              {/* <p className="font-body4 ">(+ {props.addTokenB} )</p> */}
              <p className="font-body4 "> {tEZorCTEZtoUppercase(props.tokenOut.symbol)}</p>{" "}
            </div>
          </div>

          <div className="mt-[20px]">
            <Button color={"primary"} onClick={props.handleClick}>
              Confirm
            </Button>
          </div>
        </>
      }
    </div>
  ) : null;
}

export default ConfirmIncreaseLiq;
