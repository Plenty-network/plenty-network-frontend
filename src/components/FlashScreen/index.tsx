import info from "../../assets/icon/common/info.svg";
import infQuestion from "../../assets/icon/common/questionIcon.svg";
import rejected from "../../assets/icon/common/rejected.svg";
import success from "../../assets/icon/common/successFrame.svg";
import exclaimatory from "../../assets/icon/common/exclaimatory.svg";
import { Flash } from "./FlashMessage";



export interface IFlashMessageProps {
    onClick?:Function;
    flashType:Flashtype;
    onCloseClick:Function;
    className?:string;
    headerText:string;
    trailingText:string;
    linkText:string;
    duration:number;
}
export enum Flashtype{
    Success,
    Info,
    Warning,
    Rejected,
    QuestionMark
}

export function FlashMessage (props: IFlashMessageProps) {
    const imageSrc=()=>{
        if(props.flashType===Flashtype.Info){
            return info;
        }  
        if(props.flashType===Flashtype.QuestionMark){
            return infQuestion; 
        }
        if(props.flashType===Flashtype.Rejected){
            return rejected; 
        }
        if(props.flashType===Flashtype.Success){
            return success; 
        }
        if(props.flashType===Flashtype.Warning){
            return exclaimatory; 
        }
        return info;  
    }
  return <Flash
      headerText={props.headerText}
      trailingText={props.trailingText}
      linkText={props.linkText}
      onClick={props.onClick}
      flashType={props.flashType}
      imageSrc={imageSrc()}
      duration={props.duration}
      onCloseClick={props.onCloseClick}
      className={props.className}
  />;
}
