import clsx from "clsx";
import Image from "next/image";
import * as React from "react";
import playIcon from "../../assets/icon/pools/playIcon.svg";
import { store } from "../../redux";
import { VideoModal } from "../Modal/videoModal";
import { InputSearchBox } from "../Pools/Component/SearchInputBox";
import { ToolTip } from "../Tooltip/TooltipAdvanced";
export interface IHeadInfoProps {
  className?: string;
  title: string;
  searchValue: string;
  setSearchValue: Function;
  toolTipContent: string;
  handleCreateLock?: () => void;
  isFirst?: boolean;
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
          classNameToolTipContainer={`playIconTooltip-right`}
          toolTipChild={
            props.toolTipContent ? (
              <p className="w-[200px] md:w-[312px]">{props.toolTipContent}</p>
            ) : (
              <p className="w-[200px] md:w-[312px]">
                Watch how to add liquidity, stake, and earn PLY
              </p>
            )
          }
          classNameAncorToolTip="pushtoCenter"
          isShowInnitially={props.isFirst ? true : false}
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
            "ml-auto h-[50px] font-subtitle2 md:font-subtitle3 flex items-center px-4 md:px-[32px] text-primary-500 rounded-lg bg-primary-500/[0.1] hover:bg-primary-500/[0.2] mr-4 md:mr-0",
            userAddress ? "cursor-pointer" : "cursor-not-allowed"
          )}
          onClick={userAddress ? props.handleCreateLock : () => {}}
        >
          Create Lock
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
