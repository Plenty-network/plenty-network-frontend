import type { NextPage } from "next";
import Router from "next/router";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SideBarHOC } from "../src/components/Sidebar/SideBarHOC";
import { AppDispatch, useAppSelector } from "../src/redux";
import { getConfig } from "../src/redux/config/config";
import { getEpochData } from "../src/redux/epoch/epoch";
import { getTokenPrice } from "../src/redux/tokenPrice/tokenPrice";
import { fetchWallet } from "../src/redux/wallet/wallet";

const Home: NextPage = () => {
  const token = useAppSelector((state) => state.config.tokens);
  //const state = useAppSelector((state) => state.epoch);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
    dispatch(getEpochData());
  }, []);
  useEffect(() => {
    Object.keys(token).length !== 0 && dispatch(getTokenPrice());
  }, [token]);
  useEffect(() => {  
    Router.push('/Swap')
  });
  return (
    <>
      
      <SideBarHOC>
        
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
