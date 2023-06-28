import type { NextPage } from "next";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
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

const Home: NextPage = () => {
  const userAddress = useAppSelector((state) => state.wallet.address);
  const token = useAppSelector((state) => state.config.tokens);
  const totalVotingPowerError = useAppSelector((state) => state.pools.totalVotingPowerError);
  const epochError = useAppSelector((state) => state.epoch).epochFetchError;
  const tokenPrices = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const amm = useAppSelector((state) => state.config.AMMs);
  const initialPriceCall = useRef<boolean>(true);
  // const initialLpPriceCall = useRef<boolean>(true);
  const initialRewardsAprCall = useRef<boolean>(true);
  const currentTotalVotingPower = useAppSelector((state) => state.pools.totalVotingPower);
  const rewardsAprEstimateError = useAppSelector((state) => state.rewardsApr.rewardsAprEstimateError);

  const dispatch = useDispatch<AppDispatch>();

  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
  }, []);
  useEffect(() => {
    if (epochError) {
      dispatch(getEpochData());
    }
  }, [epochError]);

  useInterval(() => {
    dispatch(getEpochData());
  }, 60000);
  useEffect(() => {
    dispatch(getTotalVotingPower());
  }, [userAddress]);
  useEffect(() => {
    if (totalVotingPowerError) {
      dispatch(getTotalVotingPower());
    }
  }, [totalVotingPowerError]);
  useEffect(() => {
    if(!initialPriceCall.current) {
      Object.keys(token).length !== 0 && dispatch(getTokenPrice());
    } else {
      initialPriceCall.current = false;
    }
  }, [token]);
  /* useEffect(() => {
    if(!initialLpPriceCall.current) {
      Object.keys(tokenPrices).length !== 0 && dispatch(getLpTokenPrice(tokenPrices));
    } else {
      initialLpPriceCall.current = false;
    }
  }, [tokenPrices]); */
  useEffect(() => {
    Object.keys(amm).length !== 0 && dispatch(createGaugeConfig());
  }, [amm]);
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
  const disconnectUserWallet = async () => {
    if (userAddress) {
      return dispatch(walletDisconnection());
    }
  };
  const otherPageProps = {
    connectWallet: connectTempleWallet,
    disconnectWallet: disconnectUserWallet,
    walletAddress: userAddress,
  };
  return (
    <>
      <SideBarHOC makeTopBarScroll>
        <Swap otherProps={otherPageProps} />
      </SideBarHOC>
    </>
  );
};
Home.propTypes = {
  connectWallet: PropTypes.any,
  disconnectWallet: PropTypes.any,
  fetchWalletAddress: PropTypes.any,
  userAddress: PropTypes.any,
};

export default Home;
