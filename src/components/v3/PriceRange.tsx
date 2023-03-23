import Image from "next/image";
import * as React from "react";

interface IPriceRangeProps {}
function PriceRangeV3(props: IPriceRangeProps) {
  return (
    <div>
      <div className="border w-[362px] rounded-2xl border-text-800 bg-card-200 px-[10px] md:px-3.5 pt-4 pb-6  mb-5 h-[254px]"></div>
      <div className="flex gap-[14px] justify-between	mt-[16px]">
        <div>
          <div className="font-body4 text-text-250">
            Min Price <span className="font-caption1-small">(CTEZ per PLENTY)</span>
          </div>
          <div className="border border-text-800 bg-card-200 rounded-2xl	py-4 px-2.5 flex items-center justify-between	w-[172px] mt-[4px] h-[55px]">
            <div className="w-[24px] h-[24px] text-white rounded bg-info-600  flex items-center justify-center">
              -
            </div>
            <div className="font-body4">9.8</div>
            <div className=" w-[24px] h-[24px] text-white rounded bg-info-600  flex items-center justify-center">
              +
            </div>
          </div>
        </div>
        <div>
          <div className="font-body4 text-text-250">
            Min Price <span className="font-caption1-small">(CTEZ per PLENTY)</span>
          </div>
          <div className="border border-text-800 bg-card-200 rounded-2xl	py-4 px-2.5 flex items-center justify-between	w-[172px] mt-[4px] h-[55px]">
            <div className="w-[24px] h-[24px] text-white rounded bg-info-600  flex items-center justify-center">
              -
            </div>
            <div className="font-body4">9.8</div>
            <div className="w-[24px] h-[24px] text-white rounded bg-info-600  flex items-center justify-center">
              +
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 border border-info-700 rounded-lg	text-center py-2.5 font-body1">
        Full Range
      </div>
      <div className="mt-3 border border-text-800/[0.5] bg-cardBackGround rounded-lg	text-center py-4 font-body1 text-primary-500 h-[52px]">
        View all positions
      </div>
    </div>
  );
}

export default PriceRangeV3;
