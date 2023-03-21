import Image from "next/image";
import * as React from "react";

interface IFeeTierMainProps {}
function FeeTierMain(props: IFeeTierMainProps) {
  const fee = [
    {
      percentage: "0.01",
      text: "Best for many stable pairs",
      selectPercentage: "46",
    },
    {
      percentage: "0.01",
      text: "Best for many stable pairs",
      selectPercentage: "46",
    },
    {
      percentage: "0.01",
      text: "Best for many stable pairs",
      selectPercentage: "46",
    },
    {
      percentage: "0.01",
      text: "Best for many stable pairs",
      selectPercentage: "46",
    },
  ];
  return (
    <div className="flex gap-[10px] mt-5 items-center justify-center">
      {fee.map((feeInd) => {
        return (
          <div className="border w-[127px] rounded-2xl border-text-800 bg-card-200   mb-5 h-[144px] py-[25px] px-4">
            <div className="font-subtitle4 text-text-250">{feeInd.percentage}% fee tier</div>
            <div className="mt-1 font-body1 text-text-250">{feeInd.text}</div>
            <div className="mt-[10px]">
              <span className="text-white rounded-xl	bg-shimmer-100 px-2 py-1.5 font-caption2 ">
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
