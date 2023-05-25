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
  const userAddress = useAppSelector((state) => state.wallet.address);
  const token = useAppSelector((state) => state.config.tokens);
  const totalVotingPowerError = useAppSelector((state) => state.pools.totalVotingPowerError);
  const epochError = useAppSelector((state) => state.epoch).epochFetchError;
  const tokenPrices = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const amm = useAppSelector((state) => state.config.AMMs);
  const initialPriceCall = useRef<boolean>(true);
  const initialLpPriceCall = useRef<boolean>(true);
  const initialRewardsAprCall = useRef<boolean>(true);
  const currentTotalVotingPower = useAppSelector((state) => state.pools.totalVotingPower);
  const rewardsAprEstimateError = useAppSelector((state) => state.rewardsApr.rewardsAprEstimateError);

  const dispatch = useDispatch<AppDispatch>();
  const [isDisclaimer, setIsDisclaimer] = useState(true);

  const handleClick = () => {
    localStorage.setItem(FIRST_TIME_DISCLAIMER, "true");
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
  useEffect(() => {
    if(!initialLpPriceCall.current) {
      Object.keys(tokenPrices).length !== 0 && dispatch(getLpTokenPrice(tokenPrices));
    } else {
      initialLpPriceCall.current = false;
    }
  }, [tokenPrices]);
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
  const [chain, setChain] = useState<ChainAirdrop>(ChainAirdrop.Tezos);
  return (
    <>
      <MetaAirdrop />
      <SideBarHOC makeTopBarScroll>
        {!localStorage.getItem(FIRST_TIME_DISCLAIMER) ? (
          <Disclaimer
            show={isDisclaimer}
            setShow={setIsDisclaimer}
            chain={chain}
            setChain={setChain}
            handleClick={handleClick}
          />
        ) : (
          <MainAirdrop chain={chain} setChain={setChain} />
        )}
      </SideBarHOC>
      {/* <div></div> */}
    </>
  );
};
Airdrop.propTypes = {
  connectWallet: PropTypes.any,
  disconnectWallet: PropTypes.any,
  fetchWalletAddress: PropTypes.any,
  userAddress: PropTypes.any,
};

export default Airdrop;