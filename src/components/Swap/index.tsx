import clsx from 'clsx';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { tokens } from '../../constants/Tokens';
import { useLocationStateInSwap } from '../../hooks/useLocationStateInSwap';
import SwapModal from '../../components/SwapModal/SwapModal';
import SwapTab from '../../components/Swap/SwapTab';
import {
  getCompleteUserBalace,
  getUserBalanceByRpc,
} from '../../api/util/balance';
import { getTokenPrices } from '../../api/util/price';
import { tokensModal, tokenType } from '../../constants/swap';

import { useAppSelector } from '../../redux';
import { BigNumber } from 'bignumber.js';
import {
  calculateTokensOutWrapper,
  loadSwapDataWrapper,
} from '../../api/swap/wrappers';

interface ISwapProps {
  className?: string;
  otherProps: {
    connectWallet: () => void;
    disconnectWallet: () => void;
    walletAddress: string;
  };
}

function Swap(props: ISwapProps) {
  const TOKEN = useAppSelector((state) => state.config.tokens);

  const { tokenIn, setTokenIn, tokenOut, setTokenOut } =
    useLocationStateInSwap();

  const [firstTokenAmount, setFirstTokenAmount] = useState<string | number>('');
  const [secondTokenAmount, setSecondTokenAmount] = useState<number | string>(
    ''
  );
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [showConfirmSwap, setShowConfirmSwap] = useState(false);
  const [recepient, setRecepient] = useState('');
  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>(
    {}
  );
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] =
    useState(false);
  const [tokenType, setTokenType] = useState<tokenType>('tokenIn');
  const [searchQuery, setSearchQuery] = useState('');
  const [swapModalShow, setSwapModalShow] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [routeData, setRouteData] = useState({
    success: false,
    isloading: false,
  });
  const swapData = React.useRef<{
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
  }>({
    tokenIn_amount: new BigNumber(0),
    tokenIn: tokenIn.name,
    tokenOut: tokenOut.name,
    exchangeFee: new BigNumber(0),
    slippage: new BigNumber(slippage),
  });
  const loading = React.useRef<{
    isLoadingfirst?: boolean;
    isLoadingSecond?: boolean;
  }>({
    isLoadingfirst: false,
    isLoadingSecond: false,
  });

  // const [swapData, setSwapData] = useState<{
  //   tokenIn_amount: BigNumber;
  //   exchangeFee: BigNumber;
  //   slippage: BigNumber;
  //   tokenIn: string;
  //   tokenOut: string;
  //   tokenIn_supply?: BigNumber;
  //   tokenOut_supply?: BigNumber;
  //   tokenIn_precision?: BigNumber;
  //   tokenOut_precision?: BigNumber;
  //   tezSupply?: BigNumber;
  //   ctezSupply?: BigNumber;
  //   target?: BigNumber;
  // }>({
  // tokenIn_amount: new BigNumber(0),
  // tokenIn: tokenIn.name,
  // tokenOut: tokenOut.name,
  // exchangeFee: new BigNumber(0),
  // slippage: new BigNumber(slippage),
  // });
  const [swapDetails, setSwapDetails] = useState<{
    exchangeRate: BigNumber;
    fees: BigNumber;
    minimum_Out: BigNumber;
    priceImpact: BigNumber;
    tokenOut_amount: BigNumber;
    feePerc: BigNumber;
    isLoading: boolean;
    success: boolean;
  }>({
    exchangeRate: new BigNumber(0),
    fees: new BigNumber(0),
    minimum_Out: new BigNumber(0),
    priceImpact: new BigNumber(0),
    tokenOut_amount: new BigNumber(0),
    feePerc: new BigNumber(0),
    isLoading: false,
    success: false,
  });

  const [tokenPrice, setTokenPrice] = useState<{
    [id: string]: number;
  }>({});
  const [allBalance, setAllBalance] = useState<{
    success: boolean;
    userBalance: { [id: string]: BigNumber };
  }>({ success: false, userBalance: {} });

  getTokenPrices().then((response) => {
    setTokenPrice(response.tokenPrice);
  });

  useEffect(() => {
    getCompleteUserBalace(props.otherProps.walletAddress).then((res) => {
      setAllBalance(res);
    });
  }, []);

  useEffect(() => {
    if (
      Object.prototype.hasOwnProperty.call(tokenIn, 'name') &&
      Object.prototype.hasOwnProperty.call(tokenOut, 'name')
    ) {
      swapData.current = {
        tokenIn_amount: new BigNumber(0),
        tokenIn: tokenIn.name,
        tokenOut: tokenOut.name,
        exchangeFee: new BigNumber(0),
        slippage: new BigNumber(slippage),
      };
      firstTokenAmount === ''
        ? (loading.current = {
            isLoadingfirst: true,
            isLoadingSecond: false,
          })
        : setSwapDetails({
            exchangeRate: new BigNumber(0),
            feePerc: new BigNumber(0),
            fees: new BigNumber(0),
            minimum_Out: new BigNumber(0),
            priceImpact: new BigNumber(0),
            tokenOut_amount: new BigNumber(0),
            isLoading: true,
            success: true,
          });
      loadSwapDataWrapper(tokenIn.name, tokenOut.name).then((res) => {
        swapData.current = res;

        loading.current = {
          isLoadingfirst: false,
          isLoadingSecond: false,
        };

        if (firstTokenAmount !== '') {
          loading.current = {
            isLoadingfirst: false,
            isLoadingSecond: true,
          };
          setSecondTokenAmount('');
          handleSwapTokenInput(firstTokenAmount, 'tokenIn');
        }
      });
    }
  }, [tokenIn, tokenOut]);

  const handleSwapTokenInput = (
    input: string | number,
    tokenType: 'tokenIn' | 'tokenOut'
  ) => {
    setRouteData({ success: false, isloading: true });

    if (Object.keys(tokenOut).length !== 0) {
      loading.current = {
        isLoadingSecond: true,
        isLoadingfirst: false,
      };
    } else {
      setSwapDetails({
        exchangeRate: new BigNumber(0),
        feePerc: new BigNumber(0),
        fees: new BigNumber(0),
        minimum_Out: new BigNumber(0),
        priceImpact: new BigNumber(0),
        tokenOut_amount: new BigNumber(0),
        isLoading: true,
        success: false,
      });
    }
    if (input === '') {
      setFirstTokenAmount('');
      setSecondTokenAmount('');
      setSwapDetails({
        exchangeRate: new BigNumber(0),
        fees: new BigNumber(0),
        feePerc: new BigNumber(0),
        minimum_Out: new BigNumber(0),
        priceImpact: new BigNumber(0),
        tokenOut_amount: new BigNumber(0),
        isLoading: true,
        success: false,
      });
      loading.current = {
        isLoadingSecond: false,
        isLoadingfirst: false,
      };
      setRouteData({ success: true, isloading: false });
    } else {
      if (tokenType === 'tokenIn') {
        setFirstTokenAmount(input);
        if (Object.keys(tokenOut).length !== 0) {
          loading.current = {
            isLoadingSecond: true,
            isLoadingfirst: false,
          };
          const res = calculateTokensOutWrapper(
            new BigNumber(input),
            swapData.current.exchangeFee,
            new BigNumber(slippage),
            tokenIn.name,
            tokenOut.name,
            swapData.current.tokenIn_supply ?? undefined,
            swapData.current.tokenOut_supply ?? undefined,
            swapData.current.tokenIn_precision ?? undefined,
            swapData.current.tokenOut_precision ?? undefined,
            swapData.current.tezSupply ?? undefined,
            swapData.current.ctezSupply ?? undefined,
            swapData.current.target ?? undefined
          );
          loading.current = {
            isLoadingSecond: false,
            isLoadingfirst: false,
          };
          setSecondTokenAmount(res.tokenOut_amount);
          setSwapDetails({
            exchangeRate: res.exchangeRate,
            fees: res.fees,
            feePerc: res.feePerc,
            minimum_Out: res.minimum_Out,
            priceImpact: res.priceImpact,
            tokenOut_amount: res.tokenOut_amount,
            isLoading: false,
            success: true,
          });
        }
      } else if (tokenType === 'tokenOut') {
        setSecondTokenAmount(input);

        setTimeout(() => {
          setFirstTokenAmount('12');
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
    setSearchQuery('');
  };

  const resetAllValues = () => {
    setFirstTokenAmount('');
    setSecondTokenAmount('');
    handleSwapTokenInput('', 'tokenIn');
  };

  const selectToken = (token: tokensModal) => {
    if (tokenType === 'tokenOut' && firstTokenAmount !== '') {
      setSecondTokenAmount('');

      loading.current = {
        isLoadingfirst: false,
        isLoadingSecond: true,
      };
    }
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
  useEffect(() => {
    if (props.otherProps.walletAddress) {
      const updateBalance = async () => {
        const balancePromises = [];

        Object.keys(tokenIn).length !== 0 &&
          balancePromises.push(
            getUserBalanceByRpc(tokenIn.name, props.otherProps.walletAddress)
          );
        Object.keys(tokenOut).length !== 0 &&
          balancePromises.push(
            getUserBalanceByRpc(tokenOut.name, props.otherProps.walletAddress)
          );

        const balanceResponse = await Promise.all(balancePromises);

        setUserBalances((prev) => ({
          ...prev,
          ...balanceResponse.reduce(
            (acc, cur) => ({
              ...acc,
              [cur.identifier]: cur.balance.toNumber(),
            }),
            {}
          ),
        }));
      };
      updateBalance();
    }
  }, [tokenIn, tokenOut, props, TOKEN]);

  return (
    <>
      <div
        className={clsx(
          'bg-card-500 md:border border-y border-text-800 mt-[70px] lg:mt-[75px] md:rounded-3xl  text-white lg:w-640 pt-5 pb-2 mx-auto fade-in'
        )}
      >
        <SwapTab
          walletAddress={props.otherProps.walletAddress}
          firstTokenAmount={firstTokenAmount}
          secondTokenAmount={secondTokenAmount}
          connectWallet={props.otherProps.connectWallet}
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          tokens={tokens}
          handleTokenType={handleTokenType}
          userBalances={userBalances}
          setSlippage={setSlippage}
          slippage={slippage}
          handleClose={handleClose}
          changeTokenLocation={changeTokenLocation}
          setSecondTokenAmount={setSecondTokenAmount}
          setFirstTokenAmount={setFirstTokenAmount}
          handleSwapTokenInput={handleSwapTokenInput}
          setTokenIn={setTokenIn}
          setTokenOut={setTokenOut}
          setTokenType={setTokenType}
          tokenPrice={tokenPrice}
          recepient={recepient}
          setRecepient={setRecepient}
          routeData={routeData}
          setRouteData={setRouteData}
          swapDetails={swapDetails}
          setSwapDetails={setSwapDetails}
          swapData={swapData.current}
          setShowConfirmSwap={setShowConfirmSwap}
          showConfirmSwap={showConfirmSwap}
          setShowConfirmTransaction={setShowConfirmTransaction}
          showConfirmTransaction={showConfirmTransaction}
          setShowTransactionSubmitModal={setShowTransactionSubmitModal}
          showTransactionSubmitModal={showTransactionSubmitModal}
          allBalance={allBalance.userBalance}
          loading={loading.current}
          setAllBalance={setAllBalance}
          resetAllValues={resetAllValues}
        />
      </div>
      <SwapModal
        tokens={tokens}
        show={swapModalShow}
        allBalance={allBalance.userBalance}
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
