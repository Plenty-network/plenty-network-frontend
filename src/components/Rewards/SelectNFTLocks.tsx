import { Dropdown } from "../DropDown/Dropdown";

import { useEffect, useMemo, useRef, useState } from "react";
import * as React from "react";
import { ISelectNFT } from "./types";
import { VeNFT } from "../DropDown/VeNFT";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { VeNFTLocks } from "./VeNFTLocks";

function SelectNFTLocks(props: ISelectNFT) {
  return (
    <div className="md:flex md:items-center mr-3">
      <div className="hidden md:block text-white font-body1 px-[23px]">Select your veNFT:</div>
      <div>
        {props.veNFTlist.length === 0 ? (
          <ToolTip
            message={"No VeNFT available, please create a lock "}
            id="tooltip1"
            position={Position.top}
          >
            <VeNFTLocks
              title={props.veNFTlist.length === 0 ? "No veNFT available" : "No NFTs selected"}
              Options={props.veNFTlist}
              selectedText={props.selectedText}
              onClick={props.setSelectedDropDown}
            />
          </ToolTip>
        ) : (
          <VeNFTLocks
            title="No NFTs selected"
            Options={props.veNFTlist}
            selectedText={props.selectedText}
            onClick={props.setSelectedDropDown}
          />
        )}
      </div>
    </div>
  );
}

export default SelectNFTLocks;
