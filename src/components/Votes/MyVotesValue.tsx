import { number } from "prop-types";
import * as React from "react";
import { ManageLiquidity } from "../Pools/ManageLiquidity";
import ctez from "../../assets/Tokens/ctez.png";
import tez from "../../assets/Tokens/tez.png";
import tradingFee from "../../assets/icon/vote/tradingfees.svg";
import dollar from "../../assets/icon/vote/dollar.svg";

import Image from "next/image";

export interface IShortCardListProps {
  className?: string;
  myVotes: number;
  myVotesPercentage: number;
}

export function MyVotesValue(props: IShortCardListProps) {
  return (
    <>
      <div className="flex-1 text-right flex-col justify-center items-center">
        <div className=" ">
          <span className="font-f13">${props.myVotes.toFixed(2)}</span>
        </div>
        <div className=" ">
          <span className="font-f13">{props.myVotesPercentage.toFixed(2)}%</span>
        </div>
      </div>
    </>
  );
}
