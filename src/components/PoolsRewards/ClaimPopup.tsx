import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";

import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import ply from "../../assets/Tokens/ply.png";
import Button from "../Button/Button";

interface IClaimProps {
  show: boolean;

  setShow: any;
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
              <Image src={arrowLeft} />
            </div>
            <div className="mx-2 text-white font-title3">Claim PLY </div>
            {/* <div className="relative top-[2px] cursor-pointer">
              <Image src={info} />
            </div> */}
          </div>
          <div className="border border-text-800 bg-card-200 p-4 mt-3 rounded-2xl">
            <div className="text-text-400 font-body1 ">Your Rewards</div>
            <div className="flex mt-[11px] items-center">
              <Image src={ply} width={"28px"} height={"28px"} />
              <span className="text-white font-body4 ml-2">0</span>
              <span className="text-text-500 font-body3 ml-1">PLY</span>
            </div>
          </div>
          <div className="mt-3 font-body2 text-text-250 pl-2">Lorem Ipsum Lorem Ipsum</div>
          <div className="mt-[24px]">
            <Button color={"primary"}>Claim</Button>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default ClaimPly;