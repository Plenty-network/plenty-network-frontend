import { Dropdown } from "../DropDown/Dropdown";

import { useEffect, useMemo, useRef, useState } from "react";
import * as React from "react";

function SelectNFT() {
  const [selectedDropDown, setSelectedDropDown] = useState("");
  return (
    <div className="flex items-center">
      <div className="text-white font-body1 px-[23px]">Select your veNFT:</div>
      <div>
        <Dropdown
          title="No NFTs selected"
          Options={["one", "two", "three"]}
          selectedText={selectedDropDown}
          onClick={setSelectedDropDown}
        />
      </div>
    </div>
  );
}

export default SelectNFT;
