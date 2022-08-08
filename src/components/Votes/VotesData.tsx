import { number } from 'prop-types';
import * as React from 'react';
import { ManageLiquidity } from '../Pools/ManageLiquidity';
import ctez from '../../assets/Tokens/ctez.png';
import tez from '../../assets/Tokens/tez.png';

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
        className={`border border-borderCommon  bg-cardBackGround flex px-5 py-3 items-center rounded-lg ${props.className}`}
      >
        <td className=" flex justify-center items-center">
          <div className="bg-card-600 rounded-full w-[28px] h-[28px] flex justify-center items-center">
            <Image src={ctez} width={'24px'} height={'24px'} />
          </div>
          <div className="w-[28px] bg-card-600 rounded-full h-[28px] flex justify-center items-center">
            <Image src={tez} width={'24px'} height={'24px'} />
          </div>
          <div>
            <div className="font-body4">CTEZ/XTZ</div>
            <div className="font-subtitle1">Stable Pool</div>
          </div>
        </td>
        <td className="flex-1  flex justify-center items-center"></td>
        <td className="flex-1  flex justify-center items-center"></td>
        <td className="flex-1  flex justify-center items-center"></td>
        <td className="flex-1  flex justify-center items-center"></td>
        <td className="flex-1  flex justify-center items-center"></td>
      </tr>
    </>
  );
}
