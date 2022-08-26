import * as React from "react";
import { ISelectedPool } from "../../api/votes/types";
import { RangeSlider } from "../RangeSlider";

export interface IMyVotesProps {
  isMobile: boolean;
  tokenA: string;
  tokenB: string;
  setSelectedPools: React.Dispatch<React.SetStateAction<ISelectedPool[]>>;
  selectedPools: ISelectedPool[];
  setTotalVotingPower: React.Dispatch<React.SetStateAction<number>>;
  totalVotingPower: number;
}

export function MyVotes(props: IMyVotesProps) {
  return (
    <div className="flex">
      <RangeSlider
        isMobile={props.isMobile}
        tokenA={props.tokenA}
        tokenB={props.tokenB}
        setSelectedPools={props.setSelectedPools}
        selectedPools={props.selectedPools}
        setTotalVotingPower={props.setTotalVotingPower}
        totalVotingPower={props.totalVotingPower}
      />
    </div>
  );
}
