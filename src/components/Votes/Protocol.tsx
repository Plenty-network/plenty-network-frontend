import { Dropdown } from "../DropDown/Dropdown";
import * as React from "react";

function Protocol(props: {
  Options: string[];
  isSelected: boolean;
  setSelectedDropDown: Function;
  selectedDropDown: any;
}) {
  // if (!props.isSelected) {
  //   props.Options = [];
  // }
  return (
    <div>
      <Dropdown
        isDisabled={!props.isSelected}
        title="Protocol"
        Options={props.Options}
        selectedText={props.selectedDropDown}
        onClick={props.setSelectedDropDown}
        className=""
      />
    </div>
  );
}

export default Protocol;
