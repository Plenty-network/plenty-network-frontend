import * as React from "react";

export interface IShortCardListProps {
  className?: string;
  totalvotes: number;
  totalVotesPercentage: number;
}

export function TotalVotes(props: IShortCardListProps) {
  return (
    <>
      <div className="flex-1 text-right  justify-center items-center">
        <div className="font-f13 text-text-50">{props.totalvotes.toFixed(2)}</div>
        <div className="font-subtitle4 relative top-[10px]">
          {props.totalVotesPercentage.toFixed(2)}%
        </div>
      </div>
    </>
  );
}
