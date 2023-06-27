import * as React from "react";
import { tokenParameterLiquidity } from "../Liquidity/types";
import IncreaseLiq from "./Increaseliq";
import { ActiveIncDecState, ActivePopUp } from "./ManageTabV3";
import DecreaseLiq from "./DecreaseLiq";
import { BalanceNat } from "../../api/v3/types";
import clsx from "clsx";

interface IIncreaseDecreaseLiqMainProps {
  setActiveStateIncDec: React.Dispatch<React.SetStateAction<ActiveIncDecState | string>>;
  activeStateIncDec: ActiveIncDecState | string;

  tokenIn: tokenParameterLiquidity;
  tokenOut: tokenParameterLiquidity;
  firstTokenAmount: string | number;
  secondTokenAmount: string | number;
  setScreen: React.Dispatch<React.SetStateAction<ActivePopUp>>;

  setFirstTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  setSecondTokenAmount: React.Dispatch<React.SetStateAction<string | number>>;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  userBalances: {
    [key: string]: string;
  };
  setRemove: React.Dispatch<React.SetStateAction<BalanceNat>>;
  remove: BalanceNat;
  setRemovePercentage: React.Dispatch<React.SetStateAction<number>>;
  removePercentage: number;
}
export interface ITabProps {
  isActive: boolean;
  text: string;
  onClick: Function;
}

const active = "border border-primary-500 rounded-xl bg-primary-500/20 text-white";

export function Tab(props: ITabProps) {
  const { isActive, text, onClick } = props;
  return (
    <div
      onClick={() => onClick()}
      className={`flex justify-center cursor-pointer items-center flex-1 py-1.5 ${
        isActive
          ? active
          : " hover:border-text-500/[0.8] hover:text-white/[0.8] rounded-r-xl text-white"
      }`}
    >
      {text}
    </div>
  );
}
function IncreaseDecreaseLiqMain(props: IIncreaseDecreaseLiqMainProps) {
  const ListOfTabs = ["Increase liquidity", "Remove liquidity"];
  return (
    <>
      <div
        className={`flex border border-shimmer-300 row justify-between mt-3 bg-background-600 text-text-400 text-f16  rounded-xl `}
      >
        {ListOfTabs.map((tab, i) => (
          <Tab
            key={tab + i}
            isActive={props.activeStateIncDec === tab}
            text={tab}
            onClick={() => props.setActiveStateIncDec(tab)}
          />
        ))}
      </div>

      {props.activeStateIncDec === ActiveIncDecState.Increase ? (
        <IncreaseLiq
          setScreen={props.setScreen}
          firstTokenAmount={props.firstTokenAmount}
          secondTokenAmount={props.secondTokenAmount}
          tokenIn={props.tokenIn}
          tokenOut={props.tokenOut}
          setShow={props.setShow}
          userBalances={props.userBalances}
          setSecondTokenAmount={props.setSecondTokenAmount}
          setFirstTokenAmount={props.setFirstTokenAmount}
        />
      ) : (
        <DecreaseLiq
          setShow={props.setShow}
          setScreen={props.setScreen}
          firstTokenAmount={props.firstTokenAmount}
          secondTokenAmount={props.secondTokenAmount}
          tokenIn={props.tokenIn}
          tokenOut={props.tokenOut}
          setRemove={props.setRemove}
          remove={props.remove}
          userBalances={props.userBalances}
          setSecondTokenAmount={props.setSecondTokenAmount}
          setFirstTokenAmount={props.setFirstTokenAmount}
          removePercentage={props.removePercentage}
          setRemovePercentage={props.setRemovePercentage}
        />
      )}
    </>
  );
}

export default IncreaseDecreaseLiqMain;
