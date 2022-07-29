import clsx from 'clsx';
import Button from '../Button/Button';
import { PopUpModal } from '../Modal/popupModal';
import Image from 'next/image';
import ratesrefresh from '../../../src/assets/icon/swap/ratesrefresh.svg';
import { useMemo } from 'react';
import arrow from '../../../src/assets/icon/swap/downArrow.svg';
import info from '../../../src/assets/icon/swap/info.svg';
import { BigNumber } from 'bignumber.js';
import stableSwap from '../../../src/assets/icon/swap/stableswapViolet.svg';
import { tokensList } from '../../constants/tokensList';

interface IConfirmSwapProps {
  show: boolean;
  setShow: any;
  tokenIn: { name: string; image: any };
  tokenOut: { name: string; image: any };
  firstTokenAmount: string | number;
  routeDetails: {
    path: string[];
    minimumOut: BigNumber;
    minimumTokenOut: BigNumber[];
    priceImpact: BigNumber;
    finalFeePerc: BigNumber;
    feePerc: BigNumber[];
    isStable: boolean[];
    exchangeRate: BigNumber;
    success: boolean;
  };
  secondTokenAmount: string | number;
  onClick: () => void;
}
function ConfirmSwap(props: IConfirmSwapProps) {
  const closeModal = () => {
    props.setShow(false);
  };
  const swapRoute = useMemo(() => {
    if (props.routeDetails.path?.length >= 2) {
      return props.routeDetails.path.map((tokenName) =>
        tokensList.find((token) => token.name === tokenName)
      );
    }

    return null;
  }, [props.routeDetails.path]);

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
                    } = ${props.routeDetails.exchangeRate.toFixed(3)} ${
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
              className={`bg-card-500 border border-text-700/[0.5] py-[14px] lg:py-5 px-[15px] lg:px-[22px] h-[218px] rounded-3xl mt-2 `}
            >
              <div className="flex">
                <div className="font-mobile-400 md:font-body3 ">
                  <span className="mr-[5px]">Minimum received</span>
                  <span className="relative top-0.5">
                    <Image src={info} width={'15px'} height={'15px'} />
                  </span>
                </div>

                <div className="ml-auto font-mobile-700 md:font-subtitle4">
                  {` ${Number(props.routeDetails.minimumOut).toFixed(4)} ${
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
                  {`${props.routeDetails.priceImpact.toFixed(4)} %`}
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
                  {`${props.routeDetails.finalFeePerc.toFixed(2)} %`}
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
                <>
                  <div className="border-dashed relative top-[24px]   border-t-2 border-muted-50 mx-2"></div>
                  <div className="mt-2 flex justify-between ">
                    {swapRoute?.map((token, idx) => {
                      const index = idx + 1;
                      return (
                        <>
                          {(idx === 0 || idx === swapRoute.length - 1) && (
                            <div
                              className="flex items-center "
                              key={token?.name}
                            >
                              {idx === swapRoute?.length - 1 && (
                                <div className="w-1.5 h-2 bg-card-500 z-50"></div>
                              )}
                              <div className="relative  z-100 w-[32px] h-[32px]  p-0.5 bg-card-600 rounded-full">
                                <span className="w-[28px] h-[28px]">
                                  <Image
                                    src={token?.image}
                                    width={'28px'}
                                    height={'28px'}
                                  />
                                </span>
                              </div>
                              {idx === 0 && (
                                <div className="w-1.5 h-2 bg-card-500 z-50"></div>
                              )}
                            </div>
                          )}

                          {idx !== swapRoute.length - 1 && (
                            <div className="flex items-center">
                              <div className="w-1.5 h-2 bg-card-500 z-50"></div>
                              <div
                                className={clsx(
                                  'relative  rounded-2xl h-[32px] bg-card-600 p-px flex',
                                  props.routeDetails.isStable[idx]
                                    ? 'w-[130px]'
                                    : 'w-[114px]'
                                )}
                              >
                                <span className=" flex items-center">
                                  {props.routeDetails.isStable[idx] && (
                                    <div className="   z-50 w-[28px] h-[28px]  flex justify-center items-center bg-card-600 rounded-full">
                                      <span className="w-[18px] h-[18px]">
                                        <Image
                                          src={stableSwap}
                                          width={'18px'}
                                          height={'18px'}
                                        />
                                      </span>
                                    </div>
                                  )}
                                  <div
                                    className={clsx(
                                      'relative   z-40 w-[32px] h-[32px]  p-0.5 bg-card-600 rounded-full',
                                      props.routeDetails.isStable[idx] &&
                                        'right-[10px]'
                                    )}
                                  >
                                    <span className="w-[28px] h-[28px]">
                                      <Image
                                        src={token?.image}
                                        width={'28px'}
                                        height={'28px'}
                                      />
                                    </span>
                                  </div>
                                  <div
                                    className={clsx(
                                      'relative  z-30 w-[32px] h-[32px]  p-0.5 bg-card-600 rounded-full',
                                      props.routeDetails.isStable[idx]
                                        ? 'right-5'
                                        : 'right-[10px]'
                                    )}
                                  >
                                    <span className="w-[28px] h-[28px]">
                                      <Image
                                        src={swapRoute[index]?.image}
                                        width={'28px'}
                                        height={'28px'}
                                      />
                                    </span>
                                  </div>
                                  <div
                                    className={clsx(
                                      'relative right-[22px] ml-[5px] h-6 px-[4.5px] pt-[3px] bg-muted-100 rounded-xl font-subtitle4',
                                      props.routeDetails.isStable[idx]
                                        ? 'right-[22px]'
                                        : 'right-[12px]'
                                    )}
                                  >
                                    {Number(
                                      props.routeDetails.feePerc[idx]
                                    ).toFixed(2)}
                                    %
                                  </div>
                                </span>
                              </div>
                              <div className="w-1.5 h-2 bg-card-500 z-50"></div>
                            </div>
                          )}
                        </>
                      );
                    })}
                  </div>
                </>
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
