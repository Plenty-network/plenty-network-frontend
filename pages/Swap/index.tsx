import clsx from 'clsx';
import refresh from '../../public/assets/icon/refresh.svg';
import ctez from '../../public/assets/tokens/ctez.png';
import Image from 'next/image';
import Button from '../../src/components/Button/Button';
import TokenDropdown from '../../src/components/TokenDropdown/TokenDropdown';
interface ISwapProps {
  className?: string;
}
function Swap(props: ISwapProps) {
  return (
    <div className={clsx('bg-card-500 rounded-3xl  text-white w-640 py-5')}>
      <div className="flex flex-row px-9">
        <div>Swap</div>
        <div className="py-1.5 px-15 border rounded-[21px] ml-auto">
          <Image src={refresh} height={'14px'} width={'15px'} />
        </div>
        <div>Settings</div>
      </div>
      <div className="w-580 mt-4 h-[102px] border border-text-800 mx-[30px] rounded-2xl px-4 ">
        <div className="flex">
          <div className="mt-4">
            <TokenDropdown tokenIcon={ctez} tokenName="CTEZ" />
          </div>
          <div className="my-3 ml-auto">
            <div className="text-right font-body1 text-text-400">YOU PAY</div>
            <div>
              <input
                type="text"
                className={clsx(
                  'text-white bg-card-500 text-right border-0 font-medium1'
                )}
                placeholder="0.0"
                value={'0.0'}
              />
            </div>
          </div>
        </div>
        <div className="flex -mt-2">
          <div className="text-left">
            <span className="text-text-600 font-body3">Balance:</span>{' '}
            <span className="font-body4 text-primary-500 2">5.98</span>
          </div>
          <div className="text-right ml-auto font-body2 text-text-400">
            ~$0.00
          </div>
        </div>
      </div>
      <div className=" mt-[48px] h-[231px] border border-primary-500/[0.2] mx-2 px-[22px] rounded-2xl bg-primary-500/[0.04]">
        <div className="w-580 mt-4 h-[102px] border border-text-800 rounded-2xl mt-[41px] px-4 border-primary-500/[0.2] bg-card-500">
          <div className="flex">
            <div className="mt-4">
              <TokenDropdown tokenName="Select a token" />

              {/* <TokenDropdown tokenIcon={ctez} tokenName="PLENTY" /> */}
            </div>
            <div className="my-3 ml-auto">
              <div className="text-right font-body1 text-text-400">
                YOU RECEIVE
              </div>
              <div>
                <input
                  type="text"
                  className={clsx(
                    'text-primary-500 bg-card-500 text-right border-0 font-medium1'
                  )}
                  placeholder="0.0"
                  value={'0.0'}
                />
              </div>
            </div>
          </div>
          <div className="flex -mt-2">
            <div className="text-left">
              <span className="text-text-600 font-body3">Balance:</span>{' '}
              <span className="font-body4 text-text-500 ">5.98</span>
            </div>
            <div className="text-right ml-auto font-body2 text-text-400">
              ~$0.00
            </div>
          </div>
        </div>
        <div className="mt-5">
          <Button color="disabled">Enter an amount</Button>
        </div>
      </div>
    </div>
  );
}

export default Swap;
