import clsx from "clsx";
import * as React from "react";
import { isMobile } from "react-device-detect";

interface IFeeTierMainProps {
  setSelectedFeeTier: React.Dispatch<React.SetStateAction<string>>;
  selectedFeeTier: string;
  feeTier: string;
}
function FeeTierMain(props: IFeeTierMainProps) {
  const fee = [
    {
      percentage: "0.01",
      text: "Best for very stable pairs",
      selectPercentage: "46",
    },
    {
      percentage: "0.05",
      text: "Best for stable pairs",
      selectPercentage: "46",
    },
    {
      percentage: "0.3",
      text: "Best for volatile pairs",
      selectPercentage: "46",
    },
    {
      percentage: "1",
      text: "Best for exotic pairs",
      selectPercentage: "46",
    },
  ];
  return (
    <div className="flex gap-[7px]  items-center justify-center">
      {fee.map((feeInd, index) => {
        return (
          <div
            key={index}
            className={clsx(
              props.selectedFeeTier == feeInd.percentage
                ? "border-blue-700"
                : "border-text-800 hover:border-text-400",
              "border fade-in-light w-[95px] sm:w-[127px] rounded-2xl   bg-card-200   mb-5 sm:h-[128px] h-[120px]  py-[12px] sm:pl-[14px] pl-2  sm:pr-3 pr-2 cursor-pointer"
            )}
            onClick={() => props.setSelectedFeeTier(feeInd.percentage)}
          >
            <div
              className={clsx(
                props.selectedFeeTier == feeInd.percentage ? "text-blue-700" : "text-text-250",
                "font-caption2 sm:font-subtitle4 "
              )}
            >
              {feeInd.percentage}% {!isMobile && " fee tier"}
            </div>
            <div className="mt-2 font-mobile-400 sm:font-body1 text-text-250">{feeInd.text}</div>
            <div className="mt-[12px]">
              <span className="text-white rounded-xl	bg-shimmer-100 px-2 items-center flex w-fit font-caption2 h-[24px]">
                {feeInd.selectPercentage}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FeeTierMain;
