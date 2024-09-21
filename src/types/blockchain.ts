export type IBlock = {
  id: number;
  chain: number;
  nonce: number;
  data: string;
  previous: string;
  hash?: string;
  mining?: boolean;
};

export type ITokenBlockTxs = {
  value: string;
  from: string;
  to: string;
};

export type ITokenBlock = {
  id: number;
  chain: number;
  nonce: number;
  data: ITokenBlockTxs[];
  previous: string;
  hash?: string;
  mining?: boolean;
};
