import Image from "next/image";
import * as React from "react";
import check from "../../../assets/icon/pools/newpool-check.svg";

import link from "../../../assets/icon/pools/external_violet.svg";
//import link from "../../../assets/icon/myPortfolio/link.svg";

export function TextNewPool() {
  return (
    <div className="px-2 mb-4">
      <div className="font-body4 mt-[16px]">
        Please read before you add a new pool.
        {/* After adding pool{" "}
        <span className="font-body4 text-primary-500 ml-0.5">request gauge</span>
        <span className="relative top-[3px] ml-1">
          <Image src={link} width={"15px"} />
        </span> */}
      </div>
      <div className="flex font-body3 text-text-50 mt-1">
        <span className="relative top-0.5 w-[28px] md:w-[20px] h-[15px]">
          <Image src={check} width={"14px"} height={"14px"} />
        </span>
        <span className="ml-0.5"> New V3 pools will have gauge support only in the future.</span>
      </div>
      {/* <div className="flex font-body3 text-text-50 mt-3">
        <span className="relative top-0.5 w-[50px] md:w-[30px] h-[15px]">
          <Image src={check} width={"14px"} height={"14px"} />
        </span>
        <span className="ml-1">
          New V3 pools will have gauge support only in the future.{" "}
           <a href="https://discord.com/invite/9wZ4CuvkuJ" target="_blank" rel="noreferrer">
            <i className="text-primary-500 ml-0.5">#gauge-requests</i>
          </a>{" "}
          channel.{" "} 
         
        </span>
      </div> */}

      <div className="flex font-body3 text-text-50 mt-1">
        <span className="relative top-0.5 w-[18px] md:w-[15px] h-[15px]">
          <Image src={check} width={"14px"} height={"14px"} />
        </span>
        <span className="ml-[6px]">
          20% of trading fees is taken as dev share, the rest goes to the liquidity provider.
        </span>
      </div>

      <div className="flex font-body3 text-text-50 mt-1">
        <span className="relative top-0.5 w-[28px] md:w-[20px] h-[15px]">
          <Image src={check} width={"14px"} height={"14px"} />
        </span>
        <span className="ml-0.5">
          You must have at least 8 tez in your account to pay for pool deployment
        </span>
      </div>
      <div className="flex font-body3 text-text-50 mt-1">
        <span className="relative top-0.5 w-[28px] md:w-[20px] h-[15px]">
          <Image src={check} width={"14px"} height={"14px"} />
        </span>
        <span className="ml-[3px]">It may take a few minutes for the pool to show up.</span>
      </div>
      {/* <div className="flex font-body3 text-text-50 mt-1">
        <span className="relative top-0.5 w-[28px] md:w-[20px] h-[15px]">
          <Image src={check} width={"14px"} height={"14px"} />
        </span>
        <span className="ml-[6px]">
          For TEZ pools, 60% of baking rewards is used for bribing, 25% goes to the team and 15% to
          the treasury.
        </span>
      </div> */}
    </div>
  );
}
