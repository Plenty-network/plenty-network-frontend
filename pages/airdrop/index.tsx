import type { NextPage } from "next";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import MainAirdrop from "../../src/components/Airdrop";
import Disclaimer, { ChainAirdrop } from "../../src/components/Airdrop/Disclaimer";
import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { useInterval } from "../../src/hooks/useInterval";
import { setDisclaimer } from "../../src/redux/airdrop/disclaimer";
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
  const dis = useAppSelector((state) => state.Disclaimer.address);
  console.log("k", dis, "user", userAddress, !dis[userAddress]); //for testing
  const dispatch = useDispatch<AppDispatch>();
  const [isDisclaimer, setIsDisclaimer] = useState(false);

  const handleClick = () => {
    localStorage.setItem(`Airdrop${userAddress}`, "true");
    dispatch(
      setDisclaimer({
        address: userAddress,
        isChecked: true,
      })
    );
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
    setIsDisclaimer(!dis[userAddress]);
  }, [dis, userAddress]);
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
      <SideBarHOC makeTopBarScroll>
        {isDisclaimer ? (
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
