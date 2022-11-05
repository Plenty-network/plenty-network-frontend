import { BigNumber } from "bignumber.js";
import Image from "next/image";
import * as React from "react";
import { useEffect, useState, useMemo } from "react";

import info from "../../../src/assets/icon/common/infoIcon.svg";

import { loadSwapDataWrapper } from "../../api/swap/wrappers";
import { getCompleteUserBalace, getPnlpBalance, getUserBalanceByRpc } from "../../api/util/balance";
import { getLPTokenPrice } from "../../api/util/price";
import { IAllBalanceResponse } from "../../api/util/types";
import playBtn from "../../assets/icon/common/playBtn.svg";
import { Chain, ITokenInterface, MigrateToken } from "../../config/types";
import {
  FIRST_TOKEN_AMOUNT,
  SECOND_TOKEN_AMOUNT,
  TOKEN_A,
  TOKEN_B,
} from "../../constants/localStorage";
import { tokensModal, tokenType } from "../../constants/swap";
import { useAppDispatch, useAppSelector } from "../../redux";
import { setFlashMessage } from "../../redux/flashMessage";
import { setIsLoadingWallet } from "../../redux/walletLoading";
import ConfirmTransaction from "../ConfirmTransaction";
import { Flashtype } from "../FlashScreen";
import { ISwapData, tokenParameterLiquidity } from "../Liquidity/types";
import { PopUpModal } from "../Modal/popupModal";
import { VideoModal } from "../Modal/videoModal";
import SwapModal from "../SwapModal/SwapModal";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import TransactionSubmitted from "../TransactionSubmitted";
import ConfirmAddPool from "./ConfirmAddPool";
import NewPoolMain from "./NewPoolMain";
import { TextNewPool } from "./TextNewPool";

export interface IManageLiquidityProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NewPool(props: IManageLiquidityProps) {
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [slippage, setSlippage] = useState<string>("0.5");
  const TOKEN = useAppSelector((state) => state.config.tokens);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const [pair, setPair] = useState("");
  const [firstTokenAmountLiq, setFirstTokenAmountLiq] = React.useState<string | number>("");
  const [secondTokenAmountLiq, setSecondTokenAmountLiq] = React.useState<number | string>("");

  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>({});

  const [isAddLiquidity, setIsAddLiquidity] = useState(true);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [burnAmount, setBurnAmount] = React.useState<string | number>("");
  const [transactionId, setTransactionId] = useState("");
  const swapData = React.useRef<ISwapData>({
    tokenInSupply: new BigNumber(0),
    tokenOutSupply: new BigNumber(0),
    lpToken: "",
    lpTokenSupply: new BigNumber(0),
    isloading: true,
  });

  const [removeTokenAmount, setRemoveTokenAmount] = useState({
    tokenOneAmount: "",
    tokenTwoAmount: "",
  });
  const tokens = useAppSelector((state) => state.config.standard);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const tokensArray = Object.entries(tokens);
  const dispatch = useAppDispatch();
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const [pnlpBalance, setPnlpBalance] = useState("");

  const [lpTokenPrice, setLpTokenPrice] = useState(new BigNumber(0));
  const [isLoading, setIsLoading] = useState(false);

  const [showConfirmPool, setShowConfirmPool] = useState(false);

  const [contentTransaction, setContentTransaction] = useState("");

  const [tokenIn, setTokenIn] = React.useState<tokenParameterLiquidity>(
    {} as tokenParameterLiquidity
  );
  const [tokenOut, setTokenOut] = React.useState<tokenParameterLiquidity>(
    {} as tokenParameterLiquidity
  );

  useEffect(() => {
    getLPTokenPrice(tokenIn.name, tokenOut.name, {
      [tokenIn.name]: tokenPrice[tokenIn.name],
      [tokenOut.name]: tokenPrice[tokenOut.name],
    }).then((res) => {
      setLpTokenPrice(res.lpTokenPrice);
    });
    if (walletAddress) {
      const updateBalance = async () => {
        const balancePromises = [];

        Object.keys(tokenIn).length !== 0 &&
          balancePromises.push(getUserBalanceByRpc(tokenIn.name, walletAddress));
        Object.keys(tokenOut).length !== 0 &&
          balancePromises.push(getUserBalanceByRpc(tokenOut.name, walletAddress));
        getPnlpBalance(tokenIn.name, tokenOut.name, walletAddress).then((res) => {
          setPnlpBalance(res.balance);
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
  }, [
    tokenIn,
    tokenOut,
    props,
    tokenPrice[tokenIn.name],
    tokenPrice[tokenOut.name],
    TOKEN,
    balanceUpdate,
    swapData.current,
  ]);

  const [swapModalShow, setSwapModalShow] = useState(false);
  useEffect(() => {
    if (
      Object.prototype.hasOwnProperty.call(tokenIn, "name") &&
      Object.prototype.hasOwnProperty.call(tokenOut, "name")
    ) {
      setIsLoading(true);
      loadSwapDataWrapper(tokenIn.name, tokenOut.name).then((response) => {
        if (response.success) {
          swapData.current = {
            tokenInSupply: response.tokenInSupply as BigNumber,
            tokenOutSupply: response.tokenOutSupply as BigNumber,
            lpToken: response.lpToken?.symbol,
            lpTokenSupply: response.lpTokenSupply,
            isloading: false,
          };
          setIsLoading(false);
        }
      });
    } else {
      swapData.current = {
        tokenInSupply: new BigNumber(0),
        tokenOutSupply: new BigNumber(0),
        lpToken: "",
        lpTokenSupply: new BigNumber(0),
        isloading: false,
      };
    }
  }, [tokenIn.name, tokenOut.name]);
  const [tokenType, setTokenType] = useState<tokenType>("tokenIn");
  const selectToken = (token: tokensModal) => {
    if ((tokenType === "tokenOut" || tokenType === "tokenIn") && firstTokenAmountLiq !== "") {
      setSecondTokenAmountLiq("");
    }
    if (tokenType === "tokenIn") {
      setTokenIn({
        name: token.name,
        symbol: token.name,
        image: token.image,
      });
    } else {
      setTokenOut({
        name: token.name,
        symbol: token.name,
        image: token.image,
      });
    }
    handleClose();
  };
  const handleClose = () => {
    setSwapModalShow(false);
    setSearchQuery("");
  };

  const resetAllValues = () => {
    setFirstTokenAmountLiq("");
    setSecondTokenAmountLiq("");

    setBalanceUpdate(false);
  };

  const closeModal = () => {
    props.setShow(false);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [allBalance, setAllBalance] = useState<{
    success: boolean;
    userBalance: { [id: string]: BigNumber };
  }>({ success: false, userBalance: {} });
  useEffect(() => {
    setAllBalance({ success: false, userBalance: {} });
    if (userAddress) {
      getCompleteUserBalace(userAddress).then((response: IAllBalanceResponse) => {
        setAllBalance(response);
      });
    } else {
      setAllBalance({ success: true, userBalance: {} });
      setUserBalances({});
    }
  }, [userAddress, TOKEN, balanceUpdate]);
  const tokensListConfig = useMemo(() => {
    return tokensArray.map((token) => ({
      name: token[0],
      image: `/assets/Tokens/${token[1].symbol}.png`,
      new: token[1].extras?.isNew as boolean,
      chainType: token[1].extras?.chain as Chain,
      address: token[1].address,
    }));
  }, [tokens]);
  tokensListConfig.sort(
    (a, b) => Number(allBalance.userBalance[b.name]) - Number(allBalance.userBalance[a.name])
  );
  const handleTokenType = (type: tokenType) => {
    setBalanceUpdate(false);
    setSwapModalShow(true);
    setTokenType(type);
  };
  const tEZorCTEZtoUppercase = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;

  const handleAddNewPoolOperation = () => {
    setShowConfirmPool(false);
    localStorage.setItem(TOKEN_A, tEZorCTEZtoUppercase(tokenIn.name));
    localStorage.setItem(TOKEN_B, tEZorCTEZtoUppercase(tokenOut.name));
    localStorage.setItem(FIRST_TOKEN_AMOUNT, Number(firstTokenAmountLiq).toFixed(2));
    localStorage.setItem(SECOND_TOKEN_AMOUNT, Number(secondTokenAmountLiq).toFixed(2));
    setContentTransaction(`new pool`);
    dispatch(setIsLoadingWallet({ isLoading: true, operationSuccesful: false }));
    setShowConfirmTransaction(true);
    /*uncomment and replace the operation name and rearrange the parameters */
    // Operationname(
    //   tokenIn.symbol,
    //   tokenOut.symbol,
    //   firstTokenAmountLiq,
    //   secondTokenAmountLiq,
    //   pair,
    //   transactionSubmitModal,
    //   resetAllValues,
    //   setShowConfirmTransaction,

    //   {
    //     flashType: Flashtype.Info,
    //     headerText: "Transaction submitted",
    //     trailingText: `Add new pool`,
    //     linkText: "View in Explorer",
    //     isLoading: true,

    //     transactionId: "",
    //   }
    // ).then((response) => {
    //   if (response.success) {
    //     setBalanceUpdate(true);
    //     //resetAllValues();
    //     setTimeout(() => {
    //       setShowTransactionSubmitModal(false);
    //       dispatch(
    //         setFlashMessage({
    //           flashType: Flashtype.Success,
    //           headerText: "Success",
    //           trailingText: `New pool`,
    //           linkText: "View in Explorer",
    //           isLoading: true,
    //           onClick: () => {
    //             window.open(
    //               `https://ghostnet.tzkt.io/${response.operationId ? response.operationId : ""}`,
    //               "_blank"
    //             );
    //           },
    //           transactionId: response.operationId ? response.operationId : "",
    //         })
    //       );
    //     }, 6000);
    //     dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
    //     setContentTransaction("");
    //   } else {
    //     setBalanceUpdate(true);
    //     //resetAllValues();
    //     setShowConfirmTransaction(false);
    //     setTimeout(() => {
    //       setShowTransactionSubmitModal(false);
    //       dispatch(
    //         setFlashMessage({
    //           flashType: Flashtype.Rejected,
    //           transactionId: "",
    //           headerText: "Rejected",
    //           trailingText: `New pool`,
    //           linkText: "",
    //           isLoading: true,
    //         })
    //       );
    //     }, 2000);

    //     dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
    //     setContentTransaction("");
    //   }
    // });
  };
  return (
    <>
      {props.show && (
        <PopUpModal
          onhide={closeModal}
          className="w-[390px] max-w-[390px] md:w-[620px] md:max-w-[620px] rounded-none md:rounded-3xl "
          footerChild={
            <div className="flex justify-center items-center gap-2 md:gap-4 px-4 md:px-0">
              <p className="font-subtitle1 md:text-f16 text-text-150"></p>
              <Image
                className="cursor-pointer hover:opacity-90"
                onClick={() => setShowVideoModal(true)}
                src={playBtn}
              />
            </div>
          }
        >
          <>
            <div className="flex ">
              <div className="mx-2 text-white font-title3">Add new pool</div>
              <div className="relative top-[2px]">
                <ToolTip
                  id="tooltip2"
                  position={Position.top}
                  disable={true}
                  toolTipChild={
                    <div className="w-[100px] md:w-[250px]">
                      Bribe voters to direct emissions towards your pool.
                    </div>
                  }
                >
                  <Image alt={"alt"} src={info} />
                </ToolTip>
              </div>
            </div>
            <div className="flex gap-1">
              <p className="ml-1 relative top-[6px]"></p>
            </div>
            <TextNewPool />
            <div className="">
              <NewPoolMain
                setShowConfirmPool={setShowConfirmPool}
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
                isLoading={isLoading}
                handleTokenType={handleTokenType}
                setPair={setPair}
                pair={pair}
              />
            </div>
          </>
        </PopUpModal>
      )}
      {showConfirmPool && (
        <ConfirmAddPool
          show={showConfirmPool}
          pair={pair}
          setShow={setShowConfirmPool}
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          firstTokenAmount={firstTokenAmountLiq}
          secondTokenAmount={secondTokenAmountLiq}
          onClick={handleAddNewPoolOperation}
          routeDetails={
            {} as {
              path: string[];
              minimumOut: BigNumber;
              minimumTokenOut: BigNumber[];
              priceImpact: BigNumber;
              finalFeePerc: BigNumber;
              feePerc: BigNumber[];
              isStable: boolean[];
              exchangeRate: BigNumber;
              success: boolean;
            }
          }
        />
      )}
      <SwapModal
        tokens={tokensListConfig.filter((e: any) => {
          return (
            e.name.toLowerCase() !== MigrateToken.PLENTY.toLowerCase() &&
            e.name.toLowerCase() !== MigrateToken.WRAP.toLowerCase()
          );
        })}
        show={swapModalShow}
        isLoading={allBalance.success}
        allBalance={allBalance.userBalance}
        selectToken={selectToken}
        onhide={handleClose}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        tokenType={tokenType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {showConfirmTransaction && (
        <ConfirmTransaction
          show={showConfirmTransaction}
          setShow={setShowConfirmTransaction}
          content={contentTransaction}
        />
      )}
      {showTransactionSubmitModal && (
        <TransactionSubmitted
          show={showTransactionSubmitModal}
          setShow={setShowTransactionSubmitModal}
          onBtnClick={
            transactionId
              ? () => window.open(`https://ghostnet.tzkt.io/${transactionId}`, "_blank")
              : null
          }
          content={contentTransaction}
        />
      )}
    </>
  );
}