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