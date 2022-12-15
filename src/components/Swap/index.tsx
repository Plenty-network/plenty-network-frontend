import clsx from "clsx";
import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { tokensList } from "../../constants/tokensList";
import { useLocationStateInSwap } from "../../hooks/useLocationStateInSwap";
import SwapModal from "../../components/SwapModal/SwapModal";
import SwapTab from "../../components/Swap/SwapTab";
import { getAllTokensBalanceFromTzkt } from "../../api/util/balance";
import { ERRORMESSAGES, tokenParameter, tokensModal, tokenType } from "../../constants/swap";
import { useAppSelector } from "../../redux";
import { BigNumber } from "bignumber.js";
import { allPaths } from "../../api/swap/router";
import { computeAllPathsWrapper, computeReverseCalculationWrapper } from "../../api/swap/wrappers";
import {
  IAllBalanceResponse,
  IAllTokensBalance,
  IAllTokensBalanceResponse,
} from "../../api/util/types";
import { Chain, MigrateToken } from "../../config/types";
import { tEZorCTEZtoUppercase } from "../../api/util/helpers";

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
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const userSettings = useAppSelector((state) =>
    state.userSettings.settings[
      props.otherProps.walletAddress ? props.otherProps.walletAddress : ""
    ]
      ? state.userSettings.settings[
          props.otherProps.walletAddress ? props.otherProps.walletAddress : ""
        ]
      : state.userSettings.settings[""]
  );

  const tokens = useAppSelector((state) => state.config.tokens);
  const walletAddress = useAppSelector((state) => state.wallet.address);
  const tokensArray = Object.entries(tokens);
  const { tokenIn, setTokenIn, tokenOut, setTokenOut } = useLocationStateInSwap();

  const [firstTokenAmount, setFirstTokenAmount] = useState<string | number>("");
  const [secondTokenAmount, setSecondTokenAmount] = useState<number | string>("");
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [showConfirmSwap, setShowConfirmSwap] = useState(false);
  const [recepient, setRecepient] = useState("");

  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [tokenType, setTokenType] = useState<tokenType>("tokenIn");
  const [searchQuery, setSearchQuery] = useState("");
  const [swapModalShow, setSwapModalShow] = useState(false);
  const [slippage, setSlippage] = useState(Number(userSettings.slippage));

  const [balanceUpdate, setBalanceUpdate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [enableMultiHop, setEnableMultiHop] = useState(userSettings.multiHop);
  const loading = React.useRef<{
    isLoadingfirst?: boolean;
    isLoadingSecond?: boolean;
  }>({
    isLoadingfirst: false,
    isLoadingSecond: false,
  });

  const routeDetails = React.useRef<{
    path: string[];
    minimumOut: BigNumber;
    minimumTokenOut: BigNumber[];
    priceImpact: BigNumber;
    finalFeePerc: BigNumber;
    feePerc: BigNumber[];
    isStable: boolean[];
    exchangeRate: BigNumber;
    success: boolean;
  }>({
    minimumOut: new BigNumber(0),
    minimumTokenOut: [],
    feePerc: [],
    isStable: [],
    path: [],
    finalFeePerc: new BigNumber(0),
    priceImpact: new BigNumber(0),
    success: false,
    exchangeRate: new BigNumber(0),
  });

  const allPath = React.useRef<string[]>([]);
  const allPath1 = React.useRef<string[]>([]);
  const [allPathState, setAllPathState] = useState<string[]>([]);
  const allPathSwapData = React.useRef<any[][]>([]);
  const allPathSwapData1 = React.useRef<any[][]>([]);
  const isSwitchClicked = React.useRef<boolean>(false);

  const [allBalance, setAllBalance] = useState<IAllTokensBalanceResponse>({
    success: false,
    allTokensBalances: {} as IAllTokensBalance,
  });

  useEffect(() => {
    setAllBalance({
      success: false,
      allTokensBalances: {} as IAllTokensBalance,
    });

    if (walletAddress) {
      getAllTokensBalanceFromTzkt(Object.values(tokens), walletAddress).then(
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
  }, [walletAddress, tokens, balanceUpdate]);

  useEffect(() => {
    setSlippage(userSettings.slippage);
    setEnableMultiHop(userSettings.multiHop);
  }, [props.otherProps.walletAddress, userSettings]);
  useEffect(() => {
    if (
      Object.keys(tokenOut).length !== 0 &&
      tokenOut.name !== "" &&
      Object.keys(tokenIn).length !== 0 &&
      tokenIn.name !== ""
    ) {
      tokenPrice[tokenIn.name] || tokenPrice[tokenOut.name]
        ? (loading.current = {
            isLoadingfirst: true,
            isLoadingSecond: true,
          })
        : (loading.current = {
            isLoadingfirst: false,
            isLoadingSecond: false,
          });
    }
  }, [tokenPrice]);

  useEffect(() => {
    if (
      Object.prototype.hasOwnProperty.call(tokenIn, "name") &&
      Object.prototype.hasOwnProperty.call(tokenOut, "name") &&
      tokenIn.name !== "" &&
      tokenOut.name !== ""
    ) {
      !isSwitchClicked.current && firstTokenAmount === ""
        ? (loading.current = {
            isLoadingfirst: true,
            isLoadingSecond: true,
          })
        : Number(firstTokenAmount) !== 0 &&
          (routeDetails.current = {
            minimumOut: new BigNumber(0),
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
        if (res) {
          loading.current = {
            isLoadingfirst: false,
            isLoadingSecond: false,
          };
          allPath.current = res.paths;
          if (allPath.current.length !== 0) {
            setAllPathState(res.paths);
            allPathSwapData.current = res.swapData;
            setErrorMessage("");
          } else {
            setErrorMessage(enableMultiHop ? ERRORMESSAGES.SWAPROUTER : ERRORMESSAGES.SWAPMULTIHOP);

            setAllPathState([]);
            allPathSwapData.current = [];
            routeDetails.current = {
              minimumOut: new BigNumber(0),
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
          if (firstTokenAmount !== "" || secondTokenAmount !== "") {
            loading.current = {
              isLoadingfirst: false,
              isLoadingSecond: false,
            };
            !isSwitchClicked.current && setSecondTokenAmount("");
            !isSwitchClicked.current && handleSwapTokenInput(firstTokenAmount, "tokenIn");
          }
          allPaths(tokenOut.name, tokenIn.name, enableMultiHop).then((res) => {
            allPath1.current = res.paths;
            if (allPath1.current.length !== 0) {
              setAllPathState(res.paths);
              allPathSwapData1.current = res.swapData;
              setErrorMessage("");
            } else {
              setAllPathState([]);
              allPathSwapData1.current = [];
            }
          });
        }
      });
    }
  }, [
    tokenIn,
    tokenOut,
    tokenType,
    enableMultiHop,
    tokenPrice,
    isSwitchClicked.current,
    balanceUpdate,
  ]);

  const handleSwapTokenInput = (input: string | number, tokenType: "tokenIn" | "tokenOut") => {
    isSwitchClicked.current = false;
    var flag = 1;
    if (input == ".") {
      if (tokenType === "tokenIn") {
        setFirstTokenAmount("0.");
      } else {
        setSecondTokenAmount("0.");
      }
      return;
    }
    if (Object.keys(tokenOut).length !== 0) {
      loading.current = {
        isLoadingSecond: true,
        isLoadingfirst: false,
      };
    } else {
      routeDetails.current = {
        minimumOut: new BigNumber(0),
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
      input === "" ||
      isNaN(Number(input)) ||
      (Object.keys(tokenOut).length !== 0 && allPath.current.length === 0)
    ) {
      setFirstTokenAmount("");
      setSecondTokenAmount("");
      routeDetails.current = {
        minimumOut: new BigNumber(0),
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
    } else if (Number(input) === 0) {
      setFirstTokenAmount(input);

      routeDetails.current = {
        minimumOut: new BigNumber(0),
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
      setSecondTokenAmount(input);
    } else {
      if (tokenType === "tokenIn") {
        setFirstTokenAmount(input);
        const decimal = new BigNumber(input).decimalPlaces();

        if (
          input !== null &&
          decimal !== null &&
          new BigNumber(decimal).isGreaterThan(tokens[tokenIn.name].decimals)
        ) {
          flag = 0;
          setErrorMessage(
            `The Precision of ${tEZorCTEZtoUppercase(tokenIn.name)} token cant be greater than ${
              tokens[tokenIn.name].decimals
            } decimals`
          );
        }
        // if (flag === 1) {
        //   setErrorMessage("");
        // }

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
            tokenPrice
          );
          loading.current = {
            isLoadingSecond: false,
            isLoadingfirst: false,
          };
          routeDetails.current = {
            minimumOut: res.finalMinimumTokenOut,
            minimumTokenOut: res.minimumTokenOut,
            feePerc: res.feePerc,
            isStable: res.isStable,
            path: res.path,
            finalFeePerc: res.finalFeePerc,
            priceImpact: res.finalPriceImpact,
            success: true,
            exchangeRate: res.exchangeRate,
          };
          if (res.tokenOutAmount.isLessThan(0)) {
            flag = 0;
            setErrorMessage(ERRORMESSAGES.INSUFFICIENT_LIQUIDITY);
          }

          setSecondTokenAmount(
            res.tokenOutAmount.isLessThan(0) ? 0 : res.tokenOutAmount.toString()
          );
        }
      } else if (tokenType === "tokenOut") {
        setSecondTokenAmount(input.toString());
        const decimal = new BigNumber(input).decimalPlaces();

        if (
          input !== null &&
          decimal !== null &&
          new BigNumber(decimal).isGreaterThan(tokens[tokenOut.name].decimals)
        ) {
          flag = 0;
          setErrorMessage(
            `The Precision of ${tEZorCTEZtoUppercase(tokenOut.name)} token cant be greater than ${
              tokens[tokenOut.name].decimals
            } decimals`
          );
        }

        if (Object.keys(tokenIn).length !== 0) {
          loading.current = {
            isLoadingfirst: true,
            isLoadingSecond: false,
          };
          const res = computeReverseCalculationWrapper(
            allPath1.current,
            new BigNumber(input),
            new BigNumber(slippage),
            allPathSwapData1.current,
            tokenPrice,
            allPath.current,
            allPathSwapData.current
          );
          loading.current = {
            isLoadingSecond: false,
            isLoadingfirst: false,
          };
          routeDetails.current = {
            minimumOut: res.finalMinimumTokenOut,
            minimumTokenOut: res.minimumTokenOut,
            feePerc: res.feePerc,
            isStable: res.isStable,
            path: res.path,
            finalFeePerc: res.finalFeePerc,
            priceImpact: res.finalPriceImpact,
            success: true,
            exchangeRate: res.exchangeRate,
          };
          if (res.tokenOutAmount.isLessThan(0)) {
            flag = 0;
            setErrorMessage(ERRORMESSAGES.INSUFFICIENT_LIQUIDITY);
          }
          setFirstTokenAmount(res.tokenOutAmount.isLessThan(0) ? 0 : res.tokenOutAmount.toString());
        }
      }
    }

    if (flag === 1) {
      setErrorMessage("");
    }
  };

  const handleTokenType = (type: tokenType) => {
    setBalanceUpdate(false);
    setSwapModalShow(true);
    setTokenType(type);
  };

  const handleClose = () => {
    setSwapModalShow(false);
    setSearchQuery("");
  };

  const resetAllValues = () => {
    setFirstTokenAmount("");
    setSecondTokenAmount("");
    handleSwapTokenInput("", "tokenIn");
    routeDetails.current = {
      minimumOut: new BigNumber(0),
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
    isSwitchClicked.current = false;
    if ((tokenType === "tokenOut" || tokenType === "tokenIn") && firstTokenAmount !== "") {
      setSecondTokenAmount("");

      loading.current = {
        isLoadingfirst: false,
        isLoadingSecond: true,
      };
    }
    if (tokenType === "tokenIn") {
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
    const inputValue = secondTokenAmount;
    setFirstTokenAmount(inputValue.toString());

    isSwitchClicked.current = true;
    //setSecondTokenAmount(firstTokenAmount);
    setSecondTokenAmount("");
    if (
      Object.prototype.hasOwnProperty.call(tokenIn, "name") &&
      Object.prototype.hasOwnProperty.call(tokenOut, "name") &&
      tokenIn.name !== "" &&
      tokenOut.name !== ""
    ) {
      loading.current = {
        isLoadingfirst: false,
        isLoadingSecond: true,
      };
    }

    if (tokenOut.name && tokenIn.name) {
      setTokenIn({
        name: tokenOut.name,
        image: tokenOut.image,
      });

      setTokenOut({
        name: tokenIn.name,
        image: tokenIn.image,
      });
      if (inputValue > 0) {
        setTimeout(() => {
          routeDetails.current = {
            minimumOut: new BigNumber(0),
            minimumTokenOut: [],
            feePerc: [],
            isStable: [],
            path: [],
            finalFeePerc: new BigNumber(0),
            priceImpact: new BigNumber(0),
            success: true,
            exchangeRate: new BigNumber(0),
          };
          setAllPathState([]);

          const res = computeAllPathsWrapper(
            allPath.current,
            new BigNumber(inputValue),
            new BigNumber(slippage),
            allPathSwapData.current,
            tokenPrice
          );

          routeDetails.current = {
            minimumOut: res.finalMinimumTokenOut,
            minimumTokenOut: res.minimumTokenOut,
            feePerc: res.feePerc,
            isStable: res.isStable,
            path: res.path,
            finalFeePerc: res.finalFeePerc,
            priceImpact: res.finalPriceImpact,
            success: true,
            exchangeRate: res.exchangeRate,
          };
          res.tokenOutAmount.isLessThan(0)
            ? setErrorMessage(ERRORMESSAGES.INSUFFICIENT_LIQUIDITY)
            : setErrorMessage("");
          setSecondTokenAmount(
            res.tokenOutAmount.isLessThan(0) ? 0 : res.tokenOutAmount.toString()
          );
          loading.current = {
            isLoadingSecond: false,
            isLoadingfirst: false,
          };
          setSecondTokenAmount(
            res.tokenOutAmount.isLessThan(0) ? 0 : res.tokenOutAmount.toString()
          );
        }, 2000);
      } else {
        setSecondTokenAmount(0);
        loading.current = {
          isLoadingSecond: false,
          isLoadingfirst: false,
        };
      }
    } else if (Object.keys(tokenOut).length === 0) {
      loading.current = {
        isLoadingfirst: false,
        isLoadingSecond: false,
      };
      setTokenOut({
        name: tokenIn.name,
        image: tokenIn.image,
      });
      setTokenIn({} as tokenParameter);
    } else if (Object.keys(tokenIn).length === 0) {
      loading.current = {
        isLoadingfirst: false,
        isLoadingSecond: false,
      };
      setTokenIn({
        name: tokenOut.name,
        image: tokenOut.image,
      });
      setTokenOut({} as tokenParameter);
    }
  };

  const tokensListConfig = useMemo(() => {
    return tokensArray.map((token) => ({
      name: token[0],
      image: `/assets/Tokens/${token[1]?.symbol}.png`,
      chainType: token[1]?.originChain as Chain,
      address: token[1].address,
    }));
  }, [tokens]);
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

  return (
    <>
      <div
        className={clsx(
          "bg-card-500 md:border border-y border-text-800 mt-[70px] lg:mt-[75px] md:rounded-3xl  text-white lg:w-640 pt-5 pb-2 mx-auto fade-in"
        )}
      >
        <SwapTab
          walletAddress={props.otherProps.walletAddress}
          firstTokenAmount={firstTokenAmount}
          secondTokenAmount={secondTokenAmount}
          connectWallet={props.otherProps.connectWallet}
          tokenIn={tokenIn}
          tokenOut={tokenOut}
          tokens={tokensListConfig}
          handleTokenType={handleTokenType}
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
          resetAllValues={resetAllValues}
          routeDetails={routeDetails.current}
          allPath={allPathState}
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
          setEnableMultiHop={setEnableMultiHop}
          enableMultiHop={enableMultiHop}
          setBalanceUpdate={setBalanceUpdate}
          isSwitchClicked={isSwitchClicked.current}
          allBalance={allBalance}
        />
      </div>
      <SwapModal
        tokens={tokensListConfig.filter((e: any) => {
          return (
            e.name.toLowerCase() !== MigrateToken.PLENTY.toLowerCase() &&
            e.name.toLowerCase() !== MigrateToken.WRAP.toLowerCase()
          );
        })}
        show={swapModalShow}
        isSuccess={allBalance.success}
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
    </>
  );
}

export default Swap;
