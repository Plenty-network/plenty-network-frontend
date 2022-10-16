import * as React from "react";
import { BigNumber } from "bignumber.js";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { IToken, IVoteShare } from "./types";
import Image from "next/image";

export function Token(props: IToken) {
  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };
  const tEZorCTEZtoUppercase = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="mr-2 relative top-0.5">
          <Image alt={"alt"} src={getImagesPath(props.value)} width={"20px"} height={"20px"} />
        </div>
        <div className="font-subtitle3 text-white">{tEZorCTEZtoUppercase(props.value)}</div>
      </div>
    </>
  );
}
