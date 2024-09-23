export type IKey = {
  private: string;
  public: string;
};

export type IBitcoinBlockTx = {
  value: string;
  from: string;
  to: string;
  seq: number;
  sig: string;
};

export type IBitCoinBlock = {
  id: number;
  chain: number;
  nonce: number;
  coinbasevalue: string;
  coinbaseto: string;
  txs: IBitcoinBlockTx[];
  previous: string;
  txCount: number;
  hash?: string;
};
