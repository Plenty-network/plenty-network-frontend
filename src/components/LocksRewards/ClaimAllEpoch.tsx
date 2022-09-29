import { PopUpModal } from "../Modal/popupModal";
import Image from "next/image";

import { useEffect, useMemo, useRef, useState } from "react";
import { BigNumber } from "bignumber.js";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import timer from "../../../src/assets/icon/myPortfolio/timer.svg";
import ply from "../../assets/Tokens/ply.png";
import Button from "../Button/Button";
import { ILockRewardsEpochData, IPoolsRewardsData } from "../../api/portfolio/types";
import { ITokenPriceList } from "../../api/util/types";

interface IClaimProps {
  show: boolean;
  data: ILockRewardsEpochData[];
  setShow: any;
  epochClaim: string;
  handleClick: () => void;
}
function ClaimAllEpoch(props: IClaimProps) {
  const closeModal = () => {
    props.setShow(false);
  };

  const [value, setValue] = useState(0);
  useEffect(() => {
    var sum = 0;
    for (var pool of props.data) {
      console.log(Number(pool.bribesAmount), Number(pool.feesAmount), Number(sum));
      sum += Number(pool.bribesAmount);
      sum += Number(pool.feesAmount);
    }
    setValue(sum);
  }, [props.data]);

  return props.show ? (
    <PopUpModal onhide={closeModal}>
      {
        <>
          <div className="flex">
            <div className="cursor-pointer" onClick={closeModal}>
              <Image alt={"alt"} src={arrowLeft} />
            </div>
            <div className="mx-2 text-white font-title3">Claim rewards</div>
          </div>
          <div className="border border-text-800 bg-card-200 py-4 mt-3 rounded-2xl">
            <div className="flex mt-[2px] items-center px-4 ">
              <div>
                <div className="text-text-400 font-body1">Your Rewards</div>
                <span className="font-title2 text-white mt-1">${value.toFixed(4)}</span>
                <span className="font-body1 text-text-250 ml-1 mt-1">distributed between</span>
              </div>
              <div className="ml-auto bg-text-800/[0.5] relative top-[4px] rounded-lg flex items-center h-[36px] px-2">
                <Image alt={"alt"} src={timer} />
                <span className="font-body4 text-white ml-0.5">Epoch</span>
                <span className="font-body4 text-text-500 ml-1">{props.epochClaim}</span>
              </div>
            </div>
          </div>

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

export default ClaimAllEpoch;
