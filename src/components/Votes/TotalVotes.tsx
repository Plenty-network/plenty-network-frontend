import { number } from 'prop-types';
import * as React from 'react';
import { ManageLiquidity } from '../Pools/ManageLiquidity';
import ctez from '../../assets/Tokens/ctez.png';
import tez from '../../assets/Tokens/tez.png';
import tradingFee from '../../assets/icon/vote/tradingfees.svg';
import dollar from '../../assets/icon/vote/dollar.svg';

import Image from 'next/image';

export interface IShortCardListProps {
  className?: string;
}

export function TotalVotes(props: IShortCardListProps) {
  return (
    <>
      <div className="flex-1 text-right  justify-center items-center">
        <div className="font-f13 text-text-50">130k</div>
        <div className="font-subtitle4 relative top-[10px]">37.4839%</div>
      </div>
    </>
  );
}
