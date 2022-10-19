
export interface ISimpleButtonProps {
  onClick?: Function;
  text?: string;
}
export function SimpleButton(props: ISimpleButtonProps) {
  return <button onClick={() => props.onClick ? props.onClick() : {}} className="bg-cardBackGround border rounded-lg text-f12 text-text-500 px-3 py-[7px]  border-text-800/50 cursor-pointer hover:opacity-90">
                  {props.text}
    </button>;
}
  