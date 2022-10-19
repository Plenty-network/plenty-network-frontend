import clsx from "clsx";
import info from "../../assets/icon/swap/info.svg";
import Image from "next/image";
import Button from "../Button/Button";
import { useEffect, useRef, useState } from "react";
import { ERRORMESSAGES } from "../../constants/swap";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../../redux";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";

interface ITransactionSettingsProps {
  onClick?: () => void | Promise<void>;
  show: boolean;
  setSettingsShow: any;
  className?: string;
  setSlippage: React.Dispatch<React.SetStateAction<string>>;
  slippage: string;
}
function TransactionSettingsLiquidity(props: ITransactionSettingsProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const refSetting = useRef(null);

  const dispatch = useDispatch<AppDispatch>();
  const walletAddress = useAppSelector((state) => state.wallet.address);

  const handleSlippage = (input: string | number) => {
    if (input === "" || isNaN(Number(input))) {
      props.setSlippage("");
    } else {
      props.setSlippage(input.toString());
    }
  };

  const handleAutoSlippage = () => {
    props.setSlippage("0.5");
  };
  useOutsideClick(refSetting, () => {
    props.setSettingsShow(false);
  });
  useEffect(() => {
    if (Number(props.slippage) > 30 && Number(props.slippage) <= 100) {
      setErrorMessage(ERRORMESSAGES.TRANSACTIONSETTINGSWARNING);
    } else if (Number(props.slippage) > 100) {
      setErrorMessage(ERRORMESSAGES.TRANSACTIONSETTINGSERROR);
    } else {
      setErrorMessage("");
    }
  }, [props.slippage]);
  return props.show ? (
    <div
      ref={refSetting}
      style={{ top: "0px" }}
      className={clsx(
        "z-20 absolute right-[10px]  md:-right-[1px]  bg-card-500 border border-text-700/[0.5] w-[250px] md:w-[319px] p-5 rounded-2xl fade-in-3 "
      )}
    >
      <div className="font-subtitle2">Transaction Settings</div>
      <div className="mt-2">
        <span className="font-caption1 text-text-200 ">Slippage tolerance</span>
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
      <div className="flex gap-1.5 mt-3">
        <div className=" ">
          <Button
            color="primary"
            width="w-[87px]"
            height="h-9"
            borderRadius="rounded-lg"
            onClick={handleAutoSlippage}
          >
            Auto
          </Button>
        </div>
        <div
          className={clsx(
            "border  rounded-lg h-9  py-2 px-3 font-body4 flex",
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
              placeholder="0.5"
              value={props.slippage}
              onChange={(e) => handleSlippage(e.target.value)}
            />
          </p>
          <p className="text-right">%</p>
        </div>
      </div>
      {errorMessage && (
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
      )}
    </div>
  ) : null;
}

export default TransactionSettingsLiquidity;
