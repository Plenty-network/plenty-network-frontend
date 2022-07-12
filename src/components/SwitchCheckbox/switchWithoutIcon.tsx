import * as React from 'react';
export interface ISwitchProps {
  name?: string;
  id: string;
  onChange?: () => void;
}

export function Switch(props: ISwitchProps) {
  return (
    <span className="switchWithoutIcon relative -top-[18px]">
      <input type="checkbox" id={props.id} onChange={props.onChange} />
      <label htmlFor={props.id}>{props.name ? props.name : 'toggle'}</label>
    </span>
  );
}
