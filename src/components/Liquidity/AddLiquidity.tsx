import clsx from 'clsx';
import Image from 'next/image';
import ctez from '../../../src/assets/Tokens/ctez.png';
import wallet from '../../../src/assets/icon/pools/wallet.svg';

import add from '../../../src/assets/icon/pools/addIcon.svg';
import Button from '../Button/Button';

interface IAddLiquidityProps {}
function AddLiquidity(props: IAddLiquidityProps) {
  return (
    <>
      <div className="border mt-[10px] flex border-text-800/[0.5] rounded-2xl h-[88px]">
        <div className="w-[40%] rounded-l-2xl border-r items-center flex border-text-800/[0.5] bg-card-300">
          <div className="ml-5">
            <Image src={ctez} width={'42px'} height={'42px'} />
          </div>
          <div className="ml-2">
            <p className="text-text-900 font-body2">Input</p>
            <p className="font-title2 text-white">PLENTY</p>
          </div>
        </div>
        <div className="pl-[25px] w-[100%] pr-[18px] items-center  flex bg-muted-200/[0.1]">
          <div className="w-[50%]">
            <p>
              <input
                type="text"
                className="text-white bg-muted-200/[0.1] text-left border-0 font-medium2  lg:font-medium1 outline-none w-[100%]"
                placeholder="0.0"
              />
            </p>
            <p>
              <span className="mt-2 ml-1 font-body4 text-text-400">$0.0</span>
            </p>
          </div>
          <div className="ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[48px] items-center flex px-3">
            <div>
              <Image src={wallet} width={'32px'} height={'32px'} />
            </div>
            <div className="ml-1 text-primary-500 font-body2">
              2343.3998 CTEZ
            </div>
          </div>
        </div>
      </div>
      <div className="relative -top-[9px] left-[134px]">
        <Image src={add} width={'24px'} height={'24px'} />
      </div>
      <div className="border -mt-[25px] flex border-text-800/[0.5] rounded-2xl h-[88px]">
        <div className="w-[40%] rounded-l-2xl border-r items-center flex border-text-800/[0.5] bg-card-300">
          <div className="ml-5">
            <Image src={ctez} width={'42px'} height={'42px'} />
          </div>
          <div className="ml-2">
            <p className="text-text-900 font-body2">Input</p>
            <p className="font-title2 text-white">PLENTY</p>
          </div>
        </div>
        <div className="pl-[25px] w-[100%] pr-[18px] items-center  flex bg-muted-200/[0.1]">
          <div className="w-[50%]">
            <p>
              <input
                type="text"
                className="text-white bg-muted-200/[0.1] text-left border-0 font-medium2  lg:font-medium1 outline-none w-[100%]"
                placeholder="0.0"
              />
            </p>
            <p>
              <span className="mt-2 ml-1 font-body4 text-text-400">$0.0</span>
            </p>
          </div>
          <div className="ml-auto border border-text-800/[0.5] rounded-lg bg-cardBackGround h-[48px] items-center flex px-3">
            <div>
              <Image src={wallet} width={'32px'} height={'32px'} />
            </div>
            <div className="ml-1 text-primary-500 font-body2">3.3998 CTEZ</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddLiquidity;
