import * as React from "react";

export interface IWalletNotConnectedProps {}

export function NoPoolsPosition(props: IWalletNotConnectedProps) {
  return (
    <div className="flex justify-center items-center  mt-2 md:mt-12  text-text-200 flex-col font-title3 ">
      No PLY emissions
      <div className="text-text-500 font-body3 mt-2">
        You do not have active Liquidity positions
      </div>
      <div className="border-b border-navBarBorder/[0.4] w-[120px] mt-[14px]"></div>
      <div className="border border-primary-500 text-primary-500 font-body4 px-4 bg-primary-500/[0.05] h-[48px] flex items-center mt-5">
        View Pools
      </div>
    </div>
  );
}
