import clsx from "clsx";
import Image from "next/image";

import playTutorial from "../../assets/icon/poolsv3/playTutorial.svg";
import * as React from "react";
import playIcon from "../../assets/icon/pools/playIcon.svg";
import { store, useAppSelector } from "../../redux";
import { VideoModal } from "../Modal/videoModal";
import { InputSearchBox } from "../Pools/Component/SearchInputBox";
import { ToolTip } from "../Tooltip/TooltipAdvanced";
import Tutorial from "../Tutorial";
export interface IHeadInfoProps {
  className?: string;
  title: string;
  searchValue: string;
  setSearchValue: Function;
  toolTipContent: string;
  handleCreateLock?: () => void;
  isFirst?: boolean;
  onClick?: () => void;
  videoLink?: string;
}

export default function HeadInfo(props: IHeadInfoProps) {
  // const userAddress = store.getState().wallet.address;
  const userAddress = useAppSelector((state) => state.wallet.address);
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [showTutorial, setShowTutorial] = React.useState(false);
  return (
    <div
      className={`${props.className} flex h-[68px] justify-between items-center border-b border-b-borderCommon py-2 pt-2 md:pt-2 bg-cardBackGround`}
    >
      <div className="flex items-center gap-1">
        <div className="p-4 text-f18 font-medium text-white">
          {props.title ? props.title : "Pools"}
        </div>
        {true && (
          <ToolTip
            classNameToolTipContainer={`playIconTooltip-right`}
            toolTipChild={
              props.toolTipContent ? (
                <ul className="list-disc w-[331px]  font-normal pl-4">
                  <li>Watch how to add liquidity, stake, and earn PLY</li>

                  <li>Watch Tutorial</li>
                </ul>
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
            {props.title === "Pools V3" && (
              <span className="ml-2.5 relative top-[4px]">
                <Image
                  src={playTutorial}
                  onClick={() => setShowTutorial(true)}
                  height={"28px"}
                  width={"28px"}
                  className="cursor-pointer hover:opacity-90 "
                />
              </span>
            )}
          </ToolTip>
        )}
      </div>

      {/* <InputSearchBox
        className={clsx("md:hidden", props.title === "Vote" && "hidden")}
        value={props.searchValue}
        onChange={props.setSearchValue}
      /> */}
      {showTutorial && <Tutorial show={showTutorial} setShow={setShowTutorial} />}
      {showVideoModal && (
        <VideoModal
          closefn={setShowVideoModal}
          linkString={props.videoLink ? props.videoLink : "HtDOhje7Y5A"}
        />
      )}
      {props.title === "Vote" ? (
        <div
          className={clsx(
            "ml-auto h-[50px] font-subtitle2 md:font-subtitle4 flex items-center px-4 md:px-[32px] text-primary-500 rounded-lg bg-primary-500/[0.1] hover:bg-primary-500/[0.2] mr-4 md:mr-0",
            "cursor-pointer"
          )}
          onClick={props.handleCreateLock}
        >
          Create Lock
        </div>
      ) : (
        <></>
      )}
      {props.title === "Pools" || props.title === "Pools V3" ? (
        <div
          className={clsx(
            "ml-auto h-[50px] font-subtitle2 md:font-title3-bold flex items-center px-3 md:px-[32px] text-primary-500 rounded-lg bg-primary-500/[0.1] hover:bg-primary-500/[0.2] mr-0",
            "cursor-pointer"
          )}
          onClick={props.onClick}
        >
          New pool
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
