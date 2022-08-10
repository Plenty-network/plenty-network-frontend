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
import { AMM_TYPE } from '../../src/config/types';
export interface IIndexProps {}

export default function Pools(props: IIndexProps) {
  const [activeStateTab, setActiveStateTab] = React.useState<
    PoolsCardHeader | string
  >(PoolsCardHeader.All);
  const dispatch = useDispatch<AppDispatch>();
  const token = useAppSelector((state) => state.config.tokens);
  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
  }, []);
  useEffect(() => {
    Object.keys(token).length !== 0 && dispatch(getTokenPrice());
  }, [token]);
  const [searchValue,setSearchValue]=React.useState("");
  return (
    <>
      <Head>
        <title className="font-medium1">Plent network</title>
        <meta name="description" content="plenty network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBarHOC>
        {/* className='' */}
        <div>
          <HeadInfo className="md:px-3" />
          <CardHeader
            activeStateTab={activeStateTab}
            setActiveStateTab={setActiveStateTab}
            className="md:px-3"
            searchValue={searchValue}
            setSearchValue={setSearchValue}

          />
          {activeStateTab === PoolsCardHeader.All && (
            <PoolsTable className="px-5 py-4 " />
          )}
          {activeStateTab === PoolsCardHeader.Stable && (
            <PoolsTable className="px-5 py-4 " poolsFilter={AMM_TYPE.STABLE} />
          )}
          {activeStateTab === PoolsCardHeader.Volatile && (
            <PoolsTable className="px-5 py-4 " poolsFilter={AMM_TYPE.VOLATILE} />
          )}

          {/* poolsTable */}
        </div>
      </SideBarHOC>
    </>
  );
}
