import * as React from "react";

import Link from "next/link";
export interface IWalletNotConnectedProps {
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NoLocks(props: IWalletNotConnectedProps) {
  return (
    <div className="flex justify-center items-center  mt-2 md:mt-12  text-text-200 flex-col font-title3 ">
      No Locks
      <div className="text-text-500 font-body3 mt-2">You do not own any veNFT</div>
      <div className="border-b border-navBarBorder/[0.4] w-[120px] mt-[14px]"></div>
      <div className="cursor-pointer">
        <div
          className="border border-primary-500 text-primary-500 font-body4 px-4 bg-primary-500/[0.05] h-[48px] flex items-center mt-5 rounded-lg"
          onClick={() => props.setShowCreateLockModal(true)}
        >
          Create Locks
        </div>
      </div>
    </div>
  );
}
