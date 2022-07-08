import clsx from 'clsx';
import refresh from '../../../src/assets/icon/swap/refresh.svg';
import settings from '../../../src/assets/icon/swap/settings.svg';
import arrowDown from '../../../src/assets/icon/swap/arrowDown.svg';
import arrowUp from '../../../src/assets/icon/swap/arrowUp.svg';
import ratesrefresh from '../../../src/assets/icon/swap/ratesrefresh.svg';
import info from '../../../src/assets/icon/swap/info.svg';
import switchsvg from '../../../src/assets/icon/swap/switch.svg';
import plenty from '../../../src/assets/Tokens/plenty.png';
import ctez from '../../../src/assets/Tokens/ctez.png';
import Image from 'next/image';
import Button from '../Button/Button';
import TokenDropdown from '../TokenDropdown/TokenDropdown';
import TransactionSettings from '../TransactionSettings/TransactionSettings';
import { useEffect, useMemo, useState } from 'react';
import { tokensModal, tokenType } from '../../../src/constants/swap';
import { useStateAnimate } from '../../hooks/useAnimateUseState';

interface ISwapTabProps {
  className?: string;
  walletAddress: string | '';
  firstTokenAmount: string | number;
  secondTokenAmount: string | number;
  connectWallet: () => void;
  tokenIn: { name: string; image: any };
  tokenOut: {
    name: string;
    image: any;
  };
  tokens: tokensModal[];
  handleTokenType: (type: tokenType) => void;
  userBalances: {
    [key: string]: string;
  };
  setSlippage: any;
  tokenPrice: {
    [id: string]: number;
  };
  slippage: number;
  handleClose: () => void;
  changeTokenLocation: () => void;
  setSecondTokenAmount: any;
  setFirstTokenAmount: any;
  setTokenIn: any;
  setTokenType: any;
  setTokenOut: any;
  handleSwapTokenInput: (
    input: string | number,
    tokenType: 'tokenIn' | 'tokenOut'
  ) => void;
}

function SwapTab(props: ISwapTabProps) {
  const [settingsShow, setSettingsShow] = useState(false);
  const [openSwapDetails, setOpenSwapDetails, animateOpenSwapDetails] =
    useStateAnimate(false, 280);
  const [routeData, setRouteData] = useState({
    success: false,
    isloading: false,
  });

  //routedata true once we have both the tokens
  // useEffect(() => {
  //   if (props.tokenOut.name !== 'false') {
  //     setRouteData({ success: true, isloading: false });
  //   }
  // }, [props.tokenIn, props.tokenOut]);

  const SwapButton = useMemo(() => {
    if (props.walletAddress) {
      if (Object.keys(props.tokenOut).length === 0) {
        return (
          <Button color="disabled" width="w-full">
            Select a token
          </Button>
        );
      } else if (
        Object.keys(props.tokenOut).length !== 0 &&
        props.firstTokenAmount === ''
      ) {
        return (
          <Button color="disabled" width="w-full">
            Enter a amount
          </Button>
        );
      } else if (
        props.firstTokenAmount > props.userBalances[props.tokenIn.name]
      ) {
        return (
          <Button color="disabled" width="w-full">
            Insufficient balance
          </Button>
        );
      } else {
        return (
          <Button color="primary" width="w-full">
            Swap
          </Button>
        );
      }
    } else {
      return (
        <Button color="primary" onClick={props.connectWallet} width="w-full">
          Connect Wallet
        </Button>
      );
    }
  }, [props]);

  return (
    <>
      <div className="flex items-center flex-row px-5 lg:px-9">
        <div className="font-title2">Swap</div>
        <div className="py-1 cursor-pointer px-15 h-8 border border-text-700 rounded-[21px] ml-auto">
          <Image src={refresh} height={'14px'} width={'15px'} />
        </div>
        <div
          className="py-1 px-2 h-8 border border-text-700 cursor-pointer rounded-[12px] ml-2"
          onClick={() => setSettingsShow(!settingsShow)}
        >
          <Image src={settings} height={'20px'} width={'20px'} />
          <span className="text-white font-body4 ml-0.5 relative -top-[3px]">
            {props.slippage}%
          </span>
        </div>
        <TransactionSettings
          show={settingsShow}
          setSlippage={props.setSlippage}
          slippage={props.slippage}
          setSettingsShow={setSettingsShow}
        />
      </div>
      <div
        className={clsx(
          'lg:w-580 mt-4 h-[102px] border bg-muted-200/[0.1]  mx-5 lg:mx-[30px] rounded-2xl px-4 hover:border-text-700',
          props.firstTokenAmount > props.userBalances[props.tokenIn.name]
            ? 'border-errorBorder hover:border-errorBorder bg-errorBg'
            : 'border-text-800 '
        )}
      >
        <div className="flex justify-between">
          <div
            className="flex-[0_0_50%] mt-4"
            onClick={() => props.handleTokenType('tokenIn')}
          >
            <TokenDropdown
              tokenIcon={props.tokenIn.image}
              tokenName={
                props.tokenIn.name === 'tez'
                  ? 'TEZ'
                  : props.tokenIn.name === 'ctez'
                  ? 'CTEZ'
                  : props.tokenIn.name
              }
            />
          </div>
          <div className=" my-3 ">
            <div className="text-right font-body1 text-text-400">YOU PAY</div>
            <div>
              <input
                type="number"
                className={clsx(
                  'text-white bg-card-500 text-right border-0 font-medium2  lg:font-medium1 outline-none w-[100%]'
                )}
                placeholder="0.0"
                lang="en"
                onChange={(e) =>
                  props.handleSwapTokenInput(e.target.value, 'tokenIn')
                }
                value={props.firstTokenAmount}
              />
            </div>
          </div>
        </div>
        <div className="flex -mt-[12px]">
          <div className="text-left">
            <span className="text-text-600 font-body3">Balance:</span>{' '}
            <span className="font-body4 text-primary-500 2">
              {Number(props.userBalances[props.tokenIn.name]) >= 0
                ? Number(props.userBalances[props.tokenIn.name])
                : '--'}
            </span>
          </div>
          <div className="text-right ml-auto font-body2 text-text-400">
            ~$
            {props.firstTokenAmount && props.tokenPrice[props.tokenIn.name]
              ? Number(
                  Number(props.firstTokenAmount) *
                    Number(props.tokenPrice[props.tokenIn.name])
                ).toFixed(2)
              : '0.00'}
          </div>
        </div>
      </div>
      <div
        className="z-10 cursor-pointer relative top-[5px] bg-switchBorder w-[70px] h-[70px] p-px  mx-auto rounded-2xl "
        onClick={() => props.changeTokenLocation()}
      >
        <div className="p-[11.5px] bg-card-500 rounded-2xl  w-[68px] h-[68px]">
          <div className="bg-primary-500 p-2  w-[46px] h-[46px] rounded-lg ">
            <Image src={switchsvg} height={'32px'} width={'32px'} />
          </div>
        </div>
      </div>
      <div className=" pt-[41px] relative -top-[24px] pb-5 border border-primary-500/[0.2] mx-px md:mx-2 lg:mx-2  px-5 lg:px-[22px] rounded-3xl bg-primary-500/[0.04]">
        <div className="lg:w-580  h-[102px] border border-text-800 rounded-2xl  px-4 border-primary-500/[0.2] hover:border-primary-500/[0.6] bg-card-500 hover:bg-primary-500/[0.02]">
          <div className=" flex justify-between">
            <div
              className="flex-[0_0_50%] mt-4"
              onClick={() => props.handleTokenType('tokenOut')}
            >
              {Object.keys(props.tokenOut).length !== 0 ? (
                <TokenDropdown
                  tokenIcon={props.tokenOut.image}
                  tokenName={
                    props.tokenOut.name === 'tez'
                      ? 'TEZ'
                      : props.tokenOut.name === 'ctez'
                      ? 'CTEZ'
                      : props.tokenOut.name
                  }
                />
              ) : (
                <TokenDropdown tokenName="Select a token" />
              )}
            </div>
            <div className=" my-3 ">
              <div className="text-right font-body1 text-text-400">
                YOU RECEIVE
              </div>
              <div>
                {Object.keys(props.tokenOut).length !== 0 ? (
                  !routeData.isloading ? (
                    <input
                      type="number"
                      className={clsx(
                        'text-primary-500 bg-card-500 text-right border-0 font-input-text lg:font-medium1 outline-none w-[100%] placeholder:text-primary-500 '
                      )}
                      placeholder="0.0"
                      lang="en_EN"
                      step="any"
                      onChange={(e) =>
                        props.handleSwapTokenInput(e.target.value, 'tokenOut')
                      }
                      value={props.secondTokenAmount}
                    />
                  ) : (
                    <p className="  h-[32px] rounded animate-pulse bg-shimmer-100"></p>
                  )
                ) : (
                  <input
                    type="text"
                    className={clsx(
                      'text-primary-500 bg-card-500 text-right border-0 w-[100%]  font-input-text lg:font-medium1 outline-none hover:bg-primary-500/[0.02]'
                    )}
                    placeholder="--"
                    disabled
                    value={'--'}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex -mt-[12px]">
            <div className="text-left">
              <span className="text-text-600 font-body3">Balance:</span>{' '}
              <span className="font-body4 text-text-500 ">
                {Object.keys(props.tokenOut).length !== 0 &&
                Number(props.userBalances[props.tokenOut.name]) >= 0
                  ? Number(props.userBalances[props.tokenOut.name])
                  : '--'}
              </span>
            </div>
            <div className="text-right ml-auto font-body2 text-text-400">
              ~$
              {Object.keys(props.tokenOut).length !== 0 &&
              props.secondTokenAmount &&
              props.tokenPrice[props.tokenOut.name]
                ? Number(
                    Number(props.secondTokenAmount) *
                      Number(props.tokenPrice[props.tokenOut.name])
                  ).toFixed(2)
                : '0.00'}
            </div>
          </div>
        </div>

        {(props.firstTokenAmount || props.secondTokenAmount) &&
          Object.keys(props.tokenOut).length !== 0 && (
            <div
              className="h-12 mt-3 cursor-pointer px-4 pt-[11px] pb-[15px] rounded-2xl bg-muted-600 border border-primary-500/[0.2] flex "
              onClick={() => setOpenSwapDetails(!openSwapDetails)}
            >
              {routeData.isloading && !routeData.success ? (
                <div>
                  <span className="ml-[9.25px] font-text-bold mr-[7px]">
                    {' '}
                    Fetching best price
                  </span>
                </div>
              ) : (
                <>
                  <div>
                    <span className="relative top-0.5">
                      <Image src={info} />
                    </span>
                    <span className="ml-[9.25px] font-text-bold mr-[7px]">
                      {' '}
                      1 PLENTY = 0.114 uUSD
                    </span>
                    <span className="relative top-px">
                      <Image src={ratesrefresh} />
                    </span>
                  </div>
                  <div className="ml-auto">
                    <Image
                      src={openSwapDetails ? arrowUp : arrowDown}
                      width={'12px'}
                      height={'9px'}
                    />
                  </div>
                </>
              )}
            </div>
          )}

        {openSwapDetails && (
          <div
            className={`bg-card-500 border border-text-700/[0.5] py-5 px-[22px] h-[218px] rounded-3xl mt-2 ${
              animateOpenSwapDetails
                ? 'opendown-animation'
                : 'closeup-animation'
            }`}
          >
            <div className="flex">
              <div className="font-mobile-400 md:font-body3 ">
                <span className="mr-[5px]">Minimum received</span>
                <span className="relative top-0.5">
                  <Image src={info} />
                </span>
              </div>
              <div className="ml-auto font-mobile-700 md:font-subtitle4">
                0.11197067216831917 uUSD
              </div>
            </div>

            <div className="flex mt-2">
              <div className="font-mobile-400 md:font-body3 ">
                <span className="mr-[5px]">Price Impact</span>
                <span className="relative top-0.5">
                  <Image src={info} />
                </span>
              </div>
              <div className="ml-auto font-mobile-700 md:font-subtitle4">
                4.38 %
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
                0.0025 PLENTY
              </div>
            </div>
            <div className="border-t border-text-800 mt-[18px]"></div>
            <div className="mt-4 ">
              <div className="font-subtitle2 md:font-subtitle4">
                {' '}
                <span className="mr-[5px]">Route</span>
                <span className="relative top-0.5">
                  <Image src={info} />
                </span>
              </div>
              <div className="border-dashed relative top-[24px]   border-t-2 border-muted-50 mx-2"></div>
              <div className="mt-2 flex justify-between ">
                <div className="flex items-center ">
                  <div className="relative  z-100 w-[32px] h-[32px]  p-0.5 bg-card-600 rounded-full">
                    <span className="w-[28px] h-[28px]">
                      <Image src={ctez} width={'28px'} height={'28px'} />
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-card-500 z-50"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-card-500 z-50"></div>
                  <div className="relative  rounded-2xl h-[32px] bg-card-600 p-px flex">
                    <span className="relative -left-[7px] flex items-center">
                      <div className="relative left-2.5 z-50 w-[32px] h-[32px]  p-0.5 bg-card-600 rounded-full">
                        <span className="w-[28px] h-[28px]">
                          <Image src={ctez} width={'28px'} height={'28px'} />
                        </span>
                      </div>
                      <div className="relative z-40 w-[32px] h-[32px]  p-0.5 bg-card-600 rounded-full">
                        <span className="w-[28px] h-[28px]">
                          <Image src={ctez} width={'28px'} height={'28px'} />
                        </span>
                      </div>
                      <div className="relative ml-[5px] h-6 px-[4.5px] pt-[3px] bg-muted-100 rounded-xl font-subtitle4">
                        0.3%
                      </div>
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-card-500 z-50"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-card-500 z-50"></div>
                  <div className="relative  w-[32px] h-[32px]  p-0.5 bg-card-600 rounded-full">
                    <span className="w-[28px] h-[28px]">
                      <Image src={ctez} width={'28px'} height={'28px'} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-5">{SwapButton}</div>
      </div>
    </>
  );
}

export default SwapTab;
