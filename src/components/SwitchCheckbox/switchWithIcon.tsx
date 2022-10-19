import * as React from 'react';
import { generateRandomString } from '../../utils/commonUtils';
export interface ISwitchProps {
  name?: string;
  id?: string;
  onChange?: () => void;
  isChecked?: boolean;
}

export function SwitchWithIcon(props: ISwitchProps) {
  const idForIcon=props.id?props.id:generateRandomString(8);
  return (
    <span className="switchWithIcon relative -top-[18px]">
      <input
        type="checkbox"
        id={idForIcon}
        onChange={props.onChange}
        checked={props.isChecked}
      />
      <label htmlFor={idForIcon}>{props.name ? props.name : 'toggle'}</label>
    </span>
  );
}
