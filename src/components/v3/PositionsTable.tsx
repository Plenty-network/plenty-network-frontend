import Image from "next/image";
import * as React from "react";

import { useMemo, useRef, useState } from "react";

import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";

import info from "../../../src/assets/icon/common/infoIcon.svg";
import PositionsData from "./PositionsData";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { ActivePopUp } from "./ManageTabV3";

interface IPositionsProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;
}
function PositionsTable(props: IPositionsProps) {
  return (
    <>
      <PositionsData
        tokenIn={props.tokenIn}
        tokenOut={props.tokenOut}
        setScreen={props.setScreen}
      />
    </>
  );
}

export default PositionsTable;
