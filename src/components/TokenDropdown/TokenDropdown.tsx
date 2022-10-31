import clsx from "clsx";
import { useState } from "react";
import Image from "next/image";
import arrowDown from "../../assets/icon/swap/arrowDown.svg";
import arrowDownViolet from "../../assets/icon/swap/arrowDownViolet.svg";

interface ITokenDropdownProps {
  tokenIcon?: any;
  onClick?: () => void | Promise<void>;
  tokenName: string;
  className?: string;
  isArrow?: boolean;
}
function TokenDropdown(props: ITokenDropdownProps) {
  const [isTokenSelect, setIsTokenSelect] = useState(false);
  const onClickToken = () => {
    props.onClick;
    setIsTokenSelect(true);
    setTimeout(() => {
      setIsTokenSelect(false);
    }, 1000);
  };
  if (props.tokenIcon) {
    return (
      <button
        className={clsx(
          " px-2 py-2.5 md:p-3 rounded-xl border border-text-800 hover:border-text-700 font-mobile-text md:font-title3 text-white  content-center justify-center h-[50px] ",
          isTokenSelect && "border-primary-500/[0.7]"
        )}
        onClick={onClickToken}
        {...props}
      >
        <span className="h-[24px] w-[24px]">
          <Image alt={"alt"} src={props.tokenIcon} height={"24px"} width={"24px"} />
        </span>
        <span className="mx-2 md:mx-2 relative -top-[6px]">
          <span>{props.tokenName}</span>
        </span>
        {props.isArrow ? null : (
          <span className="md:ml-px relative -top-[1px] ">
            <Image alt={"alt"} src={arrowDown} height={"20px"} width={"20px"} />
          </span>
        )}
      </button>
    );
  } else {
    return (
      <button
        className={clsx(
          " h-[50px] px-2 py-[15px] md:p-3 rounded-xl border text-center border-primary-500/[0.5] font-mobile-text md:font-title3 text-primary-500 flex content-center",
          isTokenSelect && "border-primary-500/[0.7]",
          "selectAtoken"
        )}
        onClick={props.onClick}
        {...props}
      >
        <span>{props.tokenName}</span>
        <span className="ml-2">
          <Image alt={"alt"} src={arrowDownViolet} />
        </span>
      </button>
    );
  }
}

export default TokenDropdown;
