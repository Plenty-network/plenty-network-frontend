import type { NextPage } from "next";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";
import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";

import Swap from "../../src/components/Swap";
import { useInterval } from "../../src/hooks/useInterval";
import { createGaugeConfig, getConfig } from "../../src/redux/config/config";
import { getEpochData } from "../../src/redux/epoch/epoch";
import { AppDispatch, useAppSelector } from "../../src/redux/index";
import { getTotalVotingPower } from "../../src/redux/pools";
import { getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import { fetchWallet, walletConnection, walletDisconnection } from "../../src/redux/wallet/wallet";
import { getRewardsAprEstimate } from "../../src/redux/rewardsApr";
import { useRouter } from "next/router";
import { analytics, firebase } from "../../src/config/firebaseConfig";

const Home: NextPage = () => {
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

  // Ref to track initial rewards APR call
  const initialRewardsAprCall = useRef<boolean>(true);

  // Select totalVotingPower from the Redux store
  const currentTotalVotingPower = useAppSelector((state) => state.pools.totalVotingPower);

  // Select rewards APR estimate error from the Redux store
  const rewardsAprEstimateError = useAppSelector(
    (state) => state.rewardsApr.rewardsAprEstimateError
  );

  // Next.js router instance
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  // Function to connect the wallet
  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };

  // Function to disconnect the user's wallet
  const disconnectUserWallet = async () => {
    if (userAddress) {
      return dispatch(walletDisconnection());
    }
  };

  // Props to pass to other pages
  const otherPageProps = {
    connectWallet: connectTempleWallet,
    disconnectWallet: disconnectUserWallet,
    walletAddress: userAddress,
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

  // Commented out section for LP token price (you can uncomment if needed)
  /* useEffect(() => {
    if(!initialLpPriceCall.current) {
      Object.keys(tokenPrices).length !== 0 && dispatch(getLpTokenPrice(tokenPrices));
    } else {
      initialLpPriceCall.current = false;
    }
  }, [tokenPrices]); */

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

  return (
    <>
      <SideBarHOC makeTopBarScroll>
        <Swap otherProps={otherPageProps} />
      </SideBarHOC>
    </>
  );
};

// PropTypes for the component
Home.propTypes = {
  connectWallet: PropTypes.any,
  disconnectWallet: PropTypes.any,
  fetchWalletAddress: PropTypes.any,
  userAddress: PropTypes.any,
};

export default Home;
