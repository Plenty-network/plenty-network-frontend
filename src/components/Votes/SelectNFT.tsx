import { Dropdown } from "../DropDown/Dropdown";

import { useEffect, useMemo, useRef, useState } from "react";
import * as React from "react";
import { ISelectNFT } from "./types";
import { VeNFT } from "../DropDown/VeNFT";

function SelectNFT(props: ISelectNFT) {
  return (
    <div className="md:flex md:items-center">
      <div className="hidden md:block text-white font-body1 px-[23px]">Select your veNFT:</div>
      <div>
        <VeNFT
          title="No NFTs selected"
          Options={props.veNFTlist}
          selectedText={props.selectedText}
          onClick={props.setSelectedDropDown}
        />
      </div>
    </div>
  );
}

export default SelectNFT;
