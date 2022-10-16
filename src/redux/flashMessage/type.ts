import { Flashtype } from "../../components/FlashScreen";
export interface IFlashMessageProps {
  onClick?: () => void;
  flashType: Flashtype;
  headerText: string;
  trailingText: string;
  linkText: string;
  isLoading: boolean;
  transactionId: string;
}
