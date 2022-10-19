import * as React from 'react';

export interface IInputTextProps {
  value?: string | number;
  onChange?: Function;
}

export function InputText(props: IInputTextProps) {
  return (
    <input
      type="text"
      className="text-white bg-muted-200/[0.1] text-left border-0 font-medium2  lg:font-medium1 outline-none w-[100%] placeholder:text-text-400"
      value={props.value}
      placeholder="0.0"
      onChange={(e) => (props.onChange ? props.onChange(e.target.value) : {})}
    />
  );
}
