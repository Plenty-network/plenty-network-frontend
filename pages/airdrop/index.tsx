import type { NextPage } from "next";
import Head from "next/head";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
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

const Airdrop: NextPage = () => {
  const userAddress = useAppSelector((state) => state.wallet.address);
  const token = useAppSelector((state) => state.config.tokens);
  const totalVotingPowerError = useAppSelector((state) => state.pools.totalVotingPowerError);
  const epochError = useAppSelector((state) => state.epoch).epochFetchError;
  const tokenPrices = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const amm = useAppSelector((state) => state.config.AMMs);

  const dispatch = useDispatch<AppDispatch>();
  const [isDisclaimer, setIsDisclaimer] = useState(true);

  const handleClick = () => {
    localStorage.setItem(FIRST_TIME_DISCLAIMER, "true");
  };
  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (epochError) {
      dispatch(getEpochData());
    }
  }, [epochError]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useInterval(() => {
    dispatch(getEpochData());
  }, 60000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (userAddress) {
      dispatch(getTotalVotingPower());
    }
  }, [userAddress]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (userAddress && totalVotingPowerError) {
      dispatch(getTotalVotingPower());
    }
  }, [totalVotingPowerError]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    Object.keys(token).length !== 0 && dispatch(getTokenPrice());
  }, [token]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    Object.keys(tokenPrices).length !== 0 && dispatch(getLpTokenPrice(tokenPrices));
  }, [tokenPrices]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    Object.keys(amm).length !== 0 && dispatch(createGaugeConfig());
  }, [amm]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
