import Image from "next/image";
import clsx from "clsx";

import info from "../../../src/assets/icon/common/infoIcon.svg";
import { IClaimDataResponse } from "../../api/airdrop/types";
export interface IProgress {
  claimData: IClaimDataResponse;
}

function Progress(props: IProgress) {
  return (
    <>
      <div className="flex gap-2 px-5">
        <p
          className={clsx(
            props.claimData.claimData.length > 0
              ? props.claimData.claimData[0]
                ? "bg-blue-100"
                : "bg-info-300"
              : "bg-info-300",
            "h-[6px]  w-[105px]"
          )}
        ></p>
        <p
          className={clsx(
            props.claimData.claimData.length > 1
              ? props.claimData.claimData[1]
                ? "bg-blue-100"
                : "bg-info-300"
              : "bg-info-300",
            "h-[6px]  w-[105px]"
          )}
        ></p>
        <p
          className={clsx(
            props.claimData.claimData.length > 2
              ? props.claimData.claimData[2]
                ? "bg-blue-100"
                : "bg-info-300"
              : "bg-info-300",
            "h-[6px]  w-[105px]"
          )}
        ></p>
        <p
          className={clsx(
            props.claimData.claimData.length > 3
              ? props.claimData.claimData[3]
                ? "bg-blue-100"
                : "bg-info-300"
              : "bg-info-300",
            "h-[6px]  w-[105px]"
          )}
        ></p>
        <p
          className={clsx(
            props.claimData.claimData.length > 4
              ? props.claimData.claimData[4]
                ? "bg-blue-100"
                : "bg-info-300"
              : "bg-info-300",
            "h-[6px]  w-[105px]"
          )}
        ></p>
        <p
          className={clsx(
            props.claimData.claimData.length > 5
              ? props.claimData.claimData[5]
                ? "bg-blue-100"
                : "bg-info-300"
              : "bg-info-300",
            "h-[6px]  w-[105px]"
          )}
        ></p>
      </div>
      <div className="flex mt-3 px-5">
        <p className="font-subtitle3">
          <span className="relative top-[2px] mr-1.5">
            <Image alt={"alt"} src={info} />
          </span>
          Your progress
        </p>
        <p className="ml-auto text-primary-500 font-subtitle4">
          ({((props.claimData.claimData.length / 6) * 100).toFixed(2)}%)
        </p>
      </div>
    </>
  );
}

export default Progress;
