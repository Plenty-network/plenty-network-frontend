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
import { useEffect, useState } from 'react';
import { AppDispatch, useAppSelector } from '../../src/redux';
import { fetchWallet } from '../../src/redux/wallet/wallet';
import { getConfig } from '../../src/redux/config/config';
import { getTokenPrice } from '../../src/redux/tokenPrice/tokenPrice';
import SelectNFT from '../../src/components/Votes/SelectNFT';
import { VotesTable } from '../../src/components/Votes/VotesTable';
import Button from '../../src/components/Button/Button';
import CastVote from '../../src/components/Votes/CastVote';
import CreateLock from '../../src/components/Votes/CreateLock';

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
  const [showCastVoteModal, setShowCastVoteModal] = useState(false);

  const [showCreateLockModal, setShowCreateLockModal] = useState(true);

  const handleCreateLock = () => {
    setShowCreateLockModal(true);
  };

  return (
    <>
      <Head>
        <title className="font-medium1">Plenty network</title>
        <meta name="description" content="plenty network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBarHOC>
        <div>
          <HeadInfo
            className="md:px-3"
            title="Vote"
            toolTipContent="Watch how to add veNFT"
            handleCreateLock={handleCreateLock}
          />

          <SelectNFT />

          <VotesTable className="px-5 py-4 " />
        </div>
      </SideBarHOC>
      {showCastVoteModal && (
        <CastVote show={showCastVoteModal} setShow={setShowCastVoteModal} />
      )}
      {showCreateLockModal && (
        <CreateLock
          show={showCreateLockModal}
          setShow={setShowCreateLockModal}
        />
      )}
    </>
  );
}
