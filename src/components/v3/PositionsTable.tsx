import Image from "next/image";
import * as React from "react";
import PositionsData from "./PositionsData";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { ActivePopUp } from "./ManageTabV3";

interface IPositionsProps {
  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  handleCollectFeeOperation: () => void;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;
}
function PositionsTable(props: IPositionsProps) {
  return (
    <>
      <PositionsData
        tokenIn={props.tokenIn}
        tokenOut={props.tokenOut}
        setScreen={props.setScreen}
        handleCollectFeeOperation={props.handleCollectFeeOperation}
      />
    </>
  );
}

export default PositionsTable;
