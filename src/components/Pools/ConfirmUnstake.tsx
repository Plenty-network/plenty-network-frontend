import clsx from "clsx";
import Image from "next/image";
import arrowLeft from "../../../src/assets/icon/pools/arrowLeft.svg";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import Button from "../Button/Button";
import { tokenParameterLiquidity } from "../Liquidity/types";

interface IConfirmUnStakeLiquidity {
  tokenIn: tokenParameterLiquidity;
  unStakeInput: string | number;
  tokenOut: tokenParameterLiquidity;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  handleOperation: () => void;
}
export function ConfirmUnStakeLiquidity(props: IConfirmUnStakeLiquidity) {
  return (
    <>
      <div className="flex">
        <div className="cursor-pointer" onClick={() => props.setScreen("1")}>
          <Image alt={"alt"} src={arrowLeft} />
        </div>
        <div className="mx-2 text-white font-title3">Confirm unstaking </div>
        {/* <div className="relative top-[2px] cursor-pointer">
          <Image alt={"alt"} src={info} />
        </div> */}
      </div>
      <div className="border rounded-2xl mt-[24px] border-text-800 bg-card-200 pt-[20px] px-4 pb-5">
        <div className=" font-body4 text-text-250">Your unstaking</div>
        <div className="mt-1 text-white font-title2">{props.unStakeInput} PNLP</div>
      </div>

      <div className="mt-5">
        <Button color={"primary"} onClick={props.handleOperation}>
          Confirm
        </Button>
      </div>
    </>
  );
}
