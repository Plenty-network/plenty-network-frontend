import type { NextPage } from "next";
import success from "../../assets/icon/common/successFrame.svg";
import epclose from "../../assets/icon/common/epclose.svg";
import openInNewTab from "../../assets/icon/common/openInNewTab.svg";
import Image from "next/image";


const Success: NextPage = () => {
  return (
    <div className="relative  max-w-[358px] rounded-[12px] bg-gray-300 shadow-[0px_4px_8px_rgba(0,_0,_0,_0),_0px_12px_44px_rgba(0,_0,_0,_0.34)] [border:1px_solid_#321d52] box-border w-full overflow-hidden flex flex-row items-center justify-center text-left text-base text-white font-poppins">
      <div className="bg-success-500">
      
      </div>
      <div className="flex-[1] rounded-[0px_4px_4px_0px] flex flex-row p-[16px] box-border items-start justify-start gap-[16px]">
        <div className="flex-[1] flex flex-col items-start justify-start gap-[8px]">
          <div className="flex flex-col items-start justify-start gap-[4px]">
            <div className="flex flex-row items-end justify-center gap-[4px]">
              <div className="relative leading-[140%] font-semibold inline-block w-[143px] shrink-0">
                Transaction successful
              </div>
              <div className="relative text-[10px] leading-[140%] text-gray-200 inline-block w-[26px] h-[15px] shrink-0">
                now
              </div>
            </div>
            <div className="relative leading-[140%] text-gray-100 inline-block w-[239px]">
              Trading 0.05 tez for 0.3838784 WBTC has been confirmed
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-[8px] text-violet-200">
            <div className="relative leading-[140%] font-semibold inline-block">
              View in explorer
            </div>
            <Image
              className="relative w-[16px] h-[16px] shrink-0 overflow-hidden"
              alt=""
              src={openInNewTab}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-start gap-[8px] text-lg text-violet-100">
          <div className="rounded-[2px] hidden flex-row p-[8px] box-border items-start justify-start">
            <div className="relative leading-[140%] font-black inline-block">
              Button
            </div>
          </div>
          <div className="rounded-[2px] hidden flex-row p-[8px] box-border items-start justify-start">
            <div className="relative leading-[140%] font-black inline-block">
              Longer Button
            </div>
          </div>
          <div className="flex flex-row items-start justify-start">
            <Image
              className="relative w-[24px] h-[24px] shrink-0"
              alt=""
              src={epclose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
