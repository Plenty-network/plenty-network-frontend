export interface IStatsProps {}
export interface IStatsCardProps {
  setShowCreateLockModal?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  value?: string;
  subValue?: string;
  isLast?: boolean;
}
