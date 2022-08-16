import clsx from 'clsx';
import Image from 'next/image';
import arrowLeft from '../../../src/assets/icon/pools/arrowLeft.svg';
import info from '../../../src/assets/icon/common/infoIcon.svg';
import Button from '../Button/Button';
import { tokenParameterLiquidity } from '../Liquidity/types';
import { Dropdown } from '../DropDown/Dropdown';
import { VePLY } from '../DropDown/vePLYDropdown';
import { IVePLYData } from '../../api/stake/types';

interface IConfirmStakeLiquidity {
  tokenIn: tokenParameterLiquidity;
  stakeInput: string | number;
  tokenOut: tokenParameterLiquidity;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  handleOperation: () => void;
  setSelectedDropDown: React.Dispatch<React.SetStateAction<IVePLYData>>;
  selectedDropDown: IVePLYData;

  vePLYOptions: IVePLYData[];
}

export function ConfirmStakeLiquidity(props: IConfirmStakeLiquidity) {
  return (
    <>
      <div className="flex">
        <div className="cursor-pointer" onClick={() => props.setScreen('1')}>
          <Image src={arrowLeft} />
        </div>
        <div className="mx-2 text-white font-title3">Confirm staking </div>
        <div className="relative top-[2px]">
          <Image src={info} />
        </div>
      </div>
      <div className="border rounded-2xl mt-[24px] border-text-800 bg-card-200 pt-[28px] px-4 pb-5">
        <div className="flex pl-[5px] px-[10px] items-center">
          <div className="text-text-400 font-body1 w-[208px]">
            Are you sure you want to continues with less PLY rewards?
          </div>
          <div className="ml-auto">
            {' '}
            <VePLY
              Options={props.vePLYOptions}
              selectedText={props.selectedDropDown}
              onClick={props.setSelectedDropDown}
            />
          </div>
        </div>
        <div className="mt-4 font-body4 text-text-250">Your staking</div>
        <div className="mt-1 text-white font-title2">
          {props.stakeInput} PNLP
        </div>
      </div>

      <div className="mt-5">
        <Button color={'primary'} onClick={props.handleOperation}>
          Confirm
        </Button>
      </div>
    </>
  );
}
