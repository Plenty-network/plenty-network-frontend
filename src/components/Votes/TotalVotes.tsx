import * as React from "react";

export interface IShortCardListProps {
  className?: string;
}

export function TotalVotes(props: IShortCardListProps) {
  return (
    <>
      <div className="flex-1 text-right  justify-center items-center">
        <div className="font-f13 text-text-50">130k</div>
        <div className="font-subtitle4 relative top-[10px]">37.48%</div>
      </div>
    </>
  );
}
