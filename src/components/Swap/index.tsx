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
import { allPaths, computeAllPathsWrapper } from '../../api/swap/router';

interface ISwapProps {
  className?: string;
  otherProps: {
    connectWallet: () => void;
    disconnectWallet: () => void;
    walletAddress: string;
  };
}

// const res = allPaths('tez', 'USDC.e');
// computeAllPaths(res, new BigNumber(1), new BigNumber(0.5));

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

  const loading = React.useRef<{
    isLoadingfirst?: boolean;
    isLoadingSecond?: boolean;
  }>({
    isLoadingfirst: false,
    isLoadingSecond: false,
  });

  const routeDetails = React.useRef<{
    feePerc: BigNumber[];
    fees: BigNumber[];
    minimum_Out: BigNumber[];
    tokenOut_amount: BigNumber;
    isStable: boolean[];
    path: string[];
    isLoading: boolean;
    success: boolean;
    exchangeRate: BigNumber;
    priceImpact: BigNumber;
  }>({
    fees: [],
    minimum_Out: [],
    tokenOut_amount: new BigNumber(0),
    feePerc: [],
    isStable: [],
    path: [],
    isLoading: false,
    priceImpact: new BigNumber(0),
    success: false,
    exchangeRate: new BigNumber(0),
  });

  const [tokenPrice, setTokenPrice] = useState<{
    [id: string]: number;
  }>({});
  const [allBalance, setAllBalance] = useState<{
    success: boolean;
    userBalance: { [id: string]: BigNumber };
  }>({ success: false, userBalance: {} });

  const allPath = React.useRef<string[]>([]);

  useEffect(() => {
    getTokenPrices().then((response) => {
      setTokenPrice(response.tokenPrice);
    });
    if (props.otherProps.walletAddress) {
      getCompleteUserBalace(props.otherProps.walletAddress).then((response) => {
        setAllBalance(response);
      });
    }
  }, [props.otherProps.walletAddress, TOKEN]);

  useEffect(() => {
    if (
      Object.prototype.hasOwnProperty.call(tokenIn, 'name') &&
      Object.prototype.hasOwnProperty.call(tokenOut, 'name')
    ) {
      firstTokenAmount === ''
        ? (loading.current = {
            isLoadingfirst: true,
            isLoadingSecond: false,
          })
        : (routeDetails.current = {
            fees: [],
            minimum_Out: [],
            tokenOut_amount: new BigNumber(0),
            feePerc: [],
            isStable: [],
            path: [],
            isLoading: false,
            priceImpact: new BigNumber(0),
            success: true,
            exchangeRate: new BigNumber(0),
          });

      const res = allPaths(tokenIn.name, tokenOut.name);
      allPath.current = res;
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
        console.log(1);
        handleSwapTokenInput(firstTokenAmount, 'tokenIn');
      }
    }
  }, [tokenIn, tokenOut]);

  const handleSwapTokenInput = (
    input: string | number,
    tokenType: 'tokenIn' | 'tokenOut'
  ) => {
    console.log('2');
    if (Object.keys(tokenOut).length !== 0) {
      loading.current = {
        isLoadingSecond: true,
        isLoadingfirst: false,
      };
    } else {
      routeDetails.current = {
        fees: [],
        minimum_Out: [],
        tokenOut_amount: new BigNumber(0),
        feePerc: [],
        isStable: [],
        path: [],
        isLoading: false,
        priceImpact: new BigNumber(0),
        success: false,
        exchangeRate: new BigNumber(0),
      };
    }
    if (input === '') {
      setFirstTokenAmount('');
      setSecondTokenAmount('');
      routeDetails.current = {
        fees: [],
        minimum_Out: [],
        tokenOut_amount: new BigNumber(0),
        feePerc: [],
        isStable: [],
        path: [],
        isLoading: false,
        priceImpact: new BigNumber(0),
        success: false,
        exchangeRate: new BigNumber(0),
      };
      loading.current = {
        isLoadingSecond: false,
        isLoadingfirst: false,
      };
    } else {
      console.log('3');
      if (tokenType === 'tokenIn') {
        setFirstTokenAmount(input);
        if (Object.keys(tokenOut).length !== 0) {
          console.log('4');
          loading.current = {
            isLoadingSecond: true,
            isLoadingfirst: false,
          };

          computeAllPaths(
            allPath.current,
            new BigNumber(input),
            new BigNumber(slippage)
          ).then((res) => {
            loading.current = {
              isLoadingSecond: false,
              isLoadingfirst: false,
            };
            routeDetails.current = {
              fees: res.fees,
              exchangeRate: new BigNumber(123),
              priceImpact: new BigNumber(123),
              feePerc: res.feePerc,
              minimum_Out: res.minimumTokenOut,
              path: res.path,
              isStable: res.isStable,
              tokenOut_amount: res.tokenOut_amount,
              isLoading: false,
              success: true,
            };
            setSecondTokenAmount(res.tokenOut_amount.toString());
          });
        }
      } else if (tokenType === 'tokenOut') {
        setSecondTokenAmount(input);

        setTimeout(() => {
          setFirstTokenAmount('12');
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
  console.log(routeDetails.current);

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
          setShowConfirmSwap={setShowConfirmSwap}
          showConfirmSwap={showConfirmSwap}
          setShowConfirmTransaction={setShowConfirmTransaction}
          showConfirmTransaction={showConfirmTransaction}
          setShowTransactionSubmitModal={setShowTransactionSubmitModal}
          showTransactionSubmitModal={showTransactionSubmitModal}
          loading={loading.current}
          setAllBalance={setAllBalance}
          resetAllValues={resetAllValues}
          routeDetails={routeDetails.current}
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
