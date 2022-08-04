export interface IDepositedAmountResponse {
  success: boolean;
  tokenOneAmount: string;
  tokenTwoAmount: string;
  error?: string;
}

export interface IRewardsResponse {
  success: boolean;
  rewards: string;
  error?: string;
}