import Image from "next/image";
import { PopUpModal } from "../Modal/popupModal";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import info from "../../../src/assets/icon/common/infoIcon.svg";
import doneCheck from "../../assets/icon/airdrop/doneCheck.svg";
import * as React from "react";
import { useState } from "react";

import checkGrey from "../../assets/icon/airdrop/checkGrey.svg";
import link from "../../assets/icon/pools/external_violet.svg";
import HeaderSelection from "./HeaderSelection";
import List from "./DisclaimerList";
import Button from "../Button/Button";
interface IDisclaimerProps {
  show: boolean;
  setChain: React.Dispatch<React.SetStateAction<ChainAirdrop>>;
  chain: ChainAirdrop;
  setShow: any;
}
export enum ChainAirdrop {
  Tezos = "Tezos",
  Other_chain = "Other chain",
}
function Disclaimer(props: IDisclaimerProps) {
  const closeModal = () => {
    props.setShow(false);
  };
  const [isCheck, setIsCheck] = useState(false);

  return props.show ? (
    <PopUpModal onhide={closeModal} className="  md:w-[602px] md:max-w-[602px]">
      {
        <>
          <div className="flex ">
            <div className="mr-2 text-white font-title3">Know eligibility criteria</div>
            <div className="relative top-[2px]">
              <ToolTip
                id="tooltip2"
                disable={true}
                position={Position.top}
                toolTipChild={
                  <div className="w-[100px] md:w-[250px]">
                    Bribe voters to direct emissions towards your pool.
                  </div>
                }
              >
                <Image alt={"alt"} src={info} />
              </ToolTip>
            </div>
          </div>
          <div className="font-body3 mt-3">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s. Please connect your
            wallet to confirm your eligibility.
            <span className="font-body4 text-primary-500 ml-0.5">Know how?</span>
            <span className="relative top-0.5 ml-1">
              <Image src={link} />
            </span>
          </div>
          <div className="border-t border-text-800 my-4"></div>
          <HeaderSelection chain={props.chain} setChain={props.setChain} isDisclaimer={true} />
          <div className="mt-4">
            <List />
          </div>
          <div className="border-t border-text-800 my-4"></div>
          <div className="flex items-center" onClick={() => setIsCheck(!isCheck)}>
            <p>
              <Image src={isCheck ? doneCheck : checkGrey} />
            </p>
            <p className="font-body4 text-text-50 ml-2  -mt-1">I agree, do not show this again</p>
          </div>
          <div className="mt-[18px]">
            <Button
              color={isCheck ? "primary" : "disabled"}
              onClick={isCheck ? () => props.setShow(false) : () => {}}
            >
              Continue
            </Button>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default Disclaimer;
