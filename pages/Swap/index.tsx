import clsx from 'clsx';
import refresh from '../../src/assets/icon/swap/refresh.svg';
import settings from '../../src/assets/icon/swap/settings.svg';
import arrowDown from '../../src/assets/icon/swap/arrowDown.svg';
import arrowUp from '../../src/assets/icon/swap/arrowUp.svg';
import ratesrefresh from '../../src/assets/icon/swap/ratesrefresh.svg';
import info from '../../src/assets/icon/swap/info.svg';
import switchsvg from '../../src/assets/icon/swap/switch.svg';

import infogrey from '../../src/assets/icon/swap/info-grey.svg';
import plenty from '../../src/assets/Tokens/plenty.png';
import Image from 'next/image';
import Button from '../../src/components/Button/Button';
import TokenDropdown from '../../src/components/TokenDropdown/TokenDropdown';
import TransactionSettings from '../../src/components/TransactionSettings/TransactionSettings';
import { useEffect, useMemo, useState } from 'react';
import { tokens } from '../../src/constants/Tokens';
import { useLocationStateInSwap } from '../../src/hooks/useLocationStateInSwap';
import SwapModal from '../../src/components/SwapModal/SwapModal';
import { tokensModal, tokenType } from '../../src/constants/swap';
import { fetchConfig } from '../../src/api/utils';

interface ISwapProps {
  className?: string;
  otherProps: {
    connectWallet: () => void;
    disconnectWallet: () => void;
    walletAddress: string | null;
  };
}

function Swap(props: ISwapProps) {
  const { tokenIn, setTokenIn, tokenOut, setTokenOut } =
    useLocationStateInSwap();
  const [settingsShow, setSettingsShow] = useState(false);
  const [openSwapDetails, setOpenSwapDetails] = useState(false);
  const [firstTokenAmount, setFirstTokenAmount] = useState<string | number>('');
  const [secondTokenAmount, setSecondTokenAmount] = useState<string | number>(
    ''
  );
  const [tokenType, setTokenType] = useState<tokenType>('tokenIn');
  const [searchQuery, setSearchQuery] = useState('');
  const [swapModalShow, setSwapModalShow] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [routeData, setRouteData] = useState({
    success: false,
    isloading: false,
  });
  fetchConfig();
  //routedata true once we have both the tokens
  useEffect(() => {
    if (tokenOut.name !== 'false') {
      setRouteData({ success: true, isloading: false });
    }
  }, [tokenIn, tokenOut]);

  const handleSwapTokenInput = (
    input: string | number,
    tokenType: 'tokenIn' | 'tokenOut'
  ) => {
    setRouteData({ success: false, isloading: true });
    if (input === '') {
      setFirstTokenAmount('');
      setSecondTokenAmount('');
      setRouteData({ success: true, isloading: false });
    } else {
      if (tokenType === 'tokenIn') {
        setFirstTokenAmount(input);
        if (tokenOut.name !== 'false') {
          setTimeout(() => {
            setSecondTokenAmount('55.721932');
            setRouteData({ success: true, isloading: false });
          }, 1000);
        }
      } else if (tokenType === 'tokenOut') {
        setSecondTokenAmount(input);

        setTimeout(() => {
          setFirstTokenAmount('12.1');
          setRouteData({ success: true, isloading: false });
        }, 1000);
      }
    }
  };
  const handleTokenType = (type: tokenType) => {
    setSwapModalShow(true);
    setTokenType(type);
  };

  const handleClose = () => {
    setSwapModalShow(false);
  };

  const SwapButton = useMemo(() => {
    if (props.otherProps.walletAddress) {
      return (
        <Button
          color="primary"
          onClick={props.otherProps.disconnectWallet}
          width="w-full"
        >
          Swap
        </Button>
      );
    } else {
      return (
        <Button
          color="primary"
          onClick={props.otherProps.connectWallet}
          width="w-full"
        >
          Connect Wallet
        </Button>
      );
    }
  }, [props.otherProps]);

  const selectToken = (token: tokensModal) => {
    if (tokenType === 'tokenIn') {
      setTokenIn({
        name: token.name,
        image: token.image,
      });
    } else {
      setTokenOut({
        name: token.name,
        image: token.image,
      });
    }
    handleClose();
  };
  const changeTokenLocation = () => {
    setSecondTokenAmount(firstTokenAmount);

    setFirstTokenAmount('');
    setRouteData({ success: false, isloading: true });
    if (tokenOut.name) {
      setTokenIn({
        name: tokenOut.name,
        image: tokenOut.image,
      });

      setTokenOut({
        name: tokenIn.name,
        image: tokenIn.image,
      });

      handleSwapTokenInput(firstTokenAmount, 'tokenOut');
    }
  };

  return (
    <>
      <div
        className={clsx(
          'bg-card-500 md:border border-y border-text-800 mt-[70px] lg:mt-[75px] md:rounded-3xl  text-white lg:w-640 py-5 mx-auto fade-in'
        )}
      >
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
              {slippage}%
            </span>
          </div>
          <TransactionSettings
            show={settingsShow}
            setSlippage={setSlippage}
            slippage={slippage}
            setSettingsShow={setSettingsShow}
          />
        </div>
        <div
          className={clsx(
            'lg:w-580 mt-4 h-[102px] border bg-muted-200/[0.1]  mx-5 lg:mx-[30px] rounded-2xl px-4 hover:border-text-700',
            firstTokenAmount > 100
              ? 'border-errorBorder hover:border-errorBorder bg-errorBg'
              : 'border-text-800 '
          )}
        >
          <div className="flex justify-between">
            <div
              className="flex-[0_0_50%] mt-4"
              onClick={() => handleTokenType('tokenIn')}
            >
              <TokenDropdown
                tokenIcon={tokenIn.image}
                tokenName={
                  tokenIn.name === 'tez'
                    ? 'TEZ'
                    : tokenIn.name === 'ctez'
                    ? 'CTEZ'
                    : tokenIn.name
                }
              />
            </div>
            <div className=" my-3 ">
              <div className="text-right font-body1 text-text-400">YOU PAY</div>
              <div>
                <input
                  type="text"
                  className={clsx(
                    'text-white bg-card-500 text-right border-0 font-medium2  lg:font-medium1 outline-none w-[100%]'
                  )}
                  placeholder="0.0"
                  onChange={(e) =>
                    handleSwapTokenInput(e.target.value, 'tokenIn')
                  }
                  value={firstTokenAmount}
                />
              </div>
            </div>
          </div>
          <div className="flex -mt-[12px]">
            <div className="text-left">
              <span className="text-text-600 font-body3">Balance:</span>{' '}
              <span className="font-body4 text-primary-500 2">--</span>
            </div>
            <div className="text-right ml-auto font-body2 text-text-400">
              ~$0.00
            </div>
          </div>
        </div>
        <div
          className="z-10 cursor-pointer relative top-[26px] bg-switchBorder w-[70px] h-[70px] p-px  mx-auto rounded-2xl "
          onClick={() => changeTokenLocation()}
        >
          <div className="p-[11.5px] bg-card-500 rounded-2xl  w-[68px] h-[68px]">
            <div className="bg-primary-500 p-2  w-[46px] h-[46px] rounded-lg ">
              <Image src={switchsvg} height={'32px'} width={'32px'} />
            </div>
          </div>
        </div>
        <div className=" pt-[41px] pb-5 border border-primary-500/[0.2] mx-px md:mx-2 lg:mx-2  px-5 lg:px-[22px] rounded-3xl bg-primary-500/[0.04]">
          <div className="lg:w-580  h-[102px] border border-text-800 rounded-2xl  px-4 border-primary-500/[0.2] bg-card-500">
            <div className=" flex justify-between">
              <div
                className="flex-[0_0_50%] mt-4"
                onClick={() => handleTokenType('tokenOut')}
              >
                {tokenOut.name !== 'false' ? (
                  <TokenDropdown
                    tokenIcon={tokenOut.image}
                    tokenName={
                      tokenOut.name === 'tez'
                        ? 'TEZ'
                        : tokenOut.name === 'ctez'
                        ? 'CTEZ'
                        : tokenOut.name
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
                  {tokenOut.name !== 'false' ? (
                    !routeData.isloading ? (
                      <input
                        type="text"
                        className={clsx(
                          'text-primary-500 bg-card-500 text-right border-0 font-input-text lg:font-medium1 outline-none w-[100%]'
                        )}
                        placeholder="0.0"
                        onChange={(e) =>
                          handleSwapTokenInput(e.target.value, 'tokenOut')
                        }
                        value={secondTokenAmount}
                      />
                    ) : (
                      <p className="  h-[32px] rounded animate-pulse bg-shimmer-100"></p>
                    )
                  ) : (
                    <input
                      type="text"
                      className={clsx(
                        'text-primary-500 bg-card-500 text-right border-0 w-[100%]  font-input-text lg:font-medium1 outline-none'
                      )}
                      placeholder="--"
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
                  --
                  {/* {tokenOut.name !== 'false' ? '0.34' : '--'} */}
                </span>
              </div>
              <div className="text-right ml-auto font-body2 text-text-400">
                ~$0.00
              </div>
            </div>
          </div>

          {(firstTokenAmount || secondTokenAmount) &&
            tokenOut.name !== 'false' && (
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

          {openSwapDetails && routeData.success && (
            <div className="bg-card-500 border border-text-700/[0.5] py-5 px-[22px] h-[218px] rounded-3xl mt-2 opendown-animation">
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
                <div className="mt-2 flex">
                  <span className="w-[28px] h-[28px]">
                    <Image src={plenty} width={'28px'} height={'28px'} />
                  </span>
                  <div className="border-dashed relative top-[11px] w-[19%] md:w-[31%] border-t-2 border-muted-50 mx-2"></div>
                  <div className="relative -top-[3px] rounded-2xl h-[32px] bg-card-600 p-px flex">
                    <span className="relative -left-[5px] top-px">
                      <span className="relative -right-[9px] z-100 w-[32px] h-[32px]  p-px">
                        <Image src={plenty} width={'28px'} height={'28px'} />
                      </span>
                      <span>
                        <Image src={plenty} width={'28px'} height={'28px'} />
                      </span>
                      <span className="relative -top-[9px] ml-[5px] h-5 px-[4.5px] py-1 bg-muted-100 rounded-xl font-subtitle4">
                        0.3%
                      </span>
                    </span>
                  </div>
                  <div className="border-dashed relative top-[11px]  w-[19%] md:w-[31%] border-t-2 border-muted-50 mx-2"></div>
                  <span className="w-[28px] h-[28px]">
                    <Image src={plenty} width={'28px'} height={'28px'} />
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="mt-5">{SwapButton}</div>
        </div>
      </div>

      <SwapModal
        tokens={tokens}
        show={swapModalShow}
        selectToken={selectToken}
        onhide={handleClose}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        tokenType={tokenType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </>
  );
}

export default Swap;
