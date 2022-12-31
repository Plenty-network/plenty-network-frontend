import * as React from "react";
import { BigNumber } from "bignumber.js";
import nFormatter from "../../../api/util/helpers";
export interface IAprInfoProps {
  futureApr: BigNumber;
}

export function AprInfoFuture(props: IAprInfoProps) {
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
