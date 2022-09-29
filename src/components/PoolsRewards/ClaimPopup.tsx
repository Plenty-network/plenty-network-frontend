import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";
import lock from "../../assets/icon/myPortfolio/purple_lock.svg";
import { BigNumber } from "bignumber.js";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import ply from "../../assets/Tokens/ply.png";
import Button from "../Button/Button";
import { Position, ToolTip, TooltipType } from "../Tooltip/TooltipAdvanced";
import { store } from "../../redux";
import { EClaimAllState } from "../Rewards/types";

interface IClaimProps {
  subValue?: string;
  show: boolean;
  title: string;
  setShow: any;
  state: EClaimAllState;
  handleClick: () => void;
  value: BigNumber;
  isPly: boolean;
  isSuperNova: boolean;
  plyValue: BigNumber;
}
function ClaimPly(props: IClaimProps) {
  const closeModal = () => {
    props.setShow(false);
  };
  const tokenPrice = store.getState().tokenPrice.tokenPrice;
  function nFormatter(num: BigNumber) {
    if (num.isGreaterThanOrEqualTo(1000000000)) {
      return num.dividedBy(1000000000).toFixed(2) + "B";
    }
    if (num.isGreaterThanOrEqualTo(1000000)) {
      return num.dividedBy(1000000).toFixed(2) + "M";
    }
    if (num.isGreaterThanOrEqualTo(1000)) {
      return num.dividedBy(1000).toFixed(2) + "K";
    }

    return num.toFixed(2);
  }

  return props.show ? (
    <PopUpModal onhide={closeModal}>
      {
        <>
          <div className="flex">
            <div className="cursor-pointer" onClick={closeModal}>
              <Image alt={"alt"} src={arrowLeft} />
            </div>
            <div className="mx-2 text-white font-title3">{props.title}</div>
            {/* <div className="relative top-[2px] cursor-pointer">
              <Image alt={'alt'} src={info} />
            </div> */}
          </div>
          <div className="border border-text-800 bg-card-200 p-4 mt-3 rounded-2xl">
            <div className="text-text-400 font-body1 ">Your Rewards</div>
            {!props.isSuperNova &&
              (props.isPly ? (
                <div className="flex mt-[11px] items-center">
                  <Image
                    alt={"alt"}
                    src={props.state === EClaimAllState.UNCLAIMED ? lock : ply}
                    width={"28px"}
                    height={"28px"}
                  />
                  <ToolTip
                    message={`$${tokenPrice["PLY"] * Number(props.value)}`}
                    id="tooltip8"
                    type={TooltipType.withoutArrowsAndTitle}
                    position={Position.top}
                  >
                    <>
                      <span className="text-white font-body4 ml-2">{props.value.toFixed(2)}</span>
                      <span className="text-text-500 font-body3 ml-1">PLY</span>
                    </>
                  </ToolTip>
                </div>
              ) : (
                <div className="flex mt-[2px] items-end">
                  <span className="text-white font-title2 ">${props.value.toFixed(2)}</span>
                  {props.subValue && (
                    <span className="text-text-250 font-body1 ml-2 mb-px">{props.subValue}</span>
                  )}
                </div>
              ))}
            {props.isSuperNova && (
              <>
                <div className="flex mt-[2px] items-end">
                  <span className="text-white font-title2 ">${props.value.toFixed(2)} +</span>
                  <span className="flex items-center font-body3">
                    <span className="ml-1">
                      <ToolTip
                        message={"Unclaimed inflation"}
                        id="tooltip8"
                        type={TooltipType.withoutArrowsAndTitle}
                        position={Position.top}
                      >
                        <Image alt={"alt"} src={lock} width={"16px"} height={"16px"} />
                      </ToolTip>
                    </span>
                    <span className="text-white ml-0.5">
                      {Number(props.plyValue) > 0
                        ? props.plyValue?.isLessThan(0.01)
                          ? "<0.01"
                          : nFormatter(props.plyValue)
                        : "0"}{" "}
                      PLY
                    </span>
                  </span>
                  {props.subValue && (
                    <span className="text-text-250 font-body1 ml-2 mb-px">{props.subValue}</span>
                  )}
                </div>
              </>
            )}
          </div>
          {/* <div className="mt-3 font-body2 text-text-250 pl-2">Lorem Ipsum Lorem Ipsum</div> */}
          <div className="mt-[24px]">
            <Button color={"primary"} onClick={props.handleClick}>
              Claim
            </Button>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default ClaimPly;
