import Image from "next/image";
import * as React from "react";
import searchImagr from "../../../assets/icon/common/searchIcon.svg";

export interface IInputSearchBoxProps {
  className?: string;
  value: string;
  onChange: Function;
}

export function InputSearchBox(props: IInputSearchBoxProps) {
  const [isActive, setIsActive] = React.useState(false);
  return (
    <div
      className={`flex h-[43px] md:h-[38px] py-2  px-2 bg-primary-850 md:mr-4 md:w-[265px] gap-4 border  rounded-lg ${
        props.className
      } ${
        isActive && props.value === ""
          ? "border-[0.8px] border-primary-500"
          : props.value !== "" && isActive
          ? "border-border-500"
          : "border-border-500/50"
      }`}
    >
      <Image src={searchImagr} />
      <input
        value={props.value}
        placeholder="Search"
        className="text-white  text-left border-0 bg-primary-850 placeholder-text-600 font-medium2 text-f14 outline-none "
        onChange={(e) => props.onChange(e.target.value)}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
      />
    </div>
  );
}
