import Image from "next/image";
import * as React from "react";
import check from "../../assets/icon/pools/newpool-check.svg";

export function TextNewPool() {
  return (
    <div className="px-2 mb-4">
      <div className="font-body4 mt-[16px]">
        Please go through the following points carefully before adding a pool.{" "}
        {/* <span className="font-body4 text-primary-500 ml-0.5">request gauge</span> */}
        {/* <span className="relative top-0.5 ml-1">
          <Image src={link} />
        </span> */}
      </div>
      <div className="flex font-body3 text-text-50 mt-3">
        <span className="relative top-0.5 w-[50px] md:w-[30px] h-[15px]">
          <Image src={check} width={"14px"} height={"14px"} />
        </span>
        <span className="ml-1">
          New pools are not attached to the vote-escrow system by default. Please raise an
          attachment request in{" "}
          <a href="https://discord.com/invite/9wZ4CuvkuJ" target="_blank" rel="noreferrer">
            <i className="text-primary-500 ml-0.5">#gauge-requests</i>
          </a>{" "}
          channel.{" "}
          {/* <span className="text-primary-500 ml-0.5">
            <a href="https://discord.com/invite/9wZ4CuvkuJ" target="_blank" rel="noreferrer">
              Plenty&apos;s Discord.
            </a>
          </span> */}
        </span>
      </div>
      <div className="flex font-body3 text-text-50 mt-1">
        <span className="relative top-0.5 w-[18px] md:w-[15px] h-[15px]">
          <Image src={check} width={"14px"} height={"14px"} />
        </span>
        <span className="ml-[6px]">Trading fees for both stable and volatile swaps is 0.05%</span>
      </div>

      <div className="flex font-body3 text-text-50 mt-1">
        <span className="relative top-0.5 w-[28px] md:w-[20px] h-[15px]">
          <Image src={check} width={"14px"} height={"14px"} />
        </span>
        <span className="ml-0.5">It may take a few minutes for the new pool to show up.</span>
      </div>
      <div className="flex font-body3 text-text-50 mt-1">
        <span className="relative top-0.5 w-[28px] md:w-[20px] h-[15px]">
          <Image src={check} width={"14px"} height={"14px"} />
        </span>
        <span className="ml-0.5">
          You should have at least 5 tez in your wallet to pay for storage fees.
        </span>
      </div>
      <div className="flex font-body3 text-text-50 mt-1">
        <span className="relative top-0.5 w-[28px] md:w-[20px] h-[15px]">
          <Image src={check} width={"14px"} height={"14px"} />
        </span>
        <span className="ml-[6px]">
          For TEZ pools, 60% of baking rewards is used for bribing, 25% goes to the team and 15% to
          the treasury.
        </span>
      </div>
    </div>
  );
}
