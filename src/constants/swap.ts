export interface tokenParameter {
  name: string;
  image: any;
}

export type tokenType = 'tokenIn' | 'tokenOut';

export interface tokensModal {
  name: string;
  image: any;
  new: boolean;
  extra?: { text: string; link: string } | undefined;
}
