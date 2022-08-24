import * as React from "react";
import { RangeSlider } from "../RangeSlider";

export interface IMyVotesProps {
  isMobile: boolean;
}

export function MyVotes(props: IMyVotesProps) {
  return (
    <div className="flex">
      <RangeSlider isMobile={props.isMobile} />
    </div>
  );
}
