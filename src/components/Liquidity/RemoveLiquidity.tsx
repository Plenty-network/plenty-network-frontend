import clsx from 'clsx';
import Image from 'next/image';
import ctez from '../../../src/assets/Tokens/ctez.png';
import wallet from '../../../src/assets/icon/pools/wallet.svg';

interface IRemoveLiquidityProps {}
function RemoveLiquidity(props: IRemoveLiquidityProps) {
  return (
    <>
      <div className="flex items-end mt-[10px]">
        <div className="font-body4 ml-2 text-text-500">
          How much PNLP to remove?{' '}
        </div>
        <div className="ml-auto flex">
          <p className="rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[32px] px-[13px] items-center flex">
            25%
          </p>
          <p className="ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[32px] px-[13px] items-center flex">
            50%
          </p>
          <p className="ml-2 rounded-lg border border-text-800/[0.5] bg-cardBackGround h-[32px] px-[13px] items-center flex">
            75%
          </p>
        </div>
      </div>
      <div className="border pl-4 pr-5 mt-[10px] items-center flex border-text-800/[0.5] rounded-2xl h-[86px]">
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
          <div className="ml-1 text-primary-500 font-body2">2343.3998 CTEZ</div>
        </div>
      </div>

      <div className="border mt-3 flex border-text-800/[0.5] rounded-2xl h-[88px]">
        <div className="w-[40%] rounded-l-2xl border-r items-center flex border-text-800/[0.5] ">
          <div className="ml-5 font-body4 text-white">You will receive</div>
        </div>
        <div className="px-5 w-[100%]  items-center  flex ">
          <div className="border border-text-800/[0.5] flex  items-center rounded-2xl w-[166px] pl-[10px] h-[66px] bg-cardBackGround">
            <div>
              <Image src={ctez} width={'34px'} height={'34px'} />
            </div>
            <div className="ml-2.5">
              <p>--</p>
              <p>
                <span className="mt-2  font-body4 text-text-400">PLENTY</span>
              </p>
            </div>
          </div>
          <div className="border border-text-800/[0.5] ml-3 flex  items-center rounded-2xl w-[166px] pl-[10px] h-[66px] bg-cardBackGround">
            <div>
              <Image src={ctez} width={'34px'} height={'34px'} />
            </div>
            <div className="ml-2.5">
              <p>--</p>
              <p>
                <span className="mt-2  font-body4 text-text-400">PLENTY</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RemoveLiquidity;
