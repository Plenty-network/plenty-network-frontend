import type { NextPage } from 'next';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { SideBarHOC } from '../src/components/Sidebar/SideBarHOC';

import { Provider } from 'react-redux';
import { AppDispatch, store } from '../src/redux/index';

import { useAppSelector } from '../src/redux/index';
import {
  fetchWallet,
  walletConnection,
  walletDisconnection,
} from '../src/redux/wallet/wallet';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getConfig } from '../src/redux/config/config';

const Home: NextPage = (props) => {
  const userAddress = useAppSelector((state) => state.wallet.address);

  const dispatch = useDispatch<AppDispatch>();

  const connectTempleWallet = () => {
    return dispatch(walletConnection());
  };
  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
  }, []);
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
      <Head>
        <title className="font-medium1">Plent network</title>
        <meta name="description" content="plenty network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBarHOC>
        <h1>heello world</h1>
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
