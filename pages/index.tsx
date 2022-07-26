import type { NextPage } from 'next';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { SideBarHOC } from '../src/components/Sidebar/SideBarHOC';



const Home: NextPage = (props) => {
  return (
    <>
      <Head>
        <title className="font-medium1">Plent network</title>
        <meta name="description" content="plenty network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBarHOC>
        {/* <ShortCard /> */}
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
