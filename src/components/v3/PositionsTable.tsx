import Image from "next/image";
import * as React from "react";
import PositionsData from "./PositionsData";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { ActivePopUp } from "./ManageTabV3";
import { PositionDataTable } from "./PositionsTableData";

interface IPositionsProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  handleCollectFeeOperation: () => void;
  feeTier: string;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;
}
function PositionsTable(props: IPositionsProps) {
  return (
    <div className="mt-3 h-[300px] overflow-y-auto innerPool">
      <PositionDataTable
        feeTier={props.feeTier}
        tokenIn={props.tokenIn}
        tokenOut={props.tokenOut}
        setScreen={props.setScreen}
        handleCollectFeeOperation={props.handleCollectFeeOperation}
      />
    </div>
  );
}

export default PositionsTable;
