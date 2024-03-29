import { Dropdown } from "../DropDown/Dropdown";

import { useEffect, useMemo, useRef, useState } from "react";
import * as React from "react";
import { ISelectNFT } from "./types";
import { VeNFT } from "../DropDown/VeNFT";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";

function SelectNFT(props: ISelectNFT) {
  return (
    <div className="md:flex md:items-center mr-3">
      <div className="hidden md:block text-white font-body1 px-[23px]">Select your veNFT:</div>
      <div>
        <VeNFT
          title={
            props.isfetching
              ? "loading..."
              : props.veNFTlist.length === 0
              ? "No veNFT available"
              : "No veNFTs selected"
          }
          Options={props.veNFTlist}
          isFetching={props.isfetching}
          selectedText={props.selectedText}
          onClick={props.setSelectedDropDown}
        />
      </div>
    </div>
  );
}

export default SelectNFT;
