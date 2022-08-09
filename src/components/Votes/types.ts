export interface ITransactionSubmittedProps {
  show: boolean;
  content: string;
  setShow: any;
  onBtnClick: any;
}
export interface ICreateLockProps {
  show: boolean;

  setShow: any;
}

export interface IConfirmLockingProps {
  show?: boolean;
  setScreen: React.Dispatch<React.SetStateAction<string>>;
  setShow?: any;
}
export interface ICastVoteProps {
  show: boolean;

  setShow: any;
}
