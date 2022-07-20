import clsx from 'clsx';
import Button from '../Button/Button';
import { PopUpModal } from '../Modal/popupModal';
import Image from 'next/image';
import ratesrefresh from '../../../src/assets/icon/swap/ratesrefresh.svg';
import arrow from '../../../src/assets/icon/swap/downArrow.svg';
import info from '../../../src/assets/icon/swap/info.svg';
import { BigNumber } from 'bignumber.js';

interface IConfirmSwapProps {
  show: boolean;
  setShow: any;
  tokenIn: { name: string; image: any };
  tokenOut: { name: string; image: any };
  firstTokenAmount: string | number;
  swapDetails: {
    exchangeRate: BigNumber;
    fees: BigNumber;
    feePerc: BigNumber;
    minimum_Out: BigNumber;
    priceImpact: BigNumber;
    tokenOut_amount: BigNumber;
    isLoading: boolean;
    success: boolean;
  };
  secondTokenAmount: string | number;
  onClick: () => void;
}
function ConfirmSwap(props: IConfirmSwapProps) {
  const closeModal = () => {
    props.setShow(false);
  };
  const enableExpertMode = () => {
    props.setShow(false);
  };
  return props.show ? (
    <PopUpModal title="Confirm Swap" onhide={closeModal}>
      {
        <>
          <div className="mt-6">
            <div className="border bg-muted-100/[0.1] rounded-2xl border-text-800 p-3 flex content-center justify-center">
              <div className="border rounded-xl border-text-800/[0.5] bg-muted-400 p-3 h-[50px] justify-center flex">
                <span className="h-[26px] w-[26px]">
                  <Image
                    src={props.tokenIn.image}
                    height={'26px'}
                    width={'26px'}
                  />
                </span>
                <span className="font-title3 ml-2">
                  <span>
                    {props.tokenIn.name === 'tez'
                      ? 'TEZ'
                      : props.tokenIn.name === 'ctez'
                      ? 'CTEZ'
                      : props.tokenIn.name}
                  </span>
                </span>
              </div>
              <div className="ml-auto items-center flex font-medium2">
                {props.firstTokenAmount}
              </div>
            </div>
            <div className="flex justify-center -mt-[15px]">
              <Image src={arrow} />
            </div>
            <div className="border -mt-[18px] bg-muted-100/[0.1] rounded-2xl border-text-800 p-3 flex content-center justify-center">
              <div className="border rounded-xl border-text-800/[0.5] bg-muted-400 p-3 h-[50px] justify-center flex">
                <span className="h-[26px] w-[26px]">
                  <Image
                    src={props.tokenOut.image}
                    height={'26px'}
                    width={'26px'}
                  />
                </span>
                <span className="font-title3 ml-2">
                  <span>
                    {props.tokenOut.name === 'tez'
                      ? 'TEZ'
                      : props.tokenOut.name === 'ctez'
                      ? 'CTEZ'
                      : props.tokenOut.name}
                  </span>
                </span>
              </div>
              <div className="ml-auto items-center flex font-medium2">
                {Number(props.secondTokenAmount).toFixed(6)}
              </div>
            </div>
            <div className="h-12 mt-3 cursor-pointer px-4 pt-[13px] pb-[15px] rounded-2xl bg-muted-600 border border-primary-500/[0.2]  items-center flex  ">
              <>
                <div>
                  <span className="relative top-0.5">
                    <Image src={info} width={'15px'} height={'15px'} />
                  </span>
                  <span className="ml-[9.25px] font-text-bold mr-[7px]">
                    {' '}
                    {`1 ${
                      props.tokenIn.name === 'tez'
                        ? 'TEZ'
                        : props.tokenIn.name === 'ctez'
                        ? 'CTEZ'
                        : props.tokenIn.name
                    } = ${props.swapDetails.exchangeRate.toFixed(3)} ${
                      props.tokenOut.name === 'tez'
                        ? 'TEZ'
                        : props.tokenOut.name === 'ctez'
                        ? 'CTEZ'
                        : props.tokenOut.name
                    }`}
                  </span>
                  <span className="relative top-px">
                    <Image src={ratesrefresh} />
                  </span>
                </div>
              </>
            </div>

            <div
              className={`bg-card-500 border border-text-700/[0.5] py-5 px-[22px] h-[218px] rounded-3xl mt-2 `}
            >
              <div className="flex">
                <div className="font-mobile-400 md:font-body3 ">
                  <span className="mr-[5px]">Minimum received</span>
                  <span className="relative top-0.5">
                    <Image src={info} width={'15px'} height={'15px'} />
                  </span>
                </div>

                <div className="ml-auto font-mobile-700 md:font-subtitle4">
                  {` ${Number(props.swapDetails.minimum_Out).toFixed(4)} ${
                    props.tokenOut.name === 'tez'
                      ? 'TEZ'
                      : props.tokenOut.name === 'ctez'
                      ? 'CTEZ'
                      : props.tokenOut.name
                  }`}
                </div>
              </div>

              <div className="flex mt-2">
                <div className="font-mobile-400 md:font-body3 ">
                  <span className="mr-[5px]">Price Impact</span>
                  <span className="relative top-0.5">
                    <Image src={info} width={'15px'} height={'15px'} />
                  </span>
                </div>

                <div className="ml-auto font-mobile-700 md:font-subtitle4">
                  {`${props.swapDetails.priceImpact.toFixed(4)} %`}
                </div>
              </div>
              <div className="flex mt-2">
                <div className="font-mobile-400 md:font-body3 ">
                  <span className="mr-[5px]">Fee</span>
                  <span className="relative top-0.5">
                    <Image src={info} />
                  </span>
                </div>

                <div className="ml-auto font-mobile-700 md:font-subtitle4">
                  {props.swapDetails.feePerc.toFixed(2)}
                </div>
              </div>
              <div className="border-t border-text-800 mt-[18px]"></div>
              <div className="mt-4 ">
                <div className="font-subtitle2 md:font-subtitle4">
                  {' '}
                  <span className="mr-[5px]">Route</span>
                  <span className="relative top-0.5">
                    <Image src={info} width={'15px'} height={'15px'} />
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button color="primary" width="w-full" onClick={props.onClick}>
                Confirm
              </Button>
            </div>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default ConfirmSwap;
