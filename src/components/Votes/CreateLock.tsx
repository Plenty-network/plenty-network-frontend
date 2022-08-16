import { PopUpModal } from '../Modal/popupModal';
import calender from '../../../src/assets/icon/vote/calender.svg';

import { useState } from 'react';
import wallet from '../../../src/assets/icon/pools/wallet.svg';
import Image from 'next/image';
import Button from '../Button/Button';
import ConfirmLocking from './ConfirmLocking';
import { ICreateLockProps } from './types';

function CreateLock(props: ICreateLockProps) {
  const [screen, setScreen] = useState('1');
  const closeModal = () => {
    props.setShow(false);
  };

  return props.show ? (
    <PopUpModal onhide={closeModal} className="w-[602px] max-w-[602px]">
      {screen === '1' ? (
        <>
          <div className="mx-2 text-white font-title3">Create Lock </div>

          <div className="border pl-4 pr-5 mt-[22px] bg-muted-200/[0.1] items-center flex border-text-800 rounded-2xl h-[86px]">
            <div className="w-[50%]">
              <p>
                <input
                  type="text"
                  className="text-white bg-muted-200/[0.1] text-left border-0 font-medium2  lg:font-medium1 outline-none w-[100%]"
                  placeholder="0.0"
                  value={0.0}
                />
              </p>
              <p>
                <span className="mt-2 ml-1 font-body4 text-text-400">
                  ~$ 0.0
                </span>
              </p>
            </div>

            <div className="ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[48px] items-center flex px-3">
              <div>
                <Image src={wallet} width={'32px'} height={'32px'} />
              </div>
              <div className="ml-1 text-primary-500 font-body2">1.09 PNLP</div>
            </div>
          </div>
          <div className="ml-auto mt-3 flex">
            <p className="cursor-pointer rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[32px] px-[13px] items-center flex">
              25%
            </p>
            <p className="cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[32px] px-[13px] items-center flex">
              50%
            </p>
            <p className="cursor-pointer ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[32px] px-[13px] items-center flex">
              75%
            </p>
          </div>
          <div className="bg-muted-400 border border-text-800 rounded-2xl py-5 mt-5">
            <div className="px-5 text-text-50 font-subtitle1">
              Choose lock end{' '}
            </div>
            <div className="mt-2 rounded-lg ml-5 mr-[24px] border-[1.3px] border-border-200 pr-5 pl-4 flex items-center h-[62px]">
              <div></div>
              <div className="ml-auto">
                <Image src={calender} />
              </div>
            </div>
            <div className="mt-3 px-5 flex gap-2">
              <p className="rounded-[32px] bg-muted-200/[0.1] border border-border-200 px-[25px] flex items-center h-[44px] text-text-500 font-subtitle3">
                1 week
              </p>
              <p className="rounded-[32px] bg-muted-200/[0.1] border border-border-200 px-[25px] flex items-center h-[44px] text-text-500 font-subtitle3">
                1 month
              </p>
              <p className="rounded-[32px] bg-muted-200/[0.1] border border-border-200 px-[25px] flex items-center h-[44px] text-text-500 font-subtitle3">
                1 year
              </p>
              <p className="rounded-[32px] bg-muted-200/[0.1] border border-border-200 px-[25px] flex items-center h-[44px] text-text-500 font-subtitle3">
                4 year
              </p>
            </div>
            <div className="mt-3 border-t border-text-800/[0.5]"></div>
            <div className="px-5 flex mt-4 flex items-center">
              <div className="text-text-250 font-subtitle3">
                Your will receive a veNFT with a voting power of{' '}
              </div>
              <div className="ml-auto px-3 h-[38px] flex items-center text-primary-500 bg-primary-500/[0.1] rounded-[30px]">
                2500
              </div>
            </div>
          </div>

          <div className="mt-[18px]">
            <Button color="disabled" onClick={() => setScreen('2')}>
              Proceed
            </Button>
          </div>
        </>
      ) : (
        <ConfirmLocking setScreen={setScreen} />
      )}
    </PopUpModal>
  ) : null;
}

export default CreateLock;
