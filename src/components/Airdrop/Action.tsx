import BigNumber from "bignumber.js";

export interface IAction {
  action: string;
  value?: BigNumber;
}

function Action(props: IAction) {
  return (
    <div className="flex gap-1 font-body1">
      {props.action}
      {props.value && <span className="font-subtitle2">{props.value.toFixed(2)} PLY</span>}
    </div>
  );
}

export default Action;
