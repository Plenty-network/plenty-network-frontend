import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";

import { BigNumber } from "bignumber.js";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import timer from "../../../src/assets/icon/myPortfolio/timer.svg";
import Button from "../Button/Button";
import { IPoolsRewardsData } from "../../api/portfolio/types";
import { ITokenPriceList } from "../../api/util/types";

interface IClaimProps {
  show: boolean;
  data: IPoolsRewardsData[];
  setShow: any;
  totalValue: BigNumber;
  tokenPrice: ITokenPriceList;
  handleClaimAll: () => void;
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
  const tEZorCTEZtoUppercase = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;

  return props.show ? (
    <PopUpModal onhide={closeModal}>
      {
        <>
          <div className="flex">
            <div className="cursor-pointer" onClick={closeModal}>
              <Image alt={"alt"} src={arrowLeft} />
            </div>
            <div className="mx-2 text-white font-title3">Claim all Ply </div>
            {/* <div className="relative top-[2px] cursor-pointer">
              <Image alt={'alt'} src={info} />
            </div> */}
          </div>
          <div className="border border-text-800 bg-card-200 py-4 mt-3 rounded-2xl">
            <div className="flex mt-[2px] items-center px-4 mb-5">
              <div>
                <div className="text-text-400 font-body1">Your Rewards</div>
                <span className="font-title2 text-white">
                  ${(Number(props.totalValue) * props.tokenPrice["PLY"]).toFixed(2)}
                </span>
                <span className="font-body1 text-text-250 ml-1">distributed between</span>
              </div>
              <div className="ml-auto bg-text-800/[0.5] relative top-[4px] rounded-lg flex items-center h-[36px] px-2">
                <Image alt={"alt"} src={timer} />
                <span className="font-body4 text-white ml-0.5">Epoch</span>
                <span className="font-body4 text-text-500 ml-1">23</span>
              </div>
            </div>
            {props.data?.map((pool, index) => {
              return (
                <div
                  className="flex h-[50px]  items-center border-t border-b border-text-800/[0.5] bg-card-500 px-3 md:px-5"
                  key={index}
                >
                  <div className="flex items-center">
                    <span className="flex">
                      <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
                        <Image
                          src={getImagesPath(pool.tokenOneSymbol)}
                          width={"24px"}
                          height={"24px"}
                        />
                      </div>
                      <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
                        <Image
                          src={getImagesPath(pool.tokenTwoSymbol)}
                          width={"24px"}
                          height={"24px"}
                        />
                      </div>
                    </span>
                    <span className="text-white font-body4  relative top-[1px]">
                      {tEZorCTEZtoUppercase(pool.tokenOneSymbol)} /
                      {tEZorCTEZtoUppercase(pool.tokenTwoSymbol)}
                    </span>
                  </div>
                  <div className="ml-auto font-body4 text-white">
                    ${pool.gaugeEmission.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-[24px]">
            <Button color={"primary"} onClick={props.handleClaimAll}>
              Claim
            </Button>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default ClaimAll;
