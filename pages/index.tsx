import type { NextPage } from 'next';
import Head from 'next/head';
import Button from '../src/components/Button/Button';
import Card from '../src/components/Card/Card';
import Modal from '../src/components/Modal/Modal';
import { SideBarHOC } from '../src/components/Sidebar/SideBarHOC';
import Tooltip from '../src/components/Tooltip/Tooltip';
import styles from '../styles/Home.module.css';
import Swap from './Swap';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title className="font-medium1">Plent network</title>
        <meta name="description" content="plenty network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBarHOC>
        <Swap />
      </SideBarHOC>
    </>
  );
};

export default Home;
