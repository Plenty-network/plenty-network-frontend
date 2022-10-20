import * as React from "react";

export interface IWalletNotConnectedProps {}

export function NoSearchResult(props: IWalletNotConnectedProps) {
  return (
    <div className="flex justify-center items-center  mt-2 md:mt-12  text-text-200 flex-col font-title3 ">
      No search results found!
    </div>
  );
}
