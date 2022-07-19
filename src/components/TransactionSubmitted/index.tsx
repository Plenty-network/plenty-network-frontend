import clsx from 'clsx';
import Button from '../Button/Button';
import { PopUpModal } from '../Modal/popupModal';
import Image from 'next/image';
import externalLink from '../../../src/assets/icon/common/externalLink.svg';
import info from '../../../src/assets/icon/swap/info.svg';
import { BigNumber } from 'bignumber.js';
import animation from '../../assets/animations/transaction-submitted.json';
import Lottie from 'lottie-react';

interface ITransactionSubmittedProps {
  show: boolean;
  content: string;
  setShow: any;
  onClick: () => void;
}
function TransactionSubmitted(props: ITransactionSubmittedProps) {
  const closeModal = () => {
    props.setShow(false);
  };

  return props.show ? (
    <PopUpModal title="Transaction Submitted" onhide={closeModal}>
      {
        <>
          <div className="flex justify-center mt-12">
            <Lottie
              animationData={animation}
              loop={false}
              style={{ height: '150px', width: '150px' }}
            />
          </div>
          <div className="mt-6 border border-border-100/[0.4] rounded-2xl bg-secondary-100/[0.02] flex justify-center items-center h-[52px] font-subtitle4">
            {props.content}
          </div>
          <div className="my-3 font-text-bold flex justify-center text-primary-500">
            View on BLOCK EXPLORER
            <span className="ml-2">
              <Image src={externalLink} width={'12px'} height={'12px'} />
            </span>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default TransactionSubmitted;
