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
import SelectNFT from '../../src/components/Votes/SelectNFT';
import { VotesTable } from '../../src/components/Votes/VotesTable';
import Button from '../../src/components/Button/Button';

export default function Vote() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.config.tokens);
  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
  }, []);
  useEffect(() => {
    Object.keys(token).length !== 0 && dispatch(getTokenPrice());
  }, [token]);

  return (
    <>
      <Head>
        <title className="font-medium1">Plent network</title>
        <meta name="description" content="plenty network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBarHOC>
        <div>
          <div className="flex">
            <div>
              <HeadInfo
                className="md:px-3"
                title="Vote"
                toolTipContent="Watch how to add veNFT"
              />
            </div>
            <div className=" h-[52px] flex items-center px-[32px] text-primary-500 rounded-lg bg-primary-500/[0.1]">
              Create Lock
            </div>
          </div>

          <SelectNFT />

          <VotesTable className="px-5 py-4 " />
        </div>
      </SideBarHOC>
    </>
  );
}
