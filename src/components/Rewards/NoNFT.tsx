import * as React from "react";

export interface IWalletNotConnectedProps {
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NoNFTAvailable(props: IWalletNotConnectedProps) {
  return (
    <div className="flex justify-center items-center  mt-2 md:mt-12  text-text-200 flex-col font-title3 ">
      No veNFT Available
      <div className="text-text-500 font-body3 mt-2">
        You do not have any veNFT. please create a lock
      </div>
      <div className="border-b border-navBarBorder/[0.4] w-[120px] mt-[14px]"></div>
      <div
        className="cursor-pointer border border-primary-500 text-primary-500 font-body4 px-4 bg-primary-500/[0.05] h-[48px] flex items-center mt-5"
        onClick={() => props.setShowCreateLockModal(true)}
      >
        Create Lock
      </div>
    </div>
  );
}
