import type { NextPage } from "next";
import Head from "next/head";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import MainAirdrop from "../../src/components/Airdrop";
import Disclaimer, { ChainAirdrop } from "../../src/components/Airdrop/Disclaimer";
import { MetaAirdrop } from "../../src/components/Meta/MetaAirdrop";
import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { FIRST_TIME_DISCLAIMER, TOKEN_A } from "../../src/constants/localStorage";
import { useInterval } from "../../src/hooks/useInterval";
import { createGaugeConfig, getConfig } from "../../src/redux/config/config";
import { getEpochData } from "../../src/redux/epoch/epoch";
import { AppDispatch, useAppSelector } from "../../src/redux/index";
import { getTotalVotingPower } from "../../src/redux/pools";
import { getLpTokenPrice, getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import { fetchWallet } from "../../src/redux/wallet/wallet";
import { getRewardsAprEstimate } from "../../src/redux/rewardsApr";

const Airdrop: NextPage = () => {
  // Select user's wallet address from the Redux store
  const userAddress = useAppSelector((state) => state.wallet.address);

  // Select token data from the Redux store
  const token = useAppSelector((state) => state.config.tokens);

  // Select totalVotingPowerError from the Redux store
  const totalVotingPowerError = useAppSelector((state) => state.pools.totalVotingPowerError);

  // Select epochError from the Redux store
  const epochError = useAppSelector((state) => state.epoch).epochFetchError;

  // Select token prices from the Redux store
  const tokenPrices = useAppSelector((state) => state.tokenPrice.tokenPrice);

  // Select AMM (Automated Market Maker) data from the Redux store
  const amm = useAppSelector((state) => state.config.AMMs);

  // Ref to track initial price call
  const initialPriceCall = useRef<boolean>(true);

  // Ref to track initial LP price call
  const initialLpPriceCall = useRef<boolean>(true);

  // Ref to track initial rewards APR call
  const initialRewardsAprCall = useRef<boolean>(true);

  // Select totalVotingPower from the Redux store
  const currentTotalVotingPower = useAppSelector((state) => state.pools.totalVotingPower);

  // Select rewards APR estimate error from the Redux store
  const rewardsAprEstimateError = useAppSelector(
    (state) => state.rewardsApr.rewardsAprEstimateError
  );

  const dispatch = useDispatch<AppDispatch>();

  // State for showing the disclaimer
  const [isDisclaimer, setIsDisclaimer] = useState(true);

  // Function to handle clicking and setting local storage for disclaimer
  const handleClick = () => {
    localStorage.setItem(FIRST_TIME_DISCLAIMER, "true");
  };

  // Fetch wallet and config data on component mount
  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
  }, []);

  // Fetch epoch data if there's an epoch error
  useEffect(() => {
    if (epochError) {
      dispatch(getEpochData());
    }
  }, [epochError]);

  // Use an interval to periodically fetch epoch data
  useInterval(() => {
    dispatch(getEpochData());
  }, 60000);

  // Fetch total voting power based on user's address
  useEffect(() => {
    dispatch(getTotalVotingPower());
  }, [userAddress]);

  // Handle fetching total voting power if there's an error
  useEffect(() => {
    if (totalVotingPowerError) {
      dispatch(getTotalVotingPower());
    }
  }, [totalVotingPowerError]);

  // Fetch token prices
  useEffect(() => {
    if (!initialPriceCall.current) {
      Object.keys(token).length !== 0 && dispatch(getTokenPrice());
    } else {
      initialPriceCall.current = false;
    }
  }, [token]);

  // Fetch LP token prices
  useEffect(() => {
    if (!initialLpPriceCall.current) {
      Object.keys(tokenPrices).length !== 0 && dispatch(getLpTokenPrice(tokenPrices));
    } else {
      initialLpPriceCall.current = false;
    }
  }, [tokenPrices]);

  // Create gauge configuration when AMM data is available
  useEffect(() => {
    Object.keys(amm).length !== 0 && dispatch(createGaugeConfig());
  }, [amm]);

  // Fetch rewards APR estimate when relevant data is available
  useEffect(() => {
    if (!initialRewardsAprCall.current) {
      if (Object.keys(tokenPrices).length !== 0) {
        dispatch(
          getRewardsAprEstimate({
            totalVotingPower: currentTotalVotingPower,
            tokenPrices,
          })
        );
      }
    } else {
      initialRewardsAprCall.current = false;
    }
  }, [currentTotalVotingPower, tokenPrices]);

  // Handle fetching rewards APR estimate if there's an error
  useEffect(() => {
    if (rewardsAprEstimateError && Object.keys(tokenPrices).length !== 0) {
      dispatch(
        getRewardsAprEstimate({
          totalVotingPower: currentTotalVotingPower,
          tokenPrices,
        })
      );
    }
  }, [rewardsAprEstimateError]);

  // State to track the selected chain
  const [chain, setChain] = useState<ChainAirdrop>(ChainAirdrop.Tezos);

  return (
    <>
      <MetaAirdrop />
      <SideBarHOC makeTopBarScroll>
        {!localStorage.getItem(FIRST_TIME_DISCLAIMER) ? (
          // Display disclaimer if it's the first time
          <Disclaimer
            show={isDisclaimer}
            setShow={setIsDisclaimer}
            chain={chain}
            setChain={setChain}
            handleClick={handleClick}
          />
        ) : (
          // Display the main airdrop component if the disclaimer has been accepted
          <MainAirdrop chain={chain} setChain={setChain} />
        )}
      </SideBarHOC>
    </>
  );
};

// PropTypes for the component
Airdrop.propTypes = {
  connectWallet: PropTypes.any,
  disconnectWallet: PropTypes.any,
  fetchWalletAddress: PropTypes.any,
  userAddress: PropTypes.any,
};

export default Airdrop;
