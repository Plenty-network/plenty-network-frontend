import { Flashtype } from "../FlashScreen";

export interface ImessageProps {
  onClick?: Function;
  flashType: Flashtype;
  headerText: string;
  trailingText: string;
  linkText: string;
  currentTimeStamp: number;
}
export interface IFinalMessageProps {
  currentWalletId: string | undefined;
  messageArray: Array<ImessageProps>;
}
const MESSAGE_ID = "MESSAGES";
const defaultObject: IFinalMessageProps = {
  currentWalletId: "",
  messageArray: [],
};
export const setNotificationMessage = (message: ImessageProps, walletAddress: string) => {
  if (!walletAddress) {
    return;
  }
  const localStore = localStorage.getItem(MESSAGE_ID);
  let currentMessage: IFinalMessageProps = defaultObject;

  // case when localStore is empty
  if (localStore === "" || localStore == null) {
    currentMessage.currentWalletId = walletAddress;
    currentMessage.messageArray = [message];
    localStorage.setItem(MESSAGE_ID, JSON.stringify(currentMessage));
    return currentMessage;
  } else {
    currentMessage = JSON.parse(localStore);
    // case when walletAddress is diffrent
    if (currentMessage.currentWalletId != walletAddress) {
      currentMessage.currentWalletId = walletAddress;
      currentMessage.messageArray = [message];
      localStorage.setItem(MESSAGE_ID, JSON.stringify(currentMessage));
      return currentMessage;
    } else {
      currentMessage.currentWalletId = walletAddress;
      const currentArray = [...currentMessage.messageArray];
      currentArray.push(message);
      currentArray.sort((a, b) => b.currentTimeStamp - a.currentTimeStamp);
      const newCurrentArray = currentArray.slice(0, 10);
      currentMessage.messageArray = [...newCurrentArray];
      localStorage.setItem(MESSAGE_ID, JSON.stringify(currentMessage));
      return currentMessage;
    }
  }
};
export const getAllNotification = (walletAddress: string) => {
  if (!walletAddress) {
    return [];
  }
  const localStore = localStorage.getItem(MESSAGE_ID);
  if (localStore === "" || localStore == null) {
    return [];
  }
  const currentMessage: IFinalMessageProps = JSON.parse(localStore);

  if (currentMessage.currentWalletId != walletAddress) {
    localStorage.setItem(MESSAGE_ID, "");
    return [];
  } else {
    return currentMessage.messageArray;
  }
};
export const removeAllNotification = () => {
  localStorage.setItem(MESSAGE_ID, "");
};
