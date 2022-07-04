import clsx from 'clsx';
import Image from 'next/image';
import arrowDown from '../../assets/icon/swap/arrowDown.svg';
import arrowDownViolet from '../../assets/icon/swap/arrowDownViolet.svg';

interface ITokenDropdownProps {
  tokenIcon?: any;
  onClick?: () => void | Promise<void>;
  tokenName: string;
  className?: string;
}
function TokenDropdown(props: ITokenDropdownProps) {
  if (props.tokenIcon) {
    return (
      <button
        className={clsx(
          ' px-2 py-2.5 md:p-3 rounded-xl border border-text-800 font-mobile-text md:font-title3 text-white  content-center justify-center h-[50px]'
        )}
        onClick={props.onClick}
        {...props}
      >
        <span className="h-[24px] w-[24px]">
          <Image src={props.tokenIcon} height={'24px'} width={'24px'} />
        </span>
        <span className="mx-2 md:mx-2 relative -top-[6px]">
          <span>{props.tokenName}</span>
        </span>
        <span className="md:ml-px relative -top-[6px] ">
          <Image src={arrowDown} />
        </span>
      </button>
    );
  } else {
    return (
      <button
        className={clsx(
          ' h-[50px] px-2 py-[15px] md:p-3 rounded-xl border text-center border-primary-500/[0.5] font-mobile-text md:font-title3 text-primary-500 flex content-center'
        )}
        onClick={props.onClick}
        {...props}
      >
        <span>{props.tokenName}</span>
        <span className="ml-2">
          <Image src={arrowDownViolet} />
        </span>
      </button>
    );
  }
}

export default TokenDropdown;
