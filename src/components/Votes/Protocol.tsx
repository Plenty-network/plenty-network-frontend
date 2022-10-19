import { Dropdown } from "../DropDown/Dropdown";
import * as React from "react";

function Protocol(props: {
  isSelected: boolean;
  setSelectedDropDown: Function;
  selectedDropDown: any;
}) {
  let Options = ["My votes", "Protocol"];
  if (!props.isSelected) {
    Options = [];
  }
  return (
    <div>
      <Dropdown
        isDisabled={!props.isSelected}
        title="Protocol"
        Options={Options}
        selectedText={props.selectedDropDown}
        onClick={props.setSelectedDropDown}
        className=""
      />
    </div>
  );
}

export default Protocol;
