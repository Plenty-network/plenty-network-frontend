import Image from "next/image";
import * as React from "react";
import check from "../../assets/icon/pools/newpool-check.svg";

import link from "../../assets/icon/pools/external_violet.svg";

export function TextNewPool() {
  return (
    <div className="px-2 mb-5">
      <div className="font-body4 mt-[20px]">
        Please go through the following points carefully before adding a pool.{" "}
        {/* <span className="font-body4 text-primary-500 ml-0.5">request gauge</span> */}
        {/* <span className="relative top-0.5 ml-1">
          <Image src={link} />
        </span> */}
      </div>
      <div className="flex font-body3 text-text-50 mt-3">
        <span className="relative top-0.5">
          <Image src={check} />
        </span>
        <span className="ml-1">
          New pools are not attached to the vote-escrow system by default.
        </span>
      </div>
      <div className="flex font-body3 text-text-50 mt-1">
        <span className="relative top-0.5">
          <Image src={check} />
        </span>
        <span className="ml-1">Trading fees for both stable and volatile swaps is 0.05%</span>
      </div>
      <div className="flex font-body3 text-text-50 mt-1">
        <span className="relative top-0.5">
          <Image src={check} />
        </span>
        <span className="ml-1">
          Please raise an attachment request in <i>#pool-requests</i> channel on{" "}
          <span className="text-primary-500 ml-0.5">Plenty&apos;s Discord.</span>
        </span>
      </div>
    </div>
  );
}
