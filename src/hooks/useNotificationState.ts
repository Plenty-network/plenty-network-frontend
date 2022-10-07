import { useState } from 'react';
import { getAllNotification as getAllNotificationS, ImessageProps, removeAllNotification as removeAllNotificationS, setNotificationMessage as setNotificationMessageS } from './../components/Notification/notificationMessageSave';

export const useStateAnimate = (innitiAlState: any, time: number) => {
  const [state, setState] = useState(innitiAlState);
  const setNotificationMessage=(message:ImessageProps,walletAddress:string)=>{
    setNotificationMessageS(message,walletAddress);
  }
  const getAllNotification=(walletAddress:string)=>{
    getAllNotificationS(walletAddress);
  }
  const removeAllNotification=()=>{
    removeAllNotificationS();
  }

  return [setNotificationMessage,getAllNotification,removeAllNotification ];
};
