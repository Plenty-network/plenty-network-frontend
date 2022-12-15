import clsx from "clsx";
import { useState } from "react";
import Image from "next/image";
import arrowDown from "../../assets/icon/swap/arrowDown.svg";
import arrowDownViolet from "../../assets/icon/swap/arrowDownViolet.svg";

import fallback from "../../assets/icon/pools/fallback.png";
import { changeSource, imageExists } from "../../api/util/helpers";
import { useAppSelector } from "../../redux";
import { tokenIcons } from "../../constants/tokensList";

interface ITokenDropdownProps {
  tokenIcon?: any;
  onClick?: () => void | Promise<void>;
  tokenName: string;
  className?: string;
  isArrow?: boolean;
  tokenSymbol: string;
}
function TokenDropdown(props: ITokenDropdownProps) {
  const TOKEN = useAppSelector((state) => state.config.tokens);
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
          "flex items-center px-2 py-2.5 md:p-3 rounded-xl border border-text-800  font-mobile-text md:font-title3 text-white  content-center justify-center h-[50px] ",
          !props.isArrow && "hover:border-text-700",
          !props.isArrow && isTokenSelect && "border-primary-500/[0.7]"
        )}
        onClick={onClickToken}
        {...props}
      >
        <span className="h-[24px] w-[24px]">
          <img
            alt={"alt"}
            src={
              tokenIcons[props.tokenSymbol]
                ? tokenIcons[props.tokenSymbol].src
                : TOKEN[props.tokenSymbol.toString()]?.iconUrl
                ? TOKEN[props.tokenSymbol.toString()].iconUrl
                : `/assets/Tokens/fallback.png`
            }
            height={"24px"}
            width={"24px"}
            onError={changeSource}
          />
        </span>
        <span className="mx-2 md:mx-2 relative top-[0px]">
          <span>{props.tokenName}</span>
        </span>
        {props.isArrow ? null : (
          <span className="md:ml-px relative top-[3px] ">
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
