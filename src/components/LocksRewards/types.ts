import { BigNumber } from "bignumber.js";
import {
  EFeesStatus,
  IAllLocksRewardsData,
  ILockRewardsBribeData,
  ILockRewardsFeeData,
  ILocksRewardsTokenData,
} from "../../api/portfolio/types";
export interface IVotesTableRewards {
  showClaimPlyInd: boolean;
  setShowClaimPlyInd: React.Dispatch<React.SetStateAction<boolean>>;
  isFetching: boolean;
  setShowCreateLockModal: React.Dispatch<React.SetStateAction<boolean>>;
  epochClaim: string;
  setEpochClaim: React.Dispatch<React.SetStateAction<string>>;
  handleClick: () => void;
  allLocksRewardsData: IAllLocksRewardsData;
  selectedDropDown: {
    votingPower: string;
    tokenId: string;
  };

  className?: string;
  isConnectWalletRequired?: boolean;
}
export interface IRewardsDataProps {
  feesData: ILockRewardsFeeData;
  feesStatus: EFeesStatus;
  className?: string;
  bribes: BigNumber;
  fees: number;
  token1Name: string;
  token2Name: string;
  bribesData: ILockRewardsBribeData[];
}
export interface IVotingPowerProps {
  votes: BigNumber;
  percentage: BigNumber;
}
