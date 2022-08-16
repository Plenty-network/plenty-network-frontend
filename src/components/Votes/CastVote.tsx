import { PopUpModal } from '../Modal/popupModal';
import Image from 'next/image';
import arrowLeft from '../../../src/assets/icon/pools/arrowLeft.svg';
import ctez from '../../assets/Tokens/ctez.png';
import tez from '../../assets/Tokens/tez.png';
import lock from '../../../src/assets/icon/vote/lock.svg';
import info from '../../../src/assets/icon/common/infoIcon.svg';
import Button from '../Button/Button';
import { ICastVoteProps } from './types';

function CastVote(props: ICastVoteProps) {
  const closeModal = () => {
    props.setShow(false);
  };

  return props.show ? (
    <PopUpModal onhide={closeModal} className="w-[602px] max-w-[602px]">
      {
        <>
          <div className="flex">
            <div
              className="cursor-pointer"
              onClick={() => props.setShow(false)}
            >
              <Image src={arrowLeft} />
            </div>
            <div className="mx-2 text-white font-title3">Cast Vote </div>
            <div className="relative top-[2px]">
              <Image src={info} />
            </div>
          </div>
          <div className="border bg-card-200 mt-5 border-text-800 rounded-2xl  pt-[22px] pb-[25px]">
            <div className="text-text-50 font-body4 px-5">Your votes power</div>
            <div className="flex mt-1 px-5">
              <div>
                <span className="font-title2 text-white">59%</span>
                <span className="font-body1 text-text-250 ml-1">
                  distributed between
                </span>
              </div>
              <div className="ml-auto bg-text-800/[0.5] relative -top-[9px] rounded-lg flex items-center h-[36px] px-2">
                <Image src={lock} />
                <span className="font-body4 text-white">2500 /</span>
                <span className="font-body4 text-text-500 ml-px">#7623</span>
              </div>
            </div>
            <div className="flex mt-3 h-[50px] items-center border-t border-b border-text-800/[0.5] bg-card-500 px-5">
              <div className="flex items-center">
                <span className="flex">
                  <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
                    <Image src={ctez} width={'24px'} height={'24px'} />
                  </div>
                  <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
                    <Image src={tez} width={'24px'} height={'24px'} />
                  </div>
                </span>
                <span className="text-white font-body4  relative top-[1px]">
                  CTEZ/XTZ
                </span>
              </div>
              <div className="ml-auto font-body4 text-white">23%</div>
            </div>
            <div className="flex  h-[50px] items-center  border-b border-text-800/[0.5] bg-card-500 px-5">
              <div className="flex items-center">
                <span className="flex">
                  <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
                    <Image src={ctez} width={'24px'} height={'24px'} />
                  </div>
                  <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
                    <Image src={tez} width={'24px'} height={'24px'} />
                  </div>
                </span>
                <span className="text-white font-body4  relative top-[1px]">
                  CTEZ/XTZ
                </span>
              </div>
              <div className="ml-auto font-body4 text-white">23%</div>
            </div>
            <div className="mt-5 pl-5 flex items-center">
              <span className="text-text-250 font-body2 mr-1">
                You can claim your rewards after
              </span>
              <span className="relative top-0.5">
                <Image src={info} />
              </span>
              <span className="text-white ml-1 font-subtitle2 ">
                28/07/2021, 12 AM UTC
              </span>
            </div>
          </div>
          <div className="mt-[18px]">
            <Button color="primary">Confirm vote</Button>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default CastVote;
