import * as React from "react";
import { ISelectNFT } from "./types";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { VeNFTLocks } from "./VeNFTLocks";

function SelectNFTLocks(props: ISelectNFT) {
  return (
    <div className="flex items-center mr-3">
      <div className="block text-white font-body1 px-2 md:px-[23px]">Select your veNFT:</div>
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
