import * as React from "react";
import { RangeSlider } from "../RangeSlider";
import { IMyVotesProps } from "./types";

export function MyVotes(props: IMyVotesProps) {
  return (
    <div className="flex md:flex-1 md:ml-5">
      <RangeSlider
        isMobile={props.isMobile}
        tokenA={props.tokenA}
        tokenB={props.tokenB}
        setSelectedPools={props.setSelectedPools}
        selectedPools={props.selectedPools}
        setTotalVotingPower={props.setTotalVotingPower}
        totalVotingPower={props.totalVotingPower}
        amm={props.amm}
        setVotes={props.setVotes}
        votes={props.votes}
        isDisabled={
          Number(props.selectedDropDown.votingPower) === 0 ||
          !props.isCurrentEpoch ||
          (props.isCurrentEpoch && props.sumOfVotes === 100)
            ? true
            : false
        }
        totalVotesPercentage={props.totalVotesPercentage}
        selectedDropDown={props.selectedDropDown}
        index={props.index}
        votedata={props.votedata}
        totalVotes1={props.totalVotes1}
      />
    </div>
  );
}
