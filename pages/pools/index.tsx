import Head from 'next/head';
import Image from 'next/image';
import * as React from 'react';
import HeadInfo from '../../src/components/HeadInfo';
import { CardHeader } from '../../src/components/Pools/Cardheader';
import { ShortCard } from '../../src/components/Pools/ShortCard';
import { SideBarHOC } from '../../src/components/Sidebar/SideBarHOC';
export interface IIndexProps {
}

export default function kom (props: IIndexProps) {
  return (
    <>
      <Head>
        <title className="font-medium1">Plent network</title>
        <meta name="description" content="plenty network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBarHOC>
        {/* className='' */}
        <div >
          <HeadInfo className='md:px-3'/>
          <CardHeader className='md:px-3'/>
          <ShortCard className='px-5 py-4 '/>
          {/* poolsTable */}
        </div>
      </SideBarHOC>
    </>
  );
}
