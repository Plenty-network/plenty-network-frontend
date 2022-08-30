import * as React from "react";
import { ISelectedPool, IVotePageData } from "../../api/votes/types";
import { IVotes } from "../../operations/types";
import { RangeSlider } from "../RangeSlider";

export interface IMyVotesProps {
  isMobile: boolean;
  tokenA: string;
  tokenB: string;
  setSelectedPools: React.Dispatch<React.SetStateAction<ISelectedPool[]>>;
  selectedPools: ISelectedPool[];
  setTotalVotingPower: React.Dispatch<React.SetStateAction<number>>;
  totalVotingPower: number;
  amm: string;
  setVotes: React.Dispatch<React.SetStateAction<IVotes[]>>;
  votes: IVotes[];
  selectedDropDown: {
    votingPower: string;
    tokenId: string;
  };

  totalVotesPercentage: number;
  isCurrentEpoch: boolean;
  index: number;
  votedata: {
    index: number;
    amm: string;
    votes: IVotePageData;
  }[];
  totalVotes: {
    values: number[];
    sum: number;
  };
  totalVotes1: number[];
  setTotalVotes: React.Dispatch<
    React.SetStateAction<{
      values: number[];
      sum: number;
    }>
  >;
}

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
        isDisabled={props.selectedDropDown.tokenId === "" || !props.isCurrentEpoch ? true : false}
        totalVotesPercentage={props.totalVotesPercentage}
        selectedDropDown={props.selectedDropDown}
        index={props.index}
        votedata={props.votedata}
        totalVotes={props.totalVotes}
        setTotalVotes={props.setTotalVotes}
        totalVotes1={props.totalVotes1}
      />
    </div>
  );
}
