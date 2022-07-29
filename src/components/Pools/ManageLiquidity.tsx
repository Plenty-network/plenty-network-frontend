import * as React from 'react';
import Liquidity from '../Liquidity';
import { PopUpModal } from '../Modal/popupModal';
import { VideoModal } from '../Modal/videoModal';
import { InfoIconToolTip } from '../Tooltip/InfoIconTooltip';
import {
  ActiveLiquidity,
  ManageLiquidityHeader,
} from './ManageLiquidityHeader';
import playBtn from '../../assets/icon/common/playBtn.svg';
import Image from 'next/image';
import ConfirmAddLiquidity from '../Liquidity/ConfirmAddLiquidity';
import ConfirmRemoveLiquidity from '../Liquidity/ConfirmRemoveLiquidity';

export interface IManageLiquidityProps {
  closeFn: Function;
}

export function ManageLiquidity(props: IManageLiquidityProps) {
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [screen, setScreen] = React.useState('1');
  const [activeState, setActiveState] = React.useState<
    ActiveLiquidity | string
  >(ActiveLiquidity.Liquidity);

  return (
    <>
      <PopUpModal
        onhide={props.closeFn}
        className="w-[620px] max-w-[620px]"
        footerChild={
          <div className="flex justify-center items-center gap-4">
            <p className="text-f16 text-text-150">
              Add liquidity, stake, and earn PLY
            </p>
            <Image
              className="cursor-pointer hover:opacity-90"
              onClick={() => setShowVideoModal(true)}
              src={playBtn}
            />
          </div>
        }
      >
        {screen === '1' && (
          <>
            <div className="flex gap-1">
              <p>Manage Liquidity </p>
              <InfoIconToolTip message="Hello world" />
            </div>
            <ManageLiquidityHeader
              className="mt-5 mb-6"
              activeStateTab={activeState}
              setActiveStateTab={setActiveState}
            />

            {activeState === ActiveLiquidity.Liquidity && (
              <div className="">
                <Liquidity setScreen={setScreen} />
              </div>
            )}
            {activeState === ActiveLiquidity.Rewards && (
              <div className="">Rewards</div>
            )}
            {activeState === ActiveLiquidity.Staking && (
              <div className="">Staking</div>
            )}
          </>
        )}
        {screen === '2' && (
          <>
            <ConfirmAddLiquidity setScreen={setScreen} />
          </>
        )}
        {screen === '3' && (
          <>
            <ConfirmRemoveLiquidity setScreen={setScreen} />
          </>
        )}
      </PopUpModal>
      {showVideoModal && (
        <VideoModal closefn={setShowVideoModal} linkString={'Bh5zuEI4M9o'} />
      )}
    </>
  );
}
