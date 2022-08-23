import Head from 'next/head';
import Image from 'next/image';
import * as React from 'react';
import HeadInfo from '../../src/components/HeadInfo';
import {
  CardHeader,
  PoolsCardHeader,
} from '../../src/components/Pools/Cardheader';
import { ShortCard as PoolsTable } from '../../src/components/Pools/ShortCard';
import { SideBarHOC } from '../../src/components/Sidebar/SideBarHOC';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch, useAppSelector } from '../../src/redux';
import { fetchWallet } from '../../src/redux/wallet/wallet';
import { getConfig } from '../../src/redux/config/config';
import { getTokenPrice } from '../../src/redux/tokenPrice/tokenPrice';
import { getTotalVotingPower } from '../../src/redux/pools';
export interface IIndexProps {}
export enum AMM_TYPE {
  VOLATILE = 'VOLATILE',
  STABLE = 'STABLE',
  MYPOOS = 'MyPools',
}
export default function Pools(props: IIndexProps) {
  const [activeStateTab, setActiveStateTab] = React.useState<
    PoolsCardHeader | string
  >(PoolsCardHeader.All);
  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.config.tokens);
  const totalVotingPowerError = useAppSelector((state) => state.pools.totalVotingPowerError);

  const walletAddress = useAppSelector((state) => state.wallet.address);
  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
  }, []);
  useEffect(() => {
    if (walletAddress) {
      dispatch(getTotalVotingPower());
    }
  }, [walletAddress]);
  useEffect(() => {
    if (walletAddress && totalVotingPowerError) {
      dispatch(getTotalVotingPower());
    }
  }, [totalVotingPowerError]);
  useEffect(() => {
    Object.keys(token).length !== 0 && dispatch(getTokenPrice());
  }, [token]);
  const [searchValue, setSearchValue] = React.useState('');
  return (
    <>
      <Head>
        <title className="font-medium1">Plenty network</title>
        <meta name="description" content="plenty network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBarHOC>
        {/* className='' */}
        <div>
          <HeadInfo
            className="md:px-3"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          <CardHeader
            activeStateTab={activeStateTab}
            setActiveStateTab={setActiveStateTab}
            className="md:px-3"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          {activeStateTab === PoolsCardHeader.All && (
            <PoolsTable
              className="md:px-5 md:py-4  px-2 py-4"
              searchValue={searchValue}
            />
          )}
          {activeStateTab === PoolsCardHeader.Stable && (
            <PoolsTable
              className="md:px-5 md:py-4  px-2 py-4"
              poolsFilter={AMM_TYPE.STABLE}
              searchValue={searchValue}
            />
          )}
          {activeStateTab === PoolsCardHeader.Volatile && (
            <PoolsTable
              className="md:px-5 md:py-4  px-2 py-4"
              poolsFilter={AMM_TYPE.VOLATILE}
              searchValue={searchValue}
            />
          )}
          {activeStateTab === PoolsCardHeader.Mypools && (
            <PoolsTable
              className="md:px-5 md:py-4  px-2 py-4"
              poolsFilter={AMM_TYPE.MYPOOS}
              isConnectWalletRequired={true}
              searchValue={searchValue}
            />
          )}

          {/* poolsTable */}
        </div>
      </SideBarHOC>
    </>
  );
}
