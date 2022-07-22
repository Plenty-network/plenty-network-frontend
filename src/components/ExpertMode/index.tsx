import clsx from 'clsx';
import Button from '../Button/Button';
import { PopUpModal } from '../Modal/popupModal';

interface IExpertModePopupProps {
  show: boolean;
  setExpertMode: any;
  setShow: any;
}
function ExpertModePopup(props: IExpertModePopupProps) {
  const closeModal = () => {
    props.setShow(false);
    props.setExpertMode(false);
  };
  const enableExpertMode = () => {
    props.setExpertMode(true);
    props.setShow(false);
  };
  return props.show ? (
    <PopUpModal title="Confirm" onhide={closeModal}>
      {
        <>
          <div className="mt-6">
            <div className="font-subtitle5 text-text-400">
              Expert mode turns off the confirm transaction prompt and allows
              high slippage trades that often result in bad rates and lost
              funds.
            </div>

            <div className="mt-8 text-white font-subtitle4">
              ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.
            </div>
            <div className="mt-5">
              <Button color="primary" onClick={enableExpertMode}>
                Enable Expert mode
              </Button>
            </div>
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default ExpertModePopup;
