import clsx from 'clsx';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { tokens } from '../../constants/tokensList';
import { useLocationStateInSwap } from '../../hooks/useLocationStateInSwap';
import SwapModal from '../../components/SwapModal/SwapModal';
import SwapTab from '../../components/Swap/SwapTab';
import {
  getCompleteUserBalace,
  getUserBalanceByRpc,
} from '../../api/util/balance';
import { getTokenPrices } from '../../api/util/price';
import {
  ERRORMESSAGES,
  tokenParameter,
  tokensModal,
  tokenType,
} from '../../constants/swap';
import { useAppSelector } from '../../redux';
import { BigNumber } from 'bignumber.js';
import { allPaths } from '../../api/swap/router';
import { computeAllPathsWrapper, reverseCalculation } from '../../api/swap/wrappers';

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
  const [errorMessage, setErrorMessage] = useState('');
  const [enableMultiHop, setEnableMultiHop] = useState(true);
  const loading = React.useRef<{
    isLoadingfirst?: boolean;
    isLoadingSecond?: boolean;
  }>({
    isLoadingfirst: false,
    isLoadingSecond: false,
  });

  const routeDetails = React.useRef<{
    path: string[];
    minimum_Out: BigNumber;
    minimumTokenOut: BigNumber[];
    priceImpact: BigNumber;
    finalFeePerc: BigNumber;
    feePerc: BigNumber[];
    isStable: boolean[];
    exchangeRate: BigNumber;
    success: boolean;
  }>({
    minimum_Out: new BigNumber(0),
    minimumTokenOut: [],
    feePerc: [],
    isStable: [],
    path: [],
    finalFeePerc: new BigNumber(0),
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
  const [allPathState, setAllPathState] = useState<string[]>([]);
  const allPathSwapData = React.useRef<any[][]>([]);
  const tokenPriceRef = React.useRef<{
    [id: string]: number;
  }>({});

  useEffect(() => {
    getTokenPrices().then((response) => {
      setTokenPrice(response.tokenPrice);
      tokenPriceRef.current = response.tokenPrice;
    });
    if (props.otherProps.walletAddress) {
      getCompleteUserBalace(props.otherProps.walletAddress).then(
        (response: any) => {
          setAllBalance(response);
        }
      );
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
            minimum_Out: new BigNumber(0),
            minimumTokenOut: [],
            feePerc: [],
            isStable: [],
            path: [],
            finalFeePerc: new BigNumber(0),
            priceImpact: new BigNumber(0),
            success: true,
            exchangeRate: new BigNumber(0),
          });

      allPaths(tokenIn.name, tokenOut.name, enableMultiHop).then((res) => {
        loading.current = {
          isLoadingfirst: false,
          isLoadingSecond: false,
        };

        allPath.current = res.paths;
        if (allPath.current.length !== 0) {
          setAllPathState(res.paths);
          allPathSwapData.current = res.swapData;
          setErrorMessage('');
        } else {
          setErrorMessage(
            enableMultiHop
              ? ERRORMESSAGES.SWAPROUTER
              : ERRORMESSAGES.SWAPMULTIHOP
          );

          setAllPathState([]);
          allPathSwapData.current = [];
          routeDetails.current = {
            minimum_Out: new BigNumber(0),
            minimumTokenOut: [],
            feePerc: [],
            isStable: [],
            path: [],
            finalFeePerc: new BigNumber(0),
            priceImpact: new BigNumber(0),
            success: false,
            exchangeRate: new BigNumber(0),
          };

          loading.current = {
            isLoadingfirst: false,
            isLoadingSecond: false,
          };
        }
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
  }, [tokenIn, tokenOut, tokenType, enableMultiHop]);

  const handleSwapTokenInput = (
    input: string | number,
    tokenType: 'tokenIn' | 'tokenOut'
  ) => {
    if (Object.keys(tokenOut).length !== 0) {
      loading.current = {
        isLoadingSecond: true,
        isLoadingfirst: false,
      };
    } else {
      routeDetails.current = {
        minimum_Out: new BigNumber(0),
        minimumTokenOut: [],
        feePerc: [],
        isStable: [],
        path: [],
        finalFeePerc: new BigNumber(0),
        priceImpact: new BigNumber(0),
        success: false,
        exchangeRate: new BigNumber(0),
      };
    }

    if (
      input === '' ||
      isNaN(Number(input)) ||
      (Object.keys(tokenOut).length !== 0 && allPath.current.length === 0)
    ) {
      setFirstTokenAmount('');
      setSecondTokenAmount('');
      routeDetails.current = {
        minimum_Out: new BigNumber(0),
        minimumTokenOut: [],
        feePerc: [],
        isStable: [],
        path: [],
        finalFeePerc: new BigNumber(0),
        priceImpact: new BigNumber(0),
        success: false,
        exchangeRate: new BigNumber(0),
      };
      loading.current = {
        isLoadingSecond: false,
        isLoadingfirst: false,
      };
    } else {
      if (tokenType === 'tokenIn') {
        setFirstTokenAmount(input);
        if (Object.keys(tokenOut).length !== 0) {
          loading.current = {
            isLoadingSecond: true,
            isLoadingfirst: false,
          };

          const res = computeAllPathsWrapper(
            allPath.current,
            new BigNumber(input),
            new BigNumber(slippage),
            allPathSwapData.current,
            tokenPriceRef.current
          );
          loading.current = {
            isLoadingSecond: false,
            isLoadingfirst: false,
          };
          routeDetails.current = {
            minimum_Out: res.finalMinimumTokenOut,
            minimumTokenOut: res.minimumTokenOut,
            feePerc: res.feePerc,
            isStable: res.isStable,
            path: res.path,
            finalFeePerc: res.finalFeePerc,
            priceImpact: res.finalPriceImpact,
            success: true,
            exchangeRate: res.exchangeRate,
          };
          setSecondTokenAmount(res.tokenOut_amount.toString());
        }
      } else if (tokenType === 'tokenOut') {
        setSecondTokenAmount(input);

        const res =  reverseCalculation(allPath.current, new BigNumber(input),new BigNumber(slippage),allPathSwapData.current, tokenPriceRef.current);
        console.log(res);
        
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
    routeDetails.current = {
      minimum_Out: new BigNumber(0),
      minimumTokenOut: [],
      feePerc: [],
      isStable: [],
      path: [],
      finalFeePerc: new BigNumber(0),
      priceImpact: new BigNumber(0),
      success: false,
      exchangeRate: new BigNumber(0),
    };
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
    if (tokenOut.name && tokenIn.name) {
      setTokenIn({
        name: tokenOut.name,
        image: tokenOut.image,
      });

      setTokenOut({
        name: tokenIn.name,
        image: tokenIn.image,
      });

      handleSwapTokenInput(firstTokenAmount, 'tokenOut');
    } else if (Object.keys(tokenOut).length === 0) {
      setTokenOut({
        name: tokenIn.name,
        image: tokenIn.image,
      });
      setTokenIn({} as tokenParameter);
    } else if (Object.keys(tokenIn).length === 0) {
      setTokenIn({
        name: tokenOut.name,
        image: tokenOut.image,
      });
      setTokenOut({} as tokenParameter);
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
          allPath={allPathState}
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
          setEnableMultiHop={setEnableMultiHop}
          enableMultiHop={enableMultiHop}
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
