import clsx from 'clsx';
import refresh from '../../../src/assets/icon/swap/refresh.svg';
import settings from '../../../src/assets/icon/swap/settings.svg';
import arrowDown from '../../../src/assets/icon/swap/arrowDown.svg';
import ratesrefresh from '../../../src/assets/icon/swap/ratesrefresh.svg';
import info from '../../../src/assets/icon/swap/info.svg';
import switchsvg from '../../../src/assets/icon/swap/switch.svg';
import ctez from '../../../src/assets/Tokens/ctez.png';
import Image from 'next/image';
import Lottie from 'lottie-react';
import Button from '../Button/Button';
import TokenDropdown from '../TokenDropdown/TokenDropdown';
import TransactionSettings from '../TransactionSettings/TransactionSettings';
import { useEffect, useMemo, useRef, useState } from 'react';
import { tokensModal, tokenType } from '../../../src/constants/swap';
import { useStateAnimate } from '../../hooks/useAnimateUseState';
import loader from '../../assets/animations/shimmer-swap.json';

import { BigNumber } from 'bignumber.js';

import { directSwapWrapper } from '../../operations/swap';
import ExpertModePopup from '../ExpertMode';
import ConfirmSwap from './ConfirmSwap';
import ConfirmTransaction from '../ConfirmTransaction';
import TransactionSubmitted from '../TransactionSubmitted';
import { getCompleteUserBalace } from '../../api/util/balance';
import Tooltip from '../Tooltip/Tooltip';

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
  setRecepient: any;
  recepient: string;
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
  routeData: {
    success: boolean;
    isloading: boolean;
  };
  setRouteData: any;
  setSwapDetails: any;
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
  swapData: {
    tokenIn_amount: BigNumber;
    exchangeFee: BigNumber;
    slippage: BigNumber;
    tokenIn: string;
    tokenOut: string;
    tokenIn_supply?: BigNumber;
    tokenOut_supply?: BigNumber;
    tokenIn_precision?: BigNumber;
    tokenOut_precision?: BigNumber;
    tezSupply?: BigNumber;
    ctezSupply?: BigNumber;
    target?: BigNumber;
  };
  showConfirmSwap: boolean;
  setShowConfirmSwap: any;
  showConfirmTransaction: any;
  setShowConfirmTransaction: any;
  showTransactionSubmitModal: boolean;
  setShowTransactionSubmitModal: any;
  allBalance: {
    [id: string]: BigNumber;
  };
  loading: {
    isLoadingfirst?: boolean;
    isLoadingSecond?: boolean;
  };
  refreshAllData?: (value: boolean) => void;
  isRefresh?: boolean;
  setAllBalance: any;
  resetAllValues: () => void;
}

function SwapTab(props: ISwapTabProps) {
  const [settingsShow, setSettingsShow] = useState(false);
  const refSettingTab = useRef(null);
  const [transactionId, setTransactionId] = useState('');
  const [openSwapDetails, setOpenSwapDetails, animateOpenSwapDetails] =
    useStateAnimate(false, 280);
  const [showRecepient, setShowRecepient] = useState(false);
  const [expertMode, setExpertMode] = useState(false);
  const [showExpertPopup, setShowExpertPopup] = useState(false);

  const [isRefresh, setRefresh] = useState(false);

  const refreshAllData = (value: boolean) => {
    setRefresh(value);
    setTimeout(() => {
      props.handleSwapTokenInput(props.firstTokenAmount, 'tokenIn');
      setRefresh(false);
    }, 1000);
  };
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    props.setShowTransactionSubmitModal(true);
  };
  const [isConvert, setConvert] = useState(false);
  const handleSwap = () => {
    props.setShowConfirmSwap(true);
  };
  const convertRates = (e: any) => {
    e.stopPropagation();
    setConvert(!isConvert);
  };
  const handleConfirmSwap = () => {
    props.setShowConfirmSwap(false);
    !expertMode && props.setShowConfirmTransaction(true);
    directSwapWrapper(
      props.tokenIn.name,
      props.tokenOut.name,
      props.swapDetails.minimum_Out,
      props.walletAddress,
      new BigNumber(props.firstTokenAmount),
      props.walletAddress,
      transactionSubmitModal,
      props.resetAllValues,
      !expertMode && props.setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        console.log(response);
        props.resetAllValues;
        props.setShowTransactionSubmitModal(false);
      } else {
        console.log('failed');
        props.resetAllValues;
        props.setShowConfirmTransaction(false);

        props.setShowTransactionSubmitModal(false);
      }
    });
  };
  useEffect(() => {
    getCompleteUserBalace(props.walletAddress).then((res) => {
      props.setAllBalance(res);
    });
  }, []);
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
      } else if (expertMode && Number(props.swapDetails.priceImpact) > 50) {
        return (
          <Button color="error" width="w-full" onClick={handleSwap}>
            Swap Anyway
          </Button>
        );
      } else {
        return (
          <Button color="primary" width="w-full" onClick={handleSwap}>
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
      <div className="flex items-center flex-row px-5 lg:px-9 relative">
        <div className="font-title2">Swap</div>
        <div
          className="py-1 cursor-pointer px-15 h-8 border border-text-700 rounded-[21px] ml-auto"
          onClick={() => refreshAllData(true)}
        >
          <Image src={refresh} height={'14px'} width={'15px'} />
        </div>
        <div
          ref={refSettingTab}
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
          setShowRecepient={setShowRecepient}
          setExpertMode={setExpertMode}
          expertMode={expertMode}
          setShowExpertPopup={setShowExpertPopup}
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
              {props.loading.isLoadingfirst ? (
                <p className=" my-[4px] h-[32px] rounded animate-pulse bg-shimmer-100"></p>
              ) : (
                <input
                  type="text"
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
              )}
            </div>
          </div>
        </div>
        <div className="flex -mt-[12px]">
          <div className="text-left">
            <span className="text-text-600 font-body3">Balance:</span>{' '}
            <span className="font-body4 text-primary-500 2">
              {Number(props.userBalances[props.tokenIn.name]) >= 0
                ? Number(props.userBalances[props.tokenIn.name]).toFixed(4)
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
        className="z-10 -mt-[25px] cursor-pointer relative top-[26px] bg-switchBorder w-[70px] h-[70px] p-px  mx-auto rounded-2xl "
        onClick={() => props.changeTokenLocation()}
      >
        <div className="p-[11.5px] bg-card-500 rounded-2xl  w-[68px] h-[68px]">
          <div className="bg-primary-500 p-2  w-[46px] h-[46px] rounded-lg ">
            <Image src={switchsvg} height={'32px'} width={'32px'} />
          </div>
        </div>
      </div>
      <div className=" pt-[41px]  pb-5 border border-primary-500/[0.2] mx-px md:mx-2 lg:mx-2  px-5 lg:px-[22px] rounded-3xl bg-primary-500/[0.04]">
        <div className="lg:w-580 secondtoken h-[102px] border border-text-800 rounded-2xl  px-4 border-primary-500/[0.2] hover:border-primary-500/[0.6] bg-card-500 hover:bg-primary-500/[0.02]">
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
                  props.loading.isLoadingSecond ? (
                    <p className="my-[4px]  h-[32px] rounded animate-pulse bg-shimmer-100"></p>
                  ) : (
                    <input
                      type="text"
                      className={clsx(
                        'text-primary-500  inputSecond text-right border-0 font-input-text lg:font-medium1 outline-none w-[100%] placeholder:text-primary-500 '
                      )}
                      placeholder="0.0"
                      lang="en_EN"
                      disabled
                      step="any"
                      onChange={(e) =>
                        props.handleSwapTokenInput(e.target.value, 'tokenOut')
                      }
                      value={props.secondTokenAmount}
                    />
                  )
                ) : (
                  <input
                    type="text"
                    className={clsx(
                      'text-primary-500 inputSecond  text-right border-0 w-[100%]  font-input-text lg:font-medium1 outline-none '
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
                  ? Number(props.userBalances[props.tokenOut.name]).toFixed(4)
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
        {showRecepient && (
          <div className="bg-card-500/[0.02] mt-2.5 rounded-2xl border border-primary-500/[0.2] h-[78px] py-3 px-[18px]">
            <div className="font-caption1 text-text-400">Send</div>
            <div>
              <input
                type="text"
                className={clsx(
                  'text-white  bg-card-500/[0.02] border-0 font-title1  outline-none w-[100%] placeholder:text-text-800/[0.8] '
                )}
                placeholder="Receipient address"
                onChange={(e) => props.setRecepient(e.target.value)}
                value={props.recepient}
              />
            </div>
          </div>
        )}

        {props.swapDetails.success && (
          <div
            className="h-12 mt-3 cursor-pointer px-4 pt-[13px] pb-[15px] rounded-2xl bg-muted-600 border border-primary-500/[0.2] items-center flex "
            onClick={() => setOpenSwapDetails(!openSwapDetails)}
          >
            {props.loading.isLoadingSecond ? (
              <div className="flex relative top-[8px]">
                <span className="ml-[6px] font-text-bold mr-[7px]">
                  {' '}
                  Fetching best price
                </span>
                <span className="relative -top-1">
                  <Lottie
                    animationData={loader}
                    loop={true}
                    style={{ height: '32px', width: '32px' }}
                  />
                </span>
              </div>
            ) : (
              <>
                <div>
                  <span className="relative top-0.5">
                    <Image src={info} width={'15px'} height={'15px'} />
                  </span>
                  <span className="ml-[9.25px] font-text-bold mr-[7px]">
                    {' '}
                    {!isConvert
                      ? `1 ${
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
                        }`
                      : `1 ${
                          props.tokenOut.name === 'tez'
                            ? 'TEZ'
                            : props.tokenOut.name === 'ctez'
                            ? 'CTEZ'
                            : props.tokenOut.name
                        } = ${Number(
                          1 / Number(props.swapDetails.exchangeRate)
                        ).toFixed(3)} ${
                          props.tokenIn.name === 'tez'
                            ? 'TEZ'
                            : props.tokenIn.name === 'ctez'
                            ? 'CTEZ'
                            : props.tokenIn.name
                        }`}
                  </span>
                  <span className="relative top-px">
                    <Image
                      src={ratesrefresh}
                      onClick={(e) => convertRates(e)}
                    />
                  </span>
                </div>
                <div className="ml-auto relative top-[3px]">
                  <Image
                    src={arrowDown}
                    className={
                      animateOpenSwapDetails ? 'rotate-180' : 'rotate-0'
                    }
                    width={'24px'}
                    height={'24px'}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {openSwapDetails && props.swapDetails.success && (
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
                  <Image src={info} width={'15px'} height={'15px'} />
                </span>
              </div>
              {isRefresh ? (
                <div className=" ml-auto h-[19px] rounded animate-pulse bg-shimmer-100 text-shimmer-100">
                  999999999999
                </div>
              ) : (
                <div className="ml-auto font-mobile-700 md:font-subtitle4">
                  {` ${Number(props.swapDetails.minimum_Out).toFixed(4)} ${
                    props.tokenOut.name === 'tez'
                      ? 'TEZ'
                      : props.tokenOut.name === 'ctez'
                      ? 'CTEZ'
                      : props.tokenOut.name
                  }`}
                </div>
              )}
            </div>

            <div className="flex mt-2">
              <div className="font-mobile-400 md:font-body3 ">
                <span className="mr-[5px]">Price Impact</span>
                <span className="relative top-0.5">
                  <Image src={info} width={'15px'} height={'15px'} />
                </span>
              </div>
              {isRefresh ? (
                <div className=" ml-auto h-[19px] rounded animate-pulse bg-shimmer-100 text-shimmer-100">
                  99999999
                </div>
              ) : (
                <div
                  className={clsx(
                    'ml-auto font-mobile-700 md:font-subtitle4',
                    Number(props.swapDetails.priceImpact) > 5 &&
                      'text-error-500'
                  )}
                >
                  {`${props.swapDetails.priceImpact.toFixed(4)} %`}
                </div>
              )}
            </div>
            <div className="flex mt-2">
              <div className="font-mobile-400 md:font-body3 ">
                <span className="mr-[5px]">Fee</span>
                <span className="relative top-0.5">
                  <Image src={info} width={'15px'} height={'15px'} />
                </span>
              </div>
              {isRefresh ? (
                <div className=" ml-auto h-[19px] rounded animate-pulse bg-shimmer-100 text-shimmer-100">
                  999999999999
                </div>
              ) : (
                <div className="ml-auto font-mobile-700 md:font-subtitle4">
                  {props.swapDetails.feePerc.toFixed(2)}
                </div>
              )}
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
              {isRefresh ? (
                <div className=" w-[110px] mt-2 h-[35px] rounded animate-pulse bg-shimmer-100 text-shimmer-100">
                  99999999
                </div>
              ) : (
                <>
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
                              <Image
                                src={ctez}
                                width={'28px'}
                                height={'28px'}
                              />
                            </span>
                          </div>
                          <div className="relative z-40 w-[32px] h-[32px]  p-0.5 bg-card-600 rounded-full">
                            <span className="w-[28px] h-[28px]">
                              <Image
                                src={ctez}
                                width={'28px'}
                                height={'28px'}
                              />
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
                </>
              )}
            </div>
          </div>
        )}
        <div className="mt-5">{SwapButton}</div>
      </div>
      {showExpertPopup && (
        <ExpertModePopup
          show={showExpertPopup}
          setShow={setShowExpertPopup}
          setExpertMode={setExpertMode}
        />
      )}
      {props.showConfirmSwap && (
        <ConfirmSwap
          show={props.showConfirmSwap}
          setShow={props.setShowConfirmSwap}
          tokenIn={props.tokenIn}
          tokenOut={props.tokenOut}
          firstTokenAmount={props.firstTokenAmount}
          secondTokenAmount={props.secondTokenAmount.toString()}
          swapDetails={props.swapDetails}
          onClick={handleConfirmSwap}
        />
      )}
      {props.showConfirmTransaction && (
        <ConfirmTransaction
          show={props.showConfirmTransaction}
          setShow={props.setShowConfirmTransaction}
          onClick={handleConfirmSwap}
          content={`Swap ${Number(props.firstTokenAmount).toFixed(2)} ${
            props.tokenIn.name === 'tez'
              ? 'TEZ'
              : props.tokenIn.name === 'ctez'
              ? 'CTEZ'
              : props.tokenIn.name
          } for ${Number(props.secondTokenAmount).toFixed(4)} ${
            props.tokenOut.name === 'tez'
              ? 'TEZ'
              : props.tokenOut.name === 'ctez'
              ? 'CTEZ'
              : props.tokenOut.name
          } `}
        />
      )}
      {props.showTransactionSubmitModal && (
        <TransactionSubmitted
          show={props.showTransactionSubmitModal}
          setShow={props.setShowTransactionSubmitModal}
          onClick={handleConfirmSwap}
          content={`Swap ${Number(props.firstTokenAmount).toFixed(2)} ${
            props.tokenIn.name === 'tez'
              ? 'TEZ'
              : props.tokenIn.name === 'ctez'
              ? 'CTEZ'
              : props.tokenIn.name
          } for ${Number(props.secondTokenAmount).toFixed(4)} ${
            props.tokenOut.name === 'tez'
              ? 'TEZ'
              : props.tokenOut.name === 'ctez'
              ? 'CTEZ'
              : props.tokenOut.name
          } `}
        />
      )}
    </>
  );
}

export default SwapTab;
