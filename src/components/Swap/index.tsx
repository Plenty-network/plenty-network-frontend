import clsx from "clsx";
import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { tokensList } from "../../constants/tokensList";
import { useLocationStateInSwap } from "../../hooks/useLocationStateInSwap";
import SwapModal from "../../components/SwapModal/SwapModal";
import SwapTab from "../../components/Swap/SwapTab";
import { getCompleteUserBalace, getUserBalanceByRpc } from "../../api/util/balance";
import { ERRORMESSAGES, tokenParameter, tokensModal, tokenType } from "../../constants/swap";
import { useAppSelector } from "../../redux";
import { BigNumber } from "bignumber.js";
import { allPaths } from "../../api/swap/router";
import { computeAllPathsWrapper, computeReverseCalculationWrapper } from "../../api/swap/wrappers";
import { IAllBalanceResponse } from "../../api/util/types";
import { Chain } from "../../config/types";

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

  const tokens = useAppSelector((state) => state.config.standard);
  const tokensArray = Object.entries(tokens);
  const { tokenIn, setTokenIn, tokenOut, setTokenOut } = useLocationStateInSwap();

  const [firstTokenAmount, setFirstTokenAmount] = useState<string | number>("");
  const [secondTokenAmount, setSecondTokenAmount] = useState<number | string>("");
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [showConfirmSwap, setShowConfirmSwap] = useState(false);
  const [recepient, setRecepient] = useState("");
  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>({});
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

  const [allBalance, setAllBalance] = useState<{
    success: boolean;
    userBalance: { [id: string]: BigNumber };
  }>({ success: false, userBalance: {} });

  const allPath = React.useRef<string[]>([]);
  const allPath1 = React.useRef<string[]>([]);
  const [allPathState, setAllPathState] = useState<string[]>([]);
  const allPathSwapData = React.useRef<any[][]>([]);
  const allPathSwapData1 = React.useRef<any[][]>([]);
  const isSwitchClicked = React.useRef<boolean>(false);

  useEffect(() => {
    if (props.otherProps.walletAddress) {
      getCompleteUserBalace(props.otherProps.walletAddress).then(
        (response: IAllBalanceResponse) => {
          setAllBalance(response);
        }
      );
    } else {
      setAllBalance({ success: false, userBalance: {} });
      setUserBalances({});
    }
  }, [props.otherProps.walletAddress, TOKEN]);

  useEffect(() => {
    setSlippage(userSettings.slippage);
    setEnableMultiHop(userSettings.multiHop);
  }, [props.otherProps.walletAddress, userSettings]);
  useEffect(() => {
    if (Object.keys(tokenOut).length !== 0) {
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
      Object.prototype.hasOwnProperty.call(tokenOut, "name")
    ) {
      !isSwitchClicked.current && firstTokenAmount === ""
        ? (loading.current = {
            isLoadingfirst: true,
            isLoadingSecond: true,
          })
        : (routeDetails.current = {
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
  }, [tokenIn, tokenOut, tokenType, enableMultiHop, tokenPrice, isSwitchClicked.current]);

  const handleSwapTokenInput = (input: string | number, tokenType: "tokenIn" | "tokenOut") => {
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
          setSecondTokenAmount(
            res.tokenOutAmount.isLessThan(0) ? 0 : res.tokenOutAmount.toString()
          );
        }
      } else if (tokenType === "tokenOut") {
        setSecondTokenAmount(input.toString());
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
          setFirstTokenAmount(res.tokenOutAmount.isLessThan(0) ? 0 : res.tokenOutAmount.toString());
        }
      }
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
    loading.current = {
      isLoadingfirst: false,
      isLoadingSecond: true,
    };
    setSecondTokenAmount("");
    if (tokenOut.name && tokenIn.name) {
      setTokenIn({
        name: tokenOut.name,
        image: tokenOut.image,
      });

      setTokenOut({
        name: tokenIn.name,
        image: tokenIn.image,
      });
      inputValue > 0 &&
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
          const res = computeReverseCalculationWrapper(
            allPath1.current,
            new BigNumber(inputValue),
            new BigNumber(slippage),
            allPathSwapData1.current,
            tokenPrice,
            allPath.current,
            allPathSwapData.current
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

          setSecondTokenAmount(
            res.tokenOutAmount.isLessThan(0) ? 0 : res.tokenOutAmount.toString()
          );
          loading.current = {
            isLoadingSecond: false,
            isLoadingfirst: false,
          };
        }, 1000);
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
  useEffect(() => {
    if (props.otherProps.walletAddress) {
      const updateBalance = async () => {
        const balancePromises = [];

        Object.keys(tokenIn).length !== 0 &&
          balancePromises.push(getUserBalanceByRpc(tokenIn.name, props.otherProps.walletAddress));
        Object.keys(tokenOut).length !== 0 &&
          balancePromises.push(getUserBalanceByRpc(tokenOut.name, props.otherProps.walletAddress));

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
  }, [tokenIn, tokenOut, props.otherProps.walletAddress, TOKEN, balanceUpdate]);

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
          tokens={tokensList}
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
          setBalanceUpdate={setBalanceUpdate}
        />
      </div>
      <SwapModal
        tokens={tokensListConfig}
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
