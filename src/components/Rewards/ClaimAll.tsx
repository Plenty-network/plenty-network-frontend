import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";

import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import timer from "../../../src/assets/icon/myPortfolio/timer.svg";
import ply from "../../assets/Tokens/ply.png";
import Button from "../Button/Button";

interface IClaimProps {
  show: boolean;

  setShow: any;
}
function ClaimAll(props: IClaimProps) {
  const closeModal = () => {
    props.setShow(false);
  };
  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  return props.show ? (
    <PopUpModal onhide={closeModal}>
      {
        <>
          <div className="flex">
            <div className="cursor-pointer" onClick={closeModal}>
              <Image src={arrowLeft} />
            </div>
            <div className="mx-2 text-white font-title3">Claim all Ply </div>
            {/* <div className="relative top-[2px] cursor-pointer">
              <Image src={info} />
            </div> */}
          </div>
          <div className="border border-text-800 bg-card-200 py-4 mt-3 rounded-2xl">
            <div className="flex mt-[2px] items-center px-4">
              {/* <Image src={ply} width={"28px"} height={"28px"} /> */}
              <div>
                <div className="text-text-400 font-body1">Your Rewards</div>
                <span className="font-title2 text-white">$4234</span>
                <span className="font-body1 text-text-250 ml-1">distributed between</span>
              </div>
              <div className="ml-auto bg-text-800/[0.5] relative top-[4px] rounded-lg flex items-center h-[36px] px-2">
                <Image src={timer} />
                <span className="font-body4 text-white ml-0.5">Epoch</span>
                <span className="font-body4 text-text-500 ml-1">23</span>
              </div>
              {/* <span className="text-white font-body4 ml-2">0</span>
              <span className="text-text-500 font-body3 ml-1">PLY</span> */}
            </div>
            <div className="flex h-[50px] mt-5 items-center border-t border-b border-text-800/[0.5] bg-card-500 px-3 md:px-5">
              <div className="flex items-center">
                <span className="flex">
                  <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
                    <Image src={getImagesPath("ctez")} width={"24px"} height={"24px"} />
                  </div>
                  <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
                    <Image src={getImagesPath("tez")} width={"24px"} height={"24px"} />
                  </div>
                </span>
                <span className="text-white font-body4  relative top-[1px]">CTEZ/TEZ</span>
              </div>
              <div className="ml-auto font-body4 text-white">{20}%</div>
            </div>
          </div>

          <div className="mt-[24px]">
            <Button color={"primary"}>Claim</Button>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default ClaimAll;
