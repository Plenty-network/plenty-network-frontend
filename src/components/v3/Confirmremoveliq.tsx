import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";

import { BigNumber } from "bignumber.js";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import Button from "../Button/Button";

import { useAppSelector } from "../../redux";
import {
  changeSource,
  nFormatterWithLesserNumber,
  tEZorCTEZtoUppercase,
} from "../../api/util/helpers";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { tokenIcons } from "../../constants/tokensList";
import { ActivePopUp } from "./ManageTabV3";
import { IV3PositionObject } from "../../api/v3/types";

interface IConfirmLiqProps {
  show: boolean;

  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;
  handleClick: () => void;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  removeTokenA: BigNumber;
  removeTokenB: BigNumber;
  selectedPosition: IV3PositionObject;
}
function ConfirmDecreaseLiq(props: IConfirmLiqProps) {
  const tokens = useAppSelector((state) => state.config.tokens);
  const closeModal = () => {
    props.setScreen(ActivePopUp.ManageExisting);
    props.setShow(false);
  };
  return props.show ? (
    <PopUpModal onhide={closeModal}>
      {
        <>
          <div className="flex">
            <div
              className="cursor-pointer "
              onClick={() => props.setScreen(ActivePopUp.ManageExisting)}
            >
              <Image alt={"alt"} src={arrowLeft} />
            </div>
            <div className="mx-2 text-white font-title3">Confirm Decrease liquidity</div>
            {/* <div className="relative top-[2px] cursor-pointer">
              <Image alt={'alt'} src={info} />
            </div> */}
          </div>
          <div className="border-t border-x  border-text-800 bg-card-200 p-4 mt-3 rounded-t-2xl">
            <div className="text-text-400 font-body1 ">You are removing </div>
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
                {nFormatterWithLesserNumber(props.removeTokenA)}
              </p>
              <p className="font-body4 ">{tEZorCTEZtoUppercase(props.tokenIn.symbol)}</p>{" "}
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
                {nFormatterWithLesserNumber(props.removeTokenB)}
              </p>
              <p className="font-body4 ">{tEZorCTEZtoUppercase(props.tokenOut.symbol)}</p>{" "}
            </div>
          </div>
          <div className="border border-text-800 bg-card-200 p-4 rounded-b-2xl">
            <div className="text-text-400 font-body1 ">Fees earned</div>
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
                {nFormatterWithLesserNumber(props.selectedPosition.fees.x)}
              </p>
              <p className="font-body4 ">{tEZorCTEZtoUppercase(props.tokenIn.symbol)}</p>{" "}
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
                {nFormatterWithLesserNumber(props.selectedPosition.fees.y)}
              </p>
              <p className="font-body4 ">{tEZorCTEZtoUppercase(props.tokenOut.symbol)}</p>{" "}
            </div>
          </div>

          <div className="mt-[24px]">
            <Button color={"primary"} onClick={props.handleClick}>
              Confirm
            </Button>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default ConfirmDecreaseLiq;
