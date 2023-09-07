import * as React from "react";
import { Position, ToolTip } from "../../Tooltip/TooltipAdvanced";
import { BigNumber } from "bignumber.js";
import { nFormatterWithLesserNumber } from "../../../api/util/helpers";

export interface IPoolsTextProps {
  text: BigNumber;
}
export interface IPoolsTextWithTooltipProps extends IPoolsTextProps {
  token1: BigNumber;
  token2: BigNumber;
  token1Name: string;
  token2Name: string;
}

export function PoolsText(props: IPoolsTextProps) {
  return (
    <div className="text-f14  text-white cursor-pointer">
      {" "}
      ${nFormatterWithLesserNumber(new BigNumber(Number(props.text)))}
    </div>
  );
}
export function PoolsTextWithTooltip(props: IPoolsTextWithTooltipProps) {
  const isTEZorCTEZ = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez";
  return (
    <ToolTip
      position={Position.top}
      toolTipChild={
        <div>
          <div className="text-text-500 text-f14 font-normal flex gap-1">
            <div className={`text-white font-medium pr-1 `}>
              {props.token1?.toString() ?? "0.0"}
            </div>
            <div className={`${isTEZorCTEZ(props.token1Name) ? "uppercase" : ""}`}>
              {props.token1Name}
            </div>
          </div>
          <div className="text-text-500 text-f14 font-normal flex gap-1">
            <div className={`text-white font-medium pr-1`}>{props.token2?.toString() ?? "0.0"}</div>
            <div className={`${isTEZorCTEZ(props.token2Name) ? "uppercase" : ""}`}>
              {props.token2Name}
            </div>
          </div>
        </div>
      }
    >
      <PoolsText text={props.text} />
    </ToolTip>
  );
}
