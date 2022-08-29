import * as React from "react";

import Image from "next/image";

export interface IShortCardListProps {
  className?: string;
  myVotes: number;
  myVotesPercentage: number;
}

export function MyVotesValue(props: IShortCardListProps) {
  return (
    <>
      <div className="flex-1 text-end flex-col justify-center items-center">
        <div className=" ">
          <span className="font-f13">{props.myVotes > 0 ? props.myVotes.toFixed(2) : "-"}</span>
        </div>
        <div className=" ">
          <span className="font-f13">
            {props.myVotesPercentage > 0 ? props.myVotesPercentage.toFixed(2) : null}
            {props.myVotesPercentage > 0 ? "%" : null}
          </span>
        </div>
      </div>
    </>
  );
}
