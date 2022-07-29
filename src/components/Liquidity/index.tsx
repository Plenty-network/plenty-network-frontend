import clsx from 'clsx';
import Image from 'next/image';
import settings from '../../../src/assets/icon/swap/settings.svg';
import { useEffect, useMemo, useRef, useState } from 'react';
import TransactionSettingsLiquidity from '../TransactionSettings/TransactionSettingsLiq';
import { Switch } from '../SwitchCheckbox/switchWithoutIcon';
import AddLiquidity from './AddLiquidity';
import Button from '../Button/Button';
import { SwitchWithIcon } from '../SwitchCheckbox/switchWithIcon';
import RemoveLiquidity from './RemoveLiquidity';
import ConfirmAddLiquidity from './ConfirmAddLiquidity';

interface ILiquidityProps {
  inputRef?: any;
  value?: string | '';
  onChange?: any;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
}
function Liquidity(props: ILiquidityProps) {
  const [settingsShow, setSettingsShow] = useState(false);
  const refSettingTab = useRef(null);
  const [slippage, setSlippage] = useState(0.5);
  const [isAddLiquidity, setIsAddLiquidity] = useState(true);
  const handleAddLiquidity = () => {
    props.setScreen('2');
  };
  const handleRemoveLiquidity = () => {
    props.setScreen('3');
  };

  return (
    <>
      <div className="border rounded-2xl border-text-800 bg-card-200 px-3.5 pt-4 pb-6  mb-5">
        <div className="flex items-center justify-between flex-row  relative">
          <div className="flex">
            <span className="relative ml-2 top-[3px]">
              <SwitchWithIcon
                id="Addliquidity"
                isChecked={isAddLiquidity}
                onChange={() => setIsAddLiquidity(!isAddLiquidity)}
              />
            </span>
            <span className="ml-2 text-white font-title3 relative top-[12px]">
              {isAddLiquidity ? 'Add Liquidity' : 'Remove Liquidity'}
            </span>
          </div>
          <div
            ref={refSettingTab}
            className="py-1 ml-auto px-2 h-8 border border-text-700 cursor-pointer rounded-[12px] ml-2"
            onClick={() => setSettingsShow(!settingsShow)}
          >
            <Image src={settings} height={'20px'} width={'20px'} />
            <span className="text-white font-body4 ml-0.5 relative -top-[3px]">
              {slippage}%
            </span>
          </div>
          <TransactionSettingsLiquidity
            show={settingsShow}
            setSlippage={setSlippage}
            slippage={slippage}
            setSettingsShow={setSettingsShow}
          />
        </div>
        {isAddLiquidity ? <AddLiquidity /> : <RemoveLiquidity />}
      </div>
      {isAddLiquidity ? (
        <div className="">
          <Button color={'primary'} onClick={handleAddLiquidity}>
            Add
          </Button>
        </div>
      ) : (
        <div className="">
          <Button color={'primary'} onClick={handleRemoveLiquidity}>
            Remove
          </Button>
        </div>
      )}
    </>
  );
}

export default Liquidity;
