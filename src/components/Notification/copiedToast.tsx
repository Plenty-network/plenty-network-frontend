import Image from "next/image";
import * as React from "react";
import truncateMiddle from "truncate-middle";
import check from "../../assets/icon/common/copied-check.svg";

export interface ICopiedToastProps {
  address: string;
}

export default function CopiedToast(props: ICopiedToastProps) {
  const ele = document.getElementById("toast");
  setTimeout(() => {
    ele && ele.classList.add("tooltipAnimation");
  }, 4000);
  setTimeout(() => {
    ele && ele.classList.remove("tooltipAnimation");
  }, 6000);

  return (
    <div
      id="toast"
      className="flex gap-1.5 h-[36px] items-center justify-center pl-3 pr-4 bg-blue-600 rounded-2xl absolute xl:bottom-[45px] w-[340px] bottom-[70px]  mx-auto left-0 right-0"
    >
      <div className="relative top-[3px]">
        <Image src={check} alt="alt" />
      </div>
      <div className="font-subtitle3">{`Copied ${truncateMiddle(
        props.address as string,
        4,
        4,
        "..."
      )} address to clipboard`}</div>
    </div>
  );
}
