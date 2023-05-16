import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";
import lock from "../../assets/icon/myPortfolio/purple_lock.svg";
import { BigNumber } from "bignumber.js";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import ply from "../../assets/Tokens/ply.png";
import Button from "../Button/Button";

import { store, useAppSelector } from "../../redux";
import { EClaimAllState } from "../Rewards/types";
import nFormatter, { changeSource, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { tokenIcons } from "../../constants/tokensList";
import { ActivePopUp } from "./ManageTabV3";

interface IConfirmLiqProps {
  show: boolean;

  setShow: any;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;
  handleClick: () => void;
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  removeTokenA: number;
  removeTokenB: number;
}
function ConfirmDecreaseLiq(props: IConfirmLiqProps) {
  const tokens = useAppSelector((state) => state.config.tokens);
  const closeModal = () => {
    props.setShow(false);
  };
  // const tokenPrice = store.getState().tokenPrice.tokenPrice;
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);

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
          <div className="border border-text-800 bg-card-200 p-4 mt-3 rounded-2xl">
            <div className="text-text-400 font-body1 ">You’re remove liquidity</div>
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
              <p className="font-title2-bold ml-1">2.35</p>
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
              <p className="font-title2-bold ml-1">2.35</p>
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