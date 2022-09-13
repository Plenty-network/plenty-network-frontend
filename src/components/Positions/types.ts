export interface IStatsProps {
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface IStatsCardProps {
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  value?: number;
  subValue?: string;
  isLast?: boolean;
}
