export interface IOtherTokenOutput {
  success: boolean;
  otherTokenAmount: string;
  error?: string;
}

export interface IPnlpBalanceResponse {
  success: boolean;
  lpToken: string;
  balance: string;
  error?: string;
}

export interface IPnlpEstimateResponse {
  success: boolean;
  pnlpEstimate: string;
  error?: string;
}

export interface IOutputTokensAmountResponse {
  success: boolean;
  tokenOneAmount: string;
  tokenTwoAmount: string;
  error?: string;
}

export interface ICurrentPoolShareResponse {
  success: boolean;
  currentPoolShare: string;
  balance: string;
  error?: string;
}

export interface IPnlpPoolShareResponse {
  success: boolean;
  pnlpPoolShare: string;
  error?: string;
}