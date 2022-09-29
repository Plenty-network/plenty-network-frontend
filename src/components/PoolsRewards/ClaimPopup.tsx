import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";

import { BigNumber } from "bignumber.js";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import ply from "../../assets/Tokens/ply.png";
import Button from "../Button/Button";

interface IClaimProps {
  show: boolean;
  title: string;
  setShow: any;
  handleClick: () => void;
  value: BigNumber;
  isPly: boolean;
}
function ClaimPly(props: IClaimProps) {
  const closeModal = () => {
    props.setShow(false);
  };

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
            {props.isPly ? (
              <div className="flex mt-[11px] items-center">
                <Image alt={"alt"} src={ply} width={"28px"} height={"28px"} />
                <span className="text-white font-body4 ml-2">{props.value.toFixed(2)}</span>
                <span className="text-text-500 font-body3 ml-1">PLY</span>
              </div>
            ) : (
              <div className="flex mt-[2px] items-end">
                <span className="text-white font-title2 ">${props.value.toFixed(2)}</span>
                <span className="text-text-250 font-body1 ml-2 mb-px">
                  sum of all the unclaimed rewards
                </span>
              </div>
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
