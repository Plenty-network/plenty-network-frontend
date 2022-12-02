import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Image from "next/image";
import * as React from "react";
import exclaimatory from "../../assets/icon/common/exclaimatory.svg";
import info from "../../assets/icon/common/info.svg";
import openInNewTab from "../../assets/icon/common/openInNewTab.svg";
import infQuestion from "../../assets/icon/common/questionIcon.svg";
import rejected from "../../assets/icon/common/rejected.svg";
import success from "../../assets/icon/common/successFrame.svg";
import { Flashtype } from "../FlashScreen";
import { ImessageProps } from "./notificationMessageSave";
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

export interface ISingleNotificationProps extends ImessageProps {}

export function SingleNotification(props: ISingleNotificationProps) {
  const imageSrc = () => {
    if (props.flashType === Flashtype.Info) {
      return info;
    }
    if (props.flashType === Flashtype.QuestionMark) {
      return infQuestion;
    }
    if (props.flashType === Flashtype.Rejected) {
      return rejected;
    }
    if (props.flashType === Flashtype.Success) {
      return success;
    }
    if (props.flashType === Flashtype.Warning) {
      return exclaimatory;
    }
    return info;
  };
  return (
    <div
      className="flex p-4 gap-4 border-b cursor-pointer border-muted-236/40 bg-primary-900 hover:bg-primary-257"
      onClick={
        props.transactionId && props.transactionId !== ""
          ? () => {
              window.open(`https://ghostnet.tzkt.io/${props.transactionId}`, "_blank");
            }
          : () => {}
      }
    >
      <div>
        <Image src={imageSrc()} height={20} width={20} />
      </div>
      <div className="flex flex-col gap-1 text-f14 font-normal">
        <div className="flex items-end gap-1">
          <div className="font-semibold text-text-239">{props.headerText}</div>
          <div className="text-text-240 font-body1 ">
            {timeAgo.format(new Date(props.currentTimeStamp))}
            {props.flashType === Flashtype.Success &&
              props.transactionId &&
              props.transactionId !== "" && (
                <span className="ml-auto pl-1 relative top-[3px]">
                  <Image height={14} width={14} src={openInNewTab} />
                </span>
              )}
          </div>
        </div>

        <div className="text-text-241 flex">
          <span className="">{props.trailingText}</span>
        </div>
      </div>
    </div>
  );
}
