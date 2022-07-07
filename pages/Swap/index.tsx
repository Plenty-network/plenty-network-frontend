import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { tokens } from '../../src/constants/Tokens';
import { useLocationStateInSwap } from '../../src/hooks/useLocationStateInSwap';
import SwapModal from '../../src/components/SwapModal/SwapModal';
import { tokensModal, tokenType } from '../../src/constants/swap';
import SwapTab from '../../src/components/Swap/SwapTab';
import { getUserBalanceByRpc } from '../../src/api/util/balance';
import { getTokenPrices } from '../../src/api/util/price';

interface ISwapProps {
  className?: string;
  otherProps: {
    connectWallet: () => void;
    disconnectWallet: () => void;
    walletAddress: string;
  };
}

function Swap(props: ISwapProps) {
  const { tokenIn, setTokenIn, tokenOut, setTokenOut } =
    useLocationStateInSwap();
  const [firstTokenAmount, setFirstTokenAmount] = useState<string | number>('');
  const [secondTokenAmount, setSecondTokenAmount] = useState<string | number>(
    ''
  );

  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>(
    {}
  );

  const [tokenType, setTokenType] = useState<tokenType>('tokenIn');
  const [searchQuery, setSearchQuery] = useState('');
  const [swapModalShow, setSwapModalShow] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [routeData, setRouteData] = useState({
    success: false,
    isloading: false,
  });
  getTokenPrices();
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
  useEffect(() => {
    if (props.otherProps.walletAddress) {
      const updateBalance = async () => {
        const tzBTCName = 'tzBTC';
        const balancePromises = [];
        tokenIn &&
          balancePromises.push(
            getUserBalanceByRpc(tokenIn.name, props.otherProps.walletAddress)
          );
        tokenOut &&
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
  }, [tokenIn, tokenOut, props]);

  return (
    <>
      <div
        className={clsx(
          'bg-card-500 md:border border-y border-text-800 mt-[70px] lg:mt-[75px] md:rounded-3xl  text-white lg:w-640 py-5 mx-auto fade-in'
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
        />
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
