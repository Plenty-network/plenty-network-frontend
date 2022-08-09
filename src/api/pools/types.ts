export interface Lqt {
  lqt_decimals: string;
  lqt_symbol: string;
  lqt_token: string;
  lqt_token_bigmap: string;
}

export interface Token1 {
  address: string;
  variant: string;
  decimals: string;
  symbol: string;
  tokenId: string;
}

export interface Token2 {
  address: string;
  variant: string;
  decimals: string;
  symbol: string;
  tokenId: string;
}

export interface poolsMainPage {
  amm: string;
  type: string;
  gauge: string;
  bribe: string;
  gauge_bigmap: string;
  bribe_bigmap: string;
  lqt: Lqt;
  token1: Token1;
  token2: Token2;
  bribes: any[];
  apr: string;
}
