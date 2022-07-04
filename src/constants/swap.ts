export interface SWAPPAGE {
  TOKENIN: 'tokenIn';
  TOKENOUT: 'tokenOut';
}

export type tokenType = 'tokenIn' | 'tokenOut';

export interface tokensModal {
  name: string;
  image: any;
  new: boolean;
  extra?: { text: string; link: string } | undefined;
}
