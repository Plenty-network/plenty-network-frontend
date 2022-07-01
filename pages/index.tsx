import type { NextPage } from 'next';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { SideBarHOC } from '../src/components/Sidebar/SideBarHOC';
import Swap from './Swap';
import { Provider } from 'react-redux';
import { store } from '../src/redux/index';
import {
  connectWallet,
  disconnectWallet,
} from '../src/redux/wallet/wallet.api';
import { useAppSelector } from '../src/redux/index';

const Home: NextPage = (props) => {
  const userAddress = useAppSelector((state) => state.wallet.address);

  const connectTempleWallet = async () => {
    if (userAddress === null) {
      return connectWallet();
    }
  };

  const disconnectUserWallet = async () => {
    if (userAddress) {
      return disconnectWallet();
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
