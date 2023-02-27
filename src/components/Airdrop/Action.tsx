import BigNumber from "bignumber.js";
import Link from "next/link";

export interface IAction {
  action: string;
  value?: BigNumber;
  href: string;
  onclick?: () => void;
}

function Action(props: IAction) {
  return props.href && props.action.toLowerCase() === "take action" ? (
    <Link href={props.href}>
      <div className="flex gap-1 font-body1">
        {props.action}
        {props.value && <span className="font-subtitle2">{props.value.toFixed(2)} PLY</span>}
      </div>
    </Link>
  ) : (
    <div className="flex gap-1 font-body1" onClick={props.onclick ? props.onclick : () => {}}>
      {props.action}
      {props.value && <span className="font-subtitle2">{props.value.toFixed(2)} PLY</span>}
    </div>
  );
}

export default Action;
