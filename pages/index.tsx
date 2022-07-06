import type { NextPage } from 'next';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Button from '../src/components/Button/Button';
import { PopUpModal } from '../src/components/Modal/popupModal';
import { SideBarHOC } from '../src/components/Sidebar/SideBarHOC';
import Swap from './Swap';
import { Provider } from 'react-redux';
import { AppDispatch, store } from '../src/redux/index';

import { useAppSelector } from '../src/redux/index';
import {
  walletConnection,
  walletDisconnection,
} from '../src/redux/wallet/wallet';
import { useDispatch } from 'react-redux';

const Home: NextPage = (props) => {
  const userAddress = useAppSelector((state) => state.wallet.address);
  const dispatch = useDispatch<AppDispatch>();

  const connectTempleWallet = () => {
    dispatch(walletConnection());
  };

  const disconnectUserWallet = async () => {
    if (userAddress) {
      dispatch(walletDisconnection());
    }
  };
  const otherPageProps = {
    connectWallet: connectTempleWallet,
    disconnectWallet: disconnectUserWallet,
    walletAddress: userAddress,
  };

  return (
    <Provider store={store}>
      <Head>
        <title className="font-medium1">Plent network</title>
        <meta name="description" content="plenty network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBarHOC>
        <Swap otherProps={otherPageProps} />
      </SideBarHOC>
    </Provider>
  );
};
Home.propTypes = {
  connectWallet: PropTypes.any,
  disconnectWallet: PropTypes.any,
  fetchWalletAddress: PropTypes.any,
  userAddress: PropTypes.any,
};

export default Home;
