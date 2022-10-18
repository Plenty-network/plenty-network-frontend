import Image from "next/image";
import * as React from "react";
import subtractSvg from "../../../assets/icon/pools/subtract.svg";

import { Position, ToolTip } from "../../Tooltip/TooltipAdvanced";
import boostIcon from "../../../assets/icon/myPortfolio/boostBlue.svg";
import { BigNumber } from "bignumber.js";
export interface IAprInfoProps {
  futureApr: BigNumber;
}

export function AprInfoFuture(props: IAprInfoProps) {
  function nFormatter(num: BigNumber) {
    if (num.isGreaterThanOrEqualTo(1000000000)) {
      return num.dividedBy(1000000000).toFixed(2) + "B";
    }
    if (num.isGreaterThanOrEqualTo(1000000)) {
      return num.dividedBy(1000000).toFixed(2) + "M";
    }
    if (num.isGreaterThanOrEqualTo(1000)) {
      return num.dividedBy(1000).toFixed(2) + "K";
    }

    return num.toFixed(2);
  }
  return (
    <div className="  md:text-f14 text-f12 cursor-pointer text-text-50  py-[3px]  text-right ">
      {Number(props.futureApr) > 0
        ? props.futureApr.isLessThan(0.01)
          ? "<0.01"
          : nFormatter(props.futureApr)
        : "0.00"}
      %
    </div>
  );
}
