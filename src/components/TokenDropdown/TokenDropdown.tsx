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
          ' p-2 md:p-3 rounded-xl border border-text-800 font-mobile-text md:font-title3 text-white flex content-center h-[50px]'
        )}
        onClick={props.onClick}
        {...props}
      >
        <div>
          <Image src={props.tokenIcon} height={'24px'} width={'24px'} />
        </div>
        <div className="mx-px md:mx-2">
          <span>{props.tokenName}</span>
        </div>
        <div className="ml-px relative -top-px">
          <Image src={arrowDown} />
        </div>
      </button>
    );
  } else {
    return (
      <button
        className={clsx(
          '  p-3 rounded-xl border border-primary-500/[0.5] font-mobile-text md:font-title3 text-primary-500 flex content-center'
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
