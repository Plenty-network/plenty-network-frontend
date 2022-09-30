import { Flashtype } from "../../components/FlashScreen"
export interface IFlashMessageProps {
    onClick?:Function;
    flashType:Flashtype;
    headerText:string;
    trailingText:string;
    linkText:string;
    isLoading:boolean;
}
