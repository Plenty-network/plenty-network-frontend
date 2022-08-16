import Image from 'next/image';
import * as React from 'react';
import playIcon from '../../assets/icon/pools/playIcon.svg';
import { VideoModal } from '../Modal/videoModal';
import { InputSearchBox } from '../Pools/Component/SearchInputBox';
import Tooltip from '../Tooltip/Tooltip';
import { Position, ToolTip, TooltipType } from '../Tooltip/TooltipAdvanced';
export interface IHeadInfoProps {
  className?: string;
  title: string;
  searchValue: string;
  setSearchValue: Function;
  toolTipContent: string;
  handleCreateLock?: () => void;
}

export default function HeadInfo(props: IHeadInfoProps) {
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  return (
    <div
      className={`${props.className} flex justify-between items-center border-b border-b-borderCommon py-2 pt-7 md:pt-2 bg-cardBackGround`}
    >
      <div className="flex gap-2">
        <div className="p-2 text-f18 font-medium text-white">Pools</div>
        <ToolTip
          message="Watch how to add liquidity, stake, and earn PLY. "
          classNameAncorToolTip="pushtoCenter"
          isShowInnitially={true}
        >
          <Image
            src={playIcon}
            onClick={() => setShowVideoModal(true)}
            height={'28px'}
            width={'28px'}
            className="cursor-pointer hover:opacity-90"
          />
        </ToolTip>
      </div>
      <InputSearchBox
        className="md:hidden"
        value={props.searchValue}
        onChange={props.setSearchValue}
      />
      {showVideoModal && (
        <VideoModal closefn={setShowVideoModal} linkString={'Bh5zuEI4M9o'} />
      )}
      {props.title === 'Vote' && (
        <div
          className="ml-auto h-[52px] flex items-center px-[32px] text-primary-500 rounded-lg bg-primary-500/[0.1] mr-[32px]"
          onClick={props.handleCreateLock}
        >
          Create Lock
        </div>
      )}
    </div>
  );
}
