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

export function VotesData(props: IShortCardListProps) {
  const [showLiquidityModal, setShowLiquidityModal] = React.useState(false);
  return (
    <>
      {showLiquidityModal && (
        <ManageLiquidity closeFn={setShowLiquidityModal} />
      )}
      <tr
        className={`border border-borderCommon text-white bg-cardBackGround flex px-5 py-3 items-center rounded-lg ${props.className}`}
      >
        <td className=" flex justify-center items-center">
          <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
            <Image src={ctez} width={'24px'} height={'24px'} />
          </div>
          <div className="w-[28px] relative -left-2 bg-card-600 rounded-full h-[28px] flex justify-center items-center">
            <Image src={tez} width={'24px'} height={'24px'} />
          </div>
          <div>
            <div className="font-body4">CTEZ/XTZ</div>
            <div className="font-subtitle1 text-text-500">Stable Pool</div>
          </div>
        </td>
        <td className="flex-1 text-right flex-col justify-center items-center">
          <div className=" ">
            <span className="font-f13">$234.58</span>
            <span className="relative top-1">
              <Image src={tradingFee} width={'16px'} height={'16px'} />
            </span>
          </div>
          <div className=" ">
            <span className="font-f13">$234.58</span>
            <span className="relative top-1">
              <Image src={dollar} width={'16px'} height={'16px'} />
            </span>
          </div>
        </td>
        <td className="flex-1 text-right flex-col justify-center items-center">
          <div className="font-f13 text-text-50">130k</div>
          <div className="font-subtitle4 mt-[2px]">37.4839%</div>
        </td>
        <td className="flex-1 text-right flex justify-center items-center">
          <div>-</div>
        </td>
        <td className="flex-1 text-right flex justify-center items-center">
          <div>-</div>
        </td>
      </tr>
    </>
  );
}
