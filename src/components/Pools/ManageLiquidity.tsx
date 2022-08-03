import * as React from 'react';
import Liquidity from '../Liquidity';
import { PopUpModal } from '../Modal/popupModal';
import { VideoModal } from '../Modal/videoModal';
import { InfoIconToolTip } from '../Tooltip/InfoIconTooltip';
import {
  ActiveLiquidity,
  ManageLiquidityHeader,
} from './ManageLiquidityHeader';

import { BigNumber } from 'bignumber.js';

import { useEffect, useMemo, useRef, useState } from 'react';
import playBtn from '../../assets/icon/common/playBtn.svg';
import Image from 'next/image';
import ConfirmAddLiquidity from '../Liquidity/ConfirmAddLiquidity';
import ConfirmRemoveLiquidity from '../Liquidity/ConfirmRemoveLiquidity';
import { useLocationStateInLiquidity } from '../../hooks/useLocationStateInLiquidity';
import { store, useAppDispatch, useAppSelector } from '../../redux';
import { getPnlpBalance, getUserBalanceByRpc } from '../../api/util/balance';
import { ISwapData } from '../Liquidity/types';
import {
  getPnlpOutputEstimate,
  getPoolShareForPnlp,
} from '../../api/liquidity';
import { loadSwapDataWrapper } from '../../api/swap/wrappers';
import { getDexType } from '../../api/util/fetchConfig';
import ConfirmTransaction from '../ConfirmTransaction';
import TransactionSubmitted from '../TransactionSubmitted';
import {
  BURN_AMOUNT,
  FIRST_TOKEN_AMOUNT_LIQ,
  SECOND_TOKEN_AMOUNT_LIQ,
  TOKEN_A,
  TOKEN_A_LIQ,
  TOKEN_B_LIQ,
} from '../../constants/localStorage';
import { setLoading } from '../../redux/isLoading/action';
import { addLiquidity } from '../../operations/addLiquidity';
import { removeLiquidity } from '../../operations/removeLiquidity';
import { getLPTokenPrice } from '../../api/util/price';

export interface IManageLiquidityProps {
  closeFn: Function;
}

export function ManageLiquidity(props: IManageLiquidityProps) {
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const { tokenIn, setTokenIn, tokenOut, setTokenOut } =
    useLocationStateInLiquidity();
  const TOKEN = useAppSelector((state) => state.config.tokens);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const [screen, setScreen] = React.useState('1');
  const [activeState, setActiveState] = React.useState<
    ActiveLiquidity | string
  >(ActiveLiquidity.Liquidity);

  const [firstTokenAmountLiq, setFirstTokenAmountLiq] = React.useState<
    string | number
  >('');
  const [secondTokenAmountLiq, setSecondTokenAmountLiq] = React.useState<
    number | string
  >('');
  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>(
    {}
  );
  const [isAddLiquidity, setIsAddLiquidity] = useState(true);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [burnAmount, setBurnAmount] = React.useState<string | number>('');
  const [transactionId, setTransactionId] = useState('');
  const swapData = React.useRef<ISwapData>({
    tokenInSupply: new BigNumber(0),
    tokenOutSupply: new BigNumber(0),
    lpToken: '',
    lpTokenSupply: new BigNumber(0),
  });
  const [removeTokenAmount, setRemoveTokenAmount] = useState({
    tokenOneAmount: '',
    tokenTwoAmount: '',
  });

  const dispatch = useAppDispatch();
  const [pnlpEstimates, setPnlpEstimates] = useState('');
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  const [sharePool, setSharePool] = useState('');
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] =
    useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const [pnlpBalance, setPnlpBalance] = useState('');
  const [lpTokenPrice, setLpTokenPrice] = useState(new BigNumber(0));
  useEffect(() => {
    if (walletAddress) {
      const updateBalance = async () => {
        const balancePromises = [];

        Object.keys(tokenIn).length !== 0 &&
          balancePromises.push(
            getUserBalanceByRpc(tokenIn.name, walletAddress)
          );
        Object.keys(tokenOut).length !== 0 &&
          balancePromises.push(
            getUserBalanceByRpc(tokenOut.name, walletAddress)
          );
        getPnlpBalance(tokenIn.name, tokenOut.name, walletAddress).then(
          (res) => {
            setPnlpBalance(res.balance);
          }
        );
        getLPTokenPrice(tokenIn.name, tokenOut.name, {
          [tokenIn.name]: tokenPrice[tokenIn.name],
          [tokenOut.name]: tokenPrice[tokenOut.name],
        }).then((res) => {
          setLpTokenPrice(res.lpTokenPrice);
        });
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
  }, [tokenIn, tokenOut, props, tokenPrice, TOKEN, balanceUpdate]);
  useEffect(() => {
    if (
      Object.prototype.hasOwnProperty.call(tokenIn, 'name') &&
      Object.prototype.hasOwnProperty.call(tokenOut, 'name')
    ) {
      loadSwapDataWrapper(tokenIn.name, tokenOut.name).then((response) => {
        swapData.current = {
          tokenInSupply: response.tokenInSupply as BigNumber,
          tokenOutSupply: response.tokenOutSupply as BigNumber,
          lpToken: response.lpToken?.symbol,
          lpTokenSupply: response.lpTokenSupply,
        };
      });
    }
  }, []);

  useEffect(() => {
    if (firstTokenAmountLiq > 0 && secondTokenAmountLiq > 0 && isAddLiquidity) {
      const res = getPnlpOutputEstimate(
        tokenIn.symbol,
        tokenOut.symbol,
        firstTokenAmountLiq.toString(),
        secondTokenAmountLiq.toString(),
        swapData.current.tokenInSupply as BigNumber,
        swapData.current.tokenOutSupply as BigNumber,
        swapData.current.lpTokenSupply,
        swapData.current.lpToken
      );
      setPnlpEstimates(res.pnlpEstimate);
      const sharePool = getPoolShareForPnlp(
        res.pnlpEstimate,
        swapData.current.lpTokenSupply
      );
      setSharePool(sharePool.pnlpPoolShare);
    } else if (burnAmount > 0 && !isAddLiquidity) {
      const sharePool = getPoolShareForPnlp(
        burnAmount.toString(),
        swapData.current.lpTokenSupply
      );
      setSharePool(sharePool.pnlpPoolShare);
    }
  }, [firstTokenAmountLiq, secondTokenAmountLiq, screen, burnAmount]);
  const resetAllValues = () => {
    setFirstTokenAmountLiq('');
    setSecondTokenAmountLiq('');
    setBalanceUpdate(false);
    swapData.current = {
      tokenInSupply: new BigNumber(0),
      tokenOutSupply: new BigNumber(0),
      lpToken: '',
      lpTokenSupply: new BigNumber(0),
    };
  };

  const handleAddLiquidityOperation = () => {
    dispatch(setLoading(true));
    setShowConfirmTransaction(true);
    localStorage.setItem(
      TOKEN_A_LIQ,
      tokenIn.name === 'tez'
        ? 'TEZ'
        : tokenIn.name === 'ctez'
        ? 'CTEZ'
        : tokenIn.name
    );
    localStorage.setItem(
      TOKEN_B_LIQ,
      tokenOut.name === 'tez'
        ? 'TEZ'
        : tokenOut.name === 'ctez'
        ? 'CTEZ'
        : tokenOut.name
    );
    localStorage.setItem(
      FIRST_TOKEN_AMOUNT_LIQ,
      firstTokenAmountLiq.toString()
    );
    localStorage.setItem(
      SECOND_TOKEN_AMOUNT_LIQ,
      secondTokenAmountLiq.toString()
    );
    addLiquidity(
      tokenIn.symbol,
      tokenOut.symbol,
      firstTokenAmountLiq.toString(),
      secondTokenAmountLiq.toString(),
      walletAddress,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);
        //resetAllValues();
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        dispatch(setLoading(false));
        setScreen('1');
      } else {
        setBalanceUpdate(true);
        //resetAllValues();
        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);

        dispatch(setLoading(false));
      }
    });
    setScreen('1');
  };

  const handleRemoveLiquidityOperation = () => {
    dispatch(setLoading(true));
    setShowConfirmTransaction(true);
    localStorage.setItem(BURN_AMOUNT, burnAmount.toString());
    removeLiquidity(
      tokenIn.symbol,
      tokenOut.symbol,
      swapData.current.lpToken as string,
      removeTokenAmount.tokenOneAmount.toString(),
      removeTokenAmount.tokenTwoAmount.toString(),
      burnAmount.toString(),
      walletAddress,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);
        dispatch(setLoading(false));
      } else {
        setBalanceUpdate(true);

        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
        }, 2000);

        dispatch(setLoading(false));
      }
    });
  };

  return (
    <>
      <PopUpModal
        onhide={props.closeFn}
        className="w-[620px] max-w-[620px]"
        footerChild={
          <div className="flex justify-center items-center gap-4">
            <p className="text-f16 text-text-150">
              Add liquidity, stake, and earn PLY
            </p>
            <Image
              className="cursor-pointer hover:opacity-90"
              onClick={() => setShowVideoModal(true)}
              src={playBtn}
            />
          </div>
        }
      >
        {screen === '1' && (
          <>
            <div className="flex gap-1">
              <p>Manage Liquidity </p>
              <InfoIconToolTip message="Hello world" />
            </div>
            <ManageLiquidityHeader
              className="mt-5 mb-6"
              activeStateTab={activeState}
              setActiveStateTab={setActiveState}
            />

            {activeState === ActiveLiquidity.Liquidity && (
              <div className="">
                <Liquidity
                  setScreen={setScreen}
                  firstTokenAmount={firstTokenAmountLiq}
                  secondTokenAmount={secondTokenAmountLiq}
                  userBalances={userBalances}
                  setSecondTokenAmount={setSecondTokenAmountLiq}
                  setFirstTokenAmount={setFirstTokenAmountLiq}
                  tokenIn={tokenIn}
                  tokenOut={tokenOut}
                  setIsAddLiquidity={setIsAddLiquidity}
                  isAddLiquidity={isAddLiquidity}
                  swapData={swapData.current}
                  pnlpBalance={pnlpBalance}
                  setBurnAmount={setBurnAmount}
                  burnAmount={burnAmount}
                  setRemoveTokenAmount={setRemoveTokenAmount}
                  removeTokenAmount={removeTokenAmount}
                  setSlippage={setSlippage}
                  slippage={slippage}
                  lpTokenPrice={lpTokenPrice}
                />
              </div>
            )}
            {activeState === ActiveLiquidity.Rewards && (
              <div className="">Rewards</div>
            )}
            {activeState === ActiveLiquidity.Staking && (
              <div className="">Staking</div>
            )}
          </>
        )}
        {screen === '2' && (
          <>
            <ConfirmAddLiquidity
              setScreen={setScreen}
              firstTokenAmount={firstTokenAmountLiq}
              secondTokenAmount={secondTokenAmountLiq}
              tokenIn={tokenIn}
              tokenOut={tokenOut}
              tokenPrice={tokenPrice}
              pnlpEstimates={pnlpEstimates}
              sharePool={sharePool}
              handleAddLiquidityOperation={handleAddLiquidityOperation}
            />
          </>
        )}
        {screen === '3' && (
          <>
            <ConfirmRemoveLiquidity
              setScreen={setScreen}
              tokenIn={tokenIn}
              tokenOut={tokenOut}
              tokenPrice={tokenPrice}
              burnAmount={burnAmount}
              pnlpEstimates={pnlpEstimates}
              sharePool={sharePool}
              handleRemoveLiquidityOperation={handleRemoveLiquidityOperation}
              removeTokenAmount={removeTokenAmount}
            />
          </>
        )}
      </PopUpModal>
      {showVideoModal && (
        <VideoModal closefn={setShowVideoModal} linkString={'Bh5zuEI4M9o'} />
      )}
      {showConfirmTransaction && (
        <ConfirmTransaction
          show={showConfirmTransaction}
          setShow={setShowConfirmTransaction}
          content={
            isAddLiquidity
              ? `Mint ${Number(firstTokenAmountLiq).toFixed(2)} ${
                  tokenIn.name === 'tez'
                    ? 'TEZ'
                    : tokenIn.name === 'ctez'
                    ? 'CTEZ'
                    : tokenIn.name
                } / ${Number(secondTokenAmountLiq).toFixed(4)} ${
                  tokenOut.name === 'tez'
                    ? 'TEZ'
                    : tokenOut.name === 'ctez'
                    ? 'CTEZ'
                    : tokenOut.name
                } `
              : `Burn ${Number(burnAmount).toFixed(2)} PNLP `
          }
        />
      )}
      {showTransactionSubmitModal && (
        <TransactionSubmitted
          show={showTransactionSubmitModal}
          setShow={setShowTransactionSubmitModal}
          onBtnClick={
            transactionId
              ? () => window.open(`https://tzkt.io/${transactionId}`, '_blank')
              : null
          }
          content={
            isAddLiquidity
              ? `Mint ${Number(
                  localStorage.getItem(FIRST_TOKEN_AMOUNT_LIQ)
                ).toFixed(2)} ${localStorage.getItem(TOKEN_A_LIQ)} / ${Number(
                  localStorage.getItem(SECOND_TOKEN_AMOUNT_LIQ)
                ).toFixed(4)} ${localStorage.getItem(TOKEN_B_LIQ)} `
              : `Burn ${Number(localStorage.getItem(BURN_AMOUNT)).toFixed(
                  2
                )} PNLP `
          }
        />
      )}
    </>
  );
}
