import { BigNumber } from "bignumber.js";
import Image from "next/image";
import * as React from "react";

import { useEffect, useState, useMemo } from "react";
import info from "../../../../src/assets/icon/common/infoIcon.svg";
import { getAllTokensBalanceFromTzkt, getPnlpBalance } from "../../../api/util/balance";
import { tEZorCTEZtoUppercase } from "../../../api/util/helpers";
import { getTokenDataFromTzkt } from "../../../api/util/tokens";
import { IAllTokensBalance, IAllTokensBalanceResponse } from "../../../api/util/types";
import { Chain, IConfigToken, MigrateToken } from "../../../config/types";
import { FIRST_TOKEN_AMOUNT, TOKEN_A, TOKEN_B } from "../../../constants/localStorage";
import { tokensModalNewPool, tokenType } from "../../../constants/swap";
import { deployStable, deployTezPair, deployVolatile } from "../../../operations/factory";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { getConfig } from "../../../redux/config/config";
import { setFlashMessage } from "../../../redux/flashMessage";
import { setIsLoadingWallet } from "../../../redux/walletLoading";
import ConfirmTransaction from "../../ConfirmTransaction";
import { Flashtype } from "../../FlashScreen";
import { ISwapData, tokenParameterLiquidity } from "../../Liquidity/types";
import { PopUpModal } from "../../Modal/popupModal";
import { Position, ToolTip } from "../../Tooltip/TooltipAdvanced";
import TransactionSubmitted from "../../TransactionSubmitted";

import NewPoolMain, { Pair } from "./NewPoolMain";
import { TextNewPool } from "./TextNewPool";
import TokenModalPool from "./tokenModalPool";
import { tzktExplorer } from "../../../common/walletconnect";
import ConfirmAddPoolv3 from "./ConfirmAddPool";
import { checkPoolExistence } from "../../../api/v3/factory";
import { deployPoolOperation } from "../../../operations/v3/factory";
import { Tick } from "@plenty-labs/v3-sdk";
import { getTickFromRealPrice } from "../../../api/v3/helper";

export interface IManageLiquidityProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLiquidityModal: (val: boolean) => void;
  showLiquidityModal: boolean;
  setReFetchPool: React.Dispatch<React.SetStateAction<boolean>>;
  reFetchPool: boolean;
  setShowLiquidityModalPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NewPoolv3(props: IManageLiquidityProps) {
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const TOKEN = useAppSelector((state) => state.config.tokens);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const [pair, setPair] = useState("");
  const [priceAmount, setPriceAmount] = useState("");

  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);

  const [transactionId, setTransactionId] = useState("");

  const tokens = useAppSelector((state) => state.config.tokens);
  const userAddress = useAppSelector((state) => state.wallet.address);
  const tokensArray = Object.entries(tokens);
  const dispatch = useAppDispatch();
  const transactionSubmitModal = (id: string) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const [selectedFeeTier, setSelectedFeeTier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showConfirmPool, setShowConfirmPool] = useState(false);

  const [contentTransaction, setContentTransaction] = useState("");
  const [tick, setTick] = useState("");

  const [tokenIn, setTokenIn] = React.useState<tokenParameterLiquidity>(
    {} as tokenParameterLiquidity
  );
  const [tokenOut, setTokenOut] = React.useState<tokenParameterLiquidity>(
    {} as tokenParameterLiquidity
  );
  const percentage = (selectedFeeTier: string) => {
    if (selectedFeeTier === "0.01") {
      return 1;
    } else if (selectedFeeTier === "0.05") {
      return 10;
    } else if (selectedFeeTier === "0.3") {
      return 60;
    } else {
      return 200;
    }
  };

  useEffect(() => {
    if (
      Number(priceAmount) > 0 &&
      Object.prototype.hasOwnProperty.call(tokenIn, "symbol") &&
      Object.prototype.hasOwnProperty.call(tokenOut, "symbol") &&
      selectedFeeTier !== ""
    ) {
      setTick("");
      getTickFromRealPrice(
        new BigNumber(priceAmount),
        tokenIn.symbol,
        tokenOut.symbol,
        percentage(selectedFeeTier)
      ).then((res) => {
        setTick(res);
      });
    }
  }, [priceAmount, tokenIn.symbol, tokenOut.symbol, selectedFeeTier]);
  const [swapModalShow, setSwapModalShow] = useState(false);

  const [tokenType, setTokenType] = useState<tokenType>("tokenIn");
  const selectToken = (token: tokensModalNewPool) => {
    if (tokenType === "tokenOut" || tokenType === "tokenIn") {
      setPriceAmount("");
      //setSecondTokenAmountLiq("");
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
  const closeModal = () => {
    props.setShow(false);
    setTokenIn({} as tokenParameterLiquidity);
    setTokenOut({} as tokenParameterLiquidity);
    setPriceAmount("");
    setSelectedFeeTier("");
  };
  const resetAllValues = () => {
    closeModal();
    setTokenIn({} as tokenParameterLiquidity);
    setTokenOut({} as tokenParameterLiquidity);
    setPriceAmount("");
    setSelectedFeeTier("");
    setBalanceUpdate(false);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [allBalance, setAllBalance] = useState<IAllTokensBalanceResponse>({
    success: false,
    allTokensBalances: {} as IAllTokensBalance,
  });
  useEffect(() => {
    if (props.show && userAddress) {
      getAllTokensBalanceFromTzkt(Object.values(tokens), userAddress).then(
        (response: IAllTokensBalanceResponse) => {
          setAllBalance(response);
        }
      );
    } else {
      setAllBalance({
        success: false,
        allTokensBalances: {} as IAllTokensBalance,
      });
    }
  }, [userAddress, TOKEN, balanceUpdate, tokenIn.name, tokenOut.name, props.show]);
  const [contractTokenBalance, setContractTokenBalance] = useState<IAllTokensBalance>(
    {} as IAllTokensBalance
  );

  useEffect(() => {
    if (searchQuery !== "" && searchQuery.length > 8) {
      getTokenDataFromTzkt(searchQuery.trim()).then((res) => {
        if (res.allTokensList.length !== 0) {
          getAllTokensBalanceFromTzkt(res.allTokensList, userAddress).then((res) => {
            // contractTokenBalance.push(res.allTokensBalances);
            setContractTokenBalance(res.allTokensBalances);
          });
        }
      });
    }
  }, [searchQuery]);
  const tokensListConfig = useMemo(() => {
    return tokensArray.map((token) => ({
      name: token[0],
      image: `/assets/Tokens/${token[1].symbol}.png`,

      chainType: token[1].originChain as Chain,
      address: token[1].address,
      interface: token[1],
    }));
  }, [tokens]);
  const [refetch, setRefetch] = useState(false);
  useEffect(() => {
    if (refetch) {
      dispatch(getConfig());
    }
  }, [refetch]);
  useEffect(() => {
    if (
      (Object.keys(allBalance),
      length !== 0 && allBalance.success && Object.keys(allBalance.allTokensBalances).length !== 0)
    ) {
      tokensListConfig.sort(
        (a, b) =>
          Number(
            allBalance.allTokensBalances[b.name]?.balance
              ? allBalance.allTokensBalances[b.name]?.balance
              : 0
          ) -
          Number(
            allBalance.allTokensBalances[a.name]?.balance
              ? allBalance.allTokensBalances[a.name]?.balance
              : 0
          )
      );
    }
  }, [tokensListConfig, allBalance.allTokensBalances]);
  const [isExist, setIsExist] = useState<any>();
  useEffect(() => {
    setPair("");
    if (tokenIn.name && tokenOut.name) {
      checkPoolExistence(tokenIn.name, tokenOut.name).then((res) => {
        setIsExist(res);
      });
    }
  }, [tokenIn.name, tokenOut.name]);

  const handleTokenType = (type: tokenType) => {
    setBalanceUpdate(false);
    setSwapModalShow(true);
    setTokenType(type);
  };

  const handleAddNewPoolOperation = () => {
    setShowConfirmPool(false);
    localStorage.setItem(TOKEN_A, tEZorCTEZtoUppercase(tokenIn.name));
    localStorage.setItem(TOKEN_B, tEZorCTEZtoUppercase(tokenOut.name));
    setShowConfirmTransaction(true);
    deployPoolOperation(
      tokenIn.symbol,
      tokenOut.symbol,
      Number(tick),
      Number(selectedFeeTier) * 100,
      transactionSubmitModal,
      resetAllValues,
      setShowConfirmTransaction,
      {
        flashType: Flashtype.Info,
        headerText: "Transaction submitted",
        trailingText: `Addition of new ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(
          TOKEN_B
        )} pool`,
        linkText: "View in Explorer",
        isLoading: true,
        transactionId: "",
      }
    ).then((response) => {
      if (response.success) {
        setBalanceUpdate(true);

        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Success,
              headerText: "Success",
              trailingText: `Addition of new ${localStorage.getItem(
                TOKEN_A
              )}/${localStorage.getItem(TOKEN_B)} pool`,
              linkText: "View in Explorer",
              isLoading: true,
              onClick: () => {
                window.open(
                  `${tzktExplorer}${response.operationId ? response.operationId : ""}`,
                  "_blank"
                );
              },
              transactionId: response.operationId ? response.operationId : "",
            })
          );
        }, 6000);
        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
        // setContentTransaction("");
      } else {
        setBalanceUpdate(true);
        resetAllValues();
        setShowConfirmTransaction(false);
        setTimeout(() => {
          setShowTransactionSubmitModal(false);
          dispatch(
            setFlashMessage({
              flashType: Flashtype.Rejected,
              transactionId: "",
              headerText: "Rejected",
              trailingText: `Addition of new ${localStorage.getItem(
                TOKEN_A
              )}/${localStorage.getItem(TOKEN_B)} pool`,
              linkText: "",
              isLoading: true,
            })
          );
        }, 2000);

        dispatch(setIsLoadingWallet({ isLoading: false, operationSuccesful: true }));
        // setContentTransaction("");
      }
    });
  };
  return (
    <>
      {props.show && (
        <PopUpModal
          Name="Manage"
          onhide={closeModal}
          isFullSizeOnMobile={true}
          className="w-[400px] max-w-[400px] sm:w-[620px] sm:max-w-[620px] rounded-none sm:rounded-3xl "
        >
          <div className="px-2 md:px-5">
            <div className="flex ">
              <div className="mx-2 text-white font-title3">Add new pool</div>
              <div className="relative top-[2px]">
                <ToolTip
                  id="tooltip2"
                  position={Position.right}
                  toolTipChild={
                    <div className="w-[100px] md:w-[250px]">
                      Create a new liquidity pool for a token pair.
                    </div>
                  }
                >
                  <Image alt={"alt"} src={info} className="cursor-pointer" />
                </ToolTip>
              </div>
            </div>
            <div className="flex gap-1">
              <p className="ml-1 relative top-[6px]"></p>
            </div>
            <TextNewPool />
            <div className="">
              <NewPoolMain
                setSelectedFeeTier={setSelectedFeeTier}
                selectedFeeTier={selectedFeeTier}
                isExist={isExist}
                priceAmount={priceAmount}
                setPriceAmount={setPriceAmount}
                setShowConfirmPool={setShowConfirmPool}
                userBalances={allBalance.allTokensBalances}
                setShowLiquidityModalPopup={props.setShowLiquidityModalPopup}
                tokenIn={tokenIn}
                tokenOut={tokenOut}
                isLoading={isLoading}
                handleTokenType={handleTokenType}
                setPair={setPair}
                pair={pair}
                setShowLiquidityModal={props.setShowLiquidityModal}
                showLiquidityModal={props.showLiquidityModal}
                contractTokenBalance={contractTokenBalance}
              />
            </div>
          </div>
        </PopUpModal>
      )}
      {showConfirmPool && (
        <ConfirmAddPoolv3
          show={showConfirmPool}
          pair={pair}
          setShow={setShowConfirmPool}
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          priceAmount={priceAmount}
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
      <TokenModalPool
        tokens={tokensListConfig.filter((e: any) => {
          return (
            e.name.toLowerCase() !== MigrateToken.PLENTY.toLowerCase() &&
            e.name.toLowerCase() !== "XTZ".toLowerCase() &&
            e.name.toLowerCase() !== MigrateToken.WRAP.toLowerCase()
          );
        })}
        show={swapModalShow}
        isLoading={allBalance.success}
        allBalance={allBalance.allTokensBalances}
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
          content={`Addition of new ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(
            TOKEN_B
          )} pool`}
        />
      )}
      {showTransactionSubmitModal && (
        <TransactionSubmitted
          show={showTransactionSubmitModal}
          setShow={setShowTransactionSubmitModal}
          onBtnClick={
            transactionId ? () => window.open(`${tzktExplorer}${transactionId}`, "_blank") : null
          }
          content={`Addition of new ${localStorage.getItem(TOKEN_A)}/${localStorage.getItem(
            TOKEN_B
          )} pool`}
        />
      )}
    </>
  );
}
