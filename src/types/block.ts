export type IBlock = {
  id: number;
  chain: number;
  nonce: number;
  data: string;
  previous: string;
  hash?: string;
  mining?: boolean;
};
