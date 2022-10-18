import clsx from "clsx";
import Image from "next/image";

import "animate.css";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import Button from "../Button/Button";
import { tokenParameterLiquidity } from "../Liquidity/types";
import { IVePLYData } from "../../api/stake/types";
import { VePLY } from "../DropDown/VePLY";

interface IConfirmStakeLiquidity {
  tokenIn: tokenParameterLiquidity;
  stakeInput: string | number;
  tokenOut: tokenParameterLiquidity;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  handleOperation: () => void;
  setSelectedDropDown: React.Dispatch<React.SetStateAction<IVePLYData>>;
  selectedDropDown: IVePLYData;

  vePLYOptions: IVePLYData[];
}

export function ConfirmStakeLiquidity(props: IConfirmStakeLiquidity) {
  return (
    <>
      <div className="flex">
        <div className="cursor-pointer" onClick={() => props.setScreen("1")}>
          <Image alt={"alt"} src={arrowLeft} />
        </div>
        <div className="mx-2 text-white font-title3">Confirm staking </div>
        {/* <div className="relative top-[2px] cursor-pointer">
          <Image alt={"alt"} src={info} />
        </div> */}
      </div>
      <div
        className={clsx(
          "border rounded-2xl mt-[24px] border-text-800 bg-card-200  px-4 pb-5",
          props.selectedDropDown.tokenId === "" ? "pt-[28px]" : ""
        )}
      >
        <div
          className={clsx(
            "flex pl-[5px] px-[10px] items-center",
            props.selectedDropDown.tokenId === "" ? "block" : "hidden"
          )}
        >
          <div className="text-text-400 font-body1 w-[208px]">
            Are you sure you want to continue without boosting your rewards?
          </div>
          <div className="ml-auto">
            {" "}
            <VePLY
              Options={props.vePLYOptions}
              selectedText={props.selectedDropDown}
              onClick={props.setSelectedDropDown}
              isConfirmStake={true}
            />
          </div>
        </div>
        <div className="flex items-end">
          <p>
            <div className="mt-4 font-body4 text-text-250">You’re staking</div>
            <div className="mt-1 text-white font-title2">
              {props.stakeInput ? props.stakeInput : 0} PNLP
            </div>
          </p>
          <p
            className={clsx(
              "ml-auto",
              props.selectedDropDown.tokenId !== ""
                ? "block animate__animated animate__fadeInDown animate__faster"
                : "hidden"
            )}
          >
            <VePLY
              Options={props.vePLYOptions}
              selectedText={props.selectedDropDown}
              onClick={props.setSelectedDropDown}
              isConfirmStake={true}
            />
          </p>
        </div>
      </div>

      <div className="mt-5">
        <Button color={"primary"} onClick={props.handleOperation}>
          Confirm
        </Button>
      </div>
    </>
  );
}
