import clsx from "clsx";
import { useState } from "react";

interface ISearchBarProps {}
function Banner(props: ISearchBarProps) {
  return (
    <div className="fixed w-full gradient h-[38px] flex items-center justify-center font-subtitle1 text-white">
      YOU ARE LIVE ON GHOSTNET, CLAIM YOUR FAUCET HERE
    </div>
  );
}

export default Banner;
