import clsx from "clsx";
import info from "../../assets/icon/swap/info.svg";
import Image from "next/image";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { ERRORMESSAGES } from "../../constants/swap";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../../redux";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { Dropdown } from "../DropDown/Dropdown";
import { SettingsDropdown } from "../DropDown/Settings";
import epclose from "../../assets/icon/common/epclose.svg";
interface ITransactionSettingsProps {
  onClick?: () => void | Promise<void>;
  show: boolean;
  setSettingsShow: any;
  className?: string;
  setSlippage: React.Dispatch<React.SetStateAction<number>>;
  slippage: number;
}
function TransactionSettingsV3(props: ITransactionSettingsProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const refSetting = useRef(null);
  const scaleValue = ["Min", "Hours"];
  const [scale, setScale] = useState(scaleValue[0]);

  const handleSlippage = (input: string | number) => {
    if (input === "") {
      props.setSlippage(0);
    } else {
      props.setSlippage(Number(input));
    }
  };
  const handleClick = (value: number) => {
    props.setSlippage(Number(value));
  };
  // const [flag, setFlag] = useState(0);
  // const handleClick = (e: any, value: number) => {
  //   setFlag(1);
  //   if (value === 30) {
  //     setScale(scaleValue[0]);
  //   } else {
  //     setScale(scaleValue[1]);
  //   }
  //   props.setSlippage(Number(value));
  // };
  // useOutsideClick(refSetting, () => {
  //   props.setSettingsShow(false);
  // });
  // useEffect(() => {
  //   if (flag == 0) {
  //     if (scale === scaleValue[0]) {
  //       props.setSlippage(props.slippage);
  //     } else {
  //       props.setSlippage(props.slippage * 60);
  //     }
  //   }
  // }, [scale, flag]);

  // const handleDp = (value: string) => {
  //   setFlag(0);
  //   setScale(value);
  // };
  return props.show ? (
    <div
      ref={refSetting}
      style={{ top: "40px" }}
      className={clsx(
        "z-20 absolute right-[10px]  md:-right-[5px]  bg-card-500 border border-text-700/[0.5] w-[250px] md:w-[354px] p-5 rounded-2xl fade-in-3"
      )}
    >
      <div className="flex justify-between">
        <div className="font-subtitle2">Transaction settings</div>
        <div className="cursor-pointer" onClick={() => props.setSettingsShow(false)}>
          <Image src={epclose} width={"20px"} />
        </div>
      </div>

      <div className="mt-2">
        <span className="font-caption1 text-text-200 ">Transaction deadline</span>
        <span className="relative top-0.5 left-[5px]">
          <ToolTip
            toolTipChild={
              <div className="w-[200px] md:w-[250px]">
                Your transaction will revert if the price changes unfavorably by more than this
                percentage.
              </div>
            }
            id="tooltipD"
            position={Position.top}
          >
            <Image
              alt={"alt"}
              src={info}
              width={"11px"}
              height={"11px"}
              className="cursor-pointer"
            />
          </ToolTip>
        </span>
      </div>
      <div className="flex gap-1.5 mt-3 items-center">
        <div
          className={clsx(
            props.slippage === 30 ? "bg-primary-500  text-black" : "bg-muted-235 text-text-500",
            "rounded-lg w-[67px]  h-[30px] flex items-center justify-center font-body2 cursor-pointer"
          )}
          onClick={() => handleClick(30)}
        >
          30m
        </div>
        <div
          className={clsx(
            props.slippage === 60 ? "bg-primary-500  text-black" : "bg-muted-235 text-text-500",
            "rounded-lg w-[67px]  h-[30px] flex items-center justify-center font-body2 cursor-pointer"
          )}
          onClick={() => handleClick(60)}
        >
          1h
        </div>

        <div
          className={clsx(
            props.slippage === 120 ? "bg-primary-500  text-black" : "bg-muted-235 text-text-500",
            "rounded-lg w-[67px]  h-[30px] flex items-center justify-center font-body2 cursor-pointer"
          )}
          onClick={() => handleClick(120)}
        >
          2h
        </div>

        <div
          className={clsx(
            "border  rounded-lg h-[30px]  py-2 px-3 font-body4 flex w-[87px] items-center",
            errorMessage
              ? errorMessage === ERRORMESSAGES.TRANSACTIONSETTINGSWARNING
                ? "border-warning-500/[0.4] bg-wraning-500/[0.01]"
                : "border-error-500/[0.4] bg-error-500[0.01]"
              : "border-text-700/[0.5] bg-card-500"
          )}
        >
          <p>
            <input
              type="text"
              className="outline-none bg-card-500 text-white text-left w-full"
              placeholder="0.0s"
              value={props.slippage}
              onChange={(e) => handleSlippage(e.target.value)}
            />
          </p>
          <p className="text-right">m</p>
        </div>
        {/* <div>
          <SettingsDropdown
            title="Min"
            Options={["Min", "Hours"]}
            selectedText={scale}
            onClick={handleDp}
            className=""
          />
        </div> */}
      </div>
      {/* {errorMessage && (
        <div
          className={clsx(
            "font-mobile-400 text-right mt-1  ",
            errorMessage === ERRORMESSAGES.TRANSACTIONSETTINGSWARNING
              ? "text-warning-500"
              : "text-error-500"
          )}
        >
          {errorMessage}
        </div>
      )} */}
    </div>
  ) : null;
}

export default TransactionSettingsV3;
