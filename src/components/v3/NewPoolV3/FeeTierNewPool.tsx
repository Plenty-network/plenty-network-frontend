import clsx from "clsx";
import Image from "next/image";
import * as React from "react";
import { isMobile } from "react-device-detect";

interface IFeeTierMainProps {
  setSelectedFeeTier: React.Dispatch<React.SetStateAction<string>>;
  selectedFeeTier: string;
  feeTier: string;
  isExist: any;
}
function FeeTierMainNewPool(props: IFeeTierMainProps) {
  const fee = [
    {
      percentage: "0.01",
      text: "Best for very stable pairs",
      selectPercentage: "46",
      created: true,
    },
    {
      percentage: "0.05",
      text: "Best for stable pairs",
      selectPercentage: "46",
      created: false,
    },
    {
      percentage: "0.3",
      text: "Best for volatile pairs",
      selectPercentage: "46",
      created: true,
    },
    {
      percentage: "1",
      text: "Best for exotic pairs",
      selectPercentage: "46",
      created: false,
    },
  ];
  return (
    <div className="flex gap-2 md:gap-[12px]  items-center justify-start ml-1">
      {fee.map((feeInd, index) => {
        return (
          <div
            key={index}
            className={clsx(
              props.isExist?.feeTier?.includes((Number(feeInd.percentage) * 100).toString())
                ? "border-text-800 cursor-not-allowed"
                : props.selectedFeeTier === feeInd.percentage
                ? "border-blue-700"
                : "border-text-800 hover:border-text-400 cursor-pointer",
              "border w-[133px]  rounded-2xl   bg-card-200   mb-5 h-[128px] md:h-[139px] sm:h-[128px] py-[12px] pl-2.5 md:pl-[14px]  pr-2 md:pr-3 "
            )}
            onClick={() => props.setSelectedFeeTier(feeInd.percentage)}
          >
            <div
              className={clsx(
                props.isExist?.feeTier?.includes((Number(feeInd.percentage) * 100).toString())
                  ? "text-text-700"
                  : props.selectedFeeTier === feeInd.percentage
                  ? "text-blue-700"
                  : "text-text-250",
                "font-caption2 sm:font-subtitle4 "
              )}
            >
              {feeInd.percentage}% {!isMobile && " fee tier"}
            </div>
            <div
              className={clsx(
                props.isExist?.feeTier?.includes((Number(feeInd.percentage) * 100).toString())
                  ? "text-text-700"
                  : " text-text-250",
                "mt-2 font-mobile-400 sm:font-body1 "
              )}
            >
              {feeInd.text}
            </div>
            <div className="mt-[12px]">
              <span
                className={clsx(
                  props.isExist?.feeTier?.includes((Number(feeInd.percentage) * 100).toString())
                    ? "text-info-500 bg-info-500/[0.2]"
                    : "text-white bg-shimmer-100",
                  " rounded-xl	 px-2 items-center flex w-fit text-[9px] md:font-caption1 h-[24px]"
                )}
              >
                {props.isExist?.feeTier?.includes((Number(feeInd.percentage) * 100).toString())
                  ? "Created"
                  : "Not created"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FeeTierMainNewPool;
