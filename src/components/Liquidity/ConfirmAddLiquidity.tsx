import clsx from 'clsx';
import Image from 'next/image';
import ctez from '../../../src/assets/Tokens/ctez.png';
import wallet from '../../../src/assets/icon/pools/wallet.svg';

import add from '../../../src/assets/icon/pools/addIcon.svg';
import Button from '../Button/Button';
import { PopUpModal } from '../Modal/popupModal';

interface IConfirmAddLiquidityProps {}
function ConfirmAddLiquidity(props: IConfirmAddLiquidityProps) {
  return (
    <div>hi</div>
    //   <PopUpModal
    //   onhide={props.closeFn}
    //   className="w-[602px] max-w-none"
    //   headerChild={
    //     <div className="flex gap-1">
    //       <p>Manage Liquidity </p>
    //       <InfoIconToolTip message="Hello world" />
    //     </div>
    //   }

    // >
    //   <Liquidity />
    // </PopUpModal>
  );
}

export default ConfirmAddLiquidity;
