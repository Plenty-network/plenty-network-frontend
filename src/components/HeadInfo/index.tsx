import Image from "next/image";
import clsx from "clsx";
import * as React from "react";
import playIcon from "../../assets/icon/pools/playIcon.svg";
import { VideoModal } from "../Modal/videoModal";
import { InputSearchBox } from "../Pools/Component/SearchInputBox";
import Tooltip from "../Tooltip/Tooltip";
import { Position, ToolTip, TooltipType } from "../Tooltip/TooltipAdvanced";
import { store } from "../../redux";
export interface IHeadInfoProps {
  className?: string;
  title: string;
  searchValue: string;
  setSearchValue: Function;
  toolTipContent: string;
  handleCreateLock?: () => void;
}

export default function HeadInfo(props: IHeadInfoProps) {
  const userAddress = store.getState().wallet.address;
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  return (
    <div
      className={`${props.className} flex h-[68px] justify-between items-center border-b border-b-borderCommon py-2 pt-2 md:pt-2 bg-cardBackGround`}
    >
      <div className="flex gap-1">
        <div className="p-2 text-f18 font-medium text-white">
          {props.title ? props.title : "Pools"}
        </div>
        <ToolTip
          message={
            props.toolTipContent
              ? props.toolTipContent
              : "Watch how to add liquidity, stake, and earn PLY"
          }
          classNameAncorToolTip="pushtoCenter"
          isShowInnitially={props.toolTipContent ? true : false}
        >
          <Image
            src={playIcon}
            onClick={() => setShowVideoModal(true)}
            height={"28px"}
            width={"28px"}
            className="cursor-pointer hover:opacity-90"
          />
        </ToolTip>
      </div>
      <InputSearchBox
        className={clsx("md:hidden", props.title === "Vote" && "hidden")}
        value={props.searchValue}
        onChange={props.setSearchValue}
      />
      {showVideoModal && <VideoModal closefn={setShowVideoModal} linkString={"Bh5zuEI4M9o"} />}
      {props.title === "Vote" ? (
        <div
          className={clsx(
            "ml-auto h-[50px] font-subtitle2 md:font-subtitle4 flex items-center px-4 md:px-[32px] text-primary-500 rounded-lg bg-primary-500/[0.1] hover:bg-primary-500/[0.2] mr-4 md:mr-0",
            userAddress ? "cursor-pointer" : "cursor-not-allowed"
          )}
          onClick={userAddress ? props.handleCreateLock : () => {}}
        >
          Create Lock
        </div>
      ):(<></>)}
    </div>
  );
}
