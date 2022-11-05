import Image from "next/image";
import * as React from "react";
import check from "../../assets/icon/pools/newpool-check.svg";

import link from "../../assets/icon/pools/external_violet.svg";

export function TextNewPool() {
  return (
    <div className="px-2 mb-5">
      <div className="font-body4 mt-[27px]">
        Please read before you add a new pool. After adding pool{" "}
        <span className="font-body4 text-primary-500 ml-0.5">request gauge</span>
        <span className="relative top-0.5 ml-1">
          <Image src={link} />
        </span>
      </div>
      <div className="flex font-body3 text-text-50 mt-3">
        <span className="relative top-0.5">
          <Image src={check} />
        </span>
        <span className="ml-1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </span>
      </div>
      <div className="flex font-body3 text-text-50 mt-1">
        <span className="relative top-0.5">
          <Image src={check} />
        </span>
        <span className="ml-1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </span>
      </div>
      <div className="flex font-body3 text-text-50 mt-1">
        <span className="relative top-0.5">
          <Image src={check} />
        </span>
        <span className="ml-1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </span>
      </div>
    </div>
  );
}
