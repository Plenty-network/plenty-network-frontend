import type { NextPage } from "next";
import Head from "next/head";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import MainAirdrop from "../../src/components/Airdrop";
import Disclaimer, { ChainAirdrop } from "../../src/components/Airdrop/Disclaimer";
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
  useEffect(() => {
    if (epochError) {
      dispatch(getEpochData());
    }
  }, [epochError]);

  useInterval(() => {
    dispatch(getEpochData());
  }, 60000);
  useEffect(() => {
    if (userAddress) {
      dispatch(getTotalVotingPower());
    }
  }, [userAddress]);

  useEffect(() => {
    if (userAddress && totalVotingPowerError) {
      dispatch(getTotalVotingPower());
    }
  }, [totalVotingPowerError]);
  useEffect(() => {
    Object.keys(token).length !== 0 && dispatch(getTokenPrice());
  }, [token]);
  useEffect(() => {
    Object.keys(tokenPrices).length !== 0 && dispatch(getLpTokenPrice(tokenPrices));
  }, [tokenPrices]);
  useEffect(() => {
    Object.keys(amm).length !== 0 && dispatch(createGaugeConfig());
  }, [amm]);
  const [chain, setChain] = useState<ChainAirdrop>(ChainAirdrop.Tezos);
  return (
    <>
      <Head>
        <title>Plenty | Decentralized trading on Tezos</title>
        <meta
          content="Plenty is a decentralized exchange on the Tezos blockchain that allows users to trade and earn additional income through voting, staking, and providing liquidity. The platform offers both stable and volatile liquidity pools and a bridge from Ethereum and Polygon to Tezos."
          name="description"
        />
        <meta content="Plenty | Decentralized trading on Tezos" property="og:title" />
        <meta
          content="Plenty is a decentralized exchange on the Tezos blockchain that allows users to trade and earn additional income through voting, staking, and providing liquidity. The platform offers both stable and volatile liquidity pools and a bridge from Ethereum and Polygon to Tezos."
          property="og:description"
        />
        <meta content="/assets/airdropOG.png" property="og:image" />
        <meta content="Plenty | Decentralized trading on Tezos" property="twitter:title" />
        <meta
          content="Plenty is a decentralized exchange on the Tezos blockchain that allows users to trade and earn additional income through voting, staking, and providing liquidity. The platform offers both stable and volatile liquidity pools and a bridge from Ethereum and Polygon to Tezos."
          property="twitter:description"
        />
        <meta content="/assets/airdropOG.png" property="twitter:image" />
        <meta property="og:type" content="website" />
        <meta content="summary_large_image" name="twitter:card" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link
          href="https://uploads-ssl.webflow.com/6307b856943c0f1358714dab/6324cdd14e4daa665e7eddfc_fav-icon_32%20(1).png"
          rel="shortcut icon"
          type="image/x-icon"
        />
        <link
          href="https://uploads-ssl.webflow.com/6307b856943c0f1358714dab/6324cdc06009f1225eaf74c3_fav-icon_256%20(1).png"
          rel="apple-touch-icon"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      {/* <SideBarHOC makeTopBarScroll>
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
      </SideBarHOC> */}
      <div></div>
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
