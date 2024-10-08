import {
  IBlock,
  ICoinBlock,
  ITokenBlock,
  ITokenBlockTxs,
} from "@/types/blockchain";
import { IBitCoinBlock } from "@/types/sign";
import CryptoJS from "crypto-js";
/////////////////////////
// global variable setup
/////////////////////////

// number of zeros required at front of hash
const difficultyMajor = 4;

// 0-15, maximum (decimal) value of the hex digit after the front
// 15 means any hex character is allowed next
// 7  means next bit must be 0 (because 0x7=0111),
//    (so the bit-strength is doubled)
// 0  means only 0x0 can be next
//    (equivalent to one more difficultyMajor)
// eslint-disable-next-line prefer-const
let difficultyMinor = 15;
let maximumNonce = 8; // limit the nonce so we don't mine too long
let pattern = "";

for (let x = 0; x < difficultyMajor; x++) {
  pattern += "0";
  maximumNonce *= 16;
}
// at this point in the setup, difficultyMajor=4
// yields pattern '0000' and maximumNonce 8*16^4=524288

// add one more hex-char for the minor difficulty
pattern += difficultyMinor.toString(16);
const patternLen = pattern.length;

if (difficultyMinor === 0) {
  maximumNonce *= 16;
} else if (difficultyMinor === 1) {
  maximumNonce *= 8;
} else if (difficultyMinor <= 3) {
  maximumNonce *= 4;
} else if (difficultyMinor <= 7) {
  maximumNonce *= 2;
}

// Calculate SHA256 hash
export const sha256 = (blockData: string) => {
  return CryptoJS.SHA256(blockData).toString();
};

// Update hash and state
export const calculateHash = (blockData: string) => {
  const hashValue = sha256(blockData);
  return hashValue;
};

// Update the status of the block (valid or invalid)
export const updateState = (currentHash: string) => {
  if (currentHash.slice(0, patternLen) <= pattern) {
    return "valid";
  } else {
    return "invalid";
  }
};

// Mine the block by incrementing the nonce until the hash is valid
export const mine = ({
  nonce,
  blockNumber,
  data,
  previous,
}: {
  nonce: number;
  blockNumber: number;
  data: string;
  previous?: string;
}) => {
  const result: { nonce: number; hash: string; status?: string } = {
    nonce,
    hash: sha256(`${blockNumber}${nonce}${data}`),
  };
  let currentNonce = nonce;

  for (let x = 0; x <= maximumNonce; x++) {
    currentNonce = x;

    const blockData = previous
      ? `${blockNumber}${currentNonce}${data}${previous}`
      : `${blockNumber}${currentNonce}${data}`;
    const currentHash = sha256(blockData);

    // 상태 확인
    const status = updateState(currentHash);

    // 채굴 성공 시 상태와 결과 반환
    if (status === "valid") {
      result.nonce = currentNonce;
      result.hash = currentHash;
      result.status = "success";
      break;
    }
  }
  // 채굴 실패 시 상태 설정
  if (!result.status) {
    result.status = "failure";
  }

  return result;
};

interface IBlockBase {
  id: number;
  nonce: number;
  hash?: string;
  data?: string | unknown[];
}

export const calculateBlockchain = <T extends IBlockBase>(
  updatedBlocks: T[],
  startIndex: number = 0,
  getBlockData: (block: T) => string
) => {
  for (let i = startIndex; i < updatedBlocks.length; i++) {
    const previousHash =
      i === 0
        ? "0000000000000000000000000000000000000000000000000000000000000000"
        : updatedBlocks[i - 1].hash || "";

    const blockData = `${updatedBlocks[i].id}${
      updatedBlocks[i].nonce
    }${getBlockData(updatedBlocks[i])}${previousHash}`;
    const newHash = sha256(blockData).toString();

    updatedBlocks[i] = {
      ...updatedBlocks[i],
      previous: previousHash,
      hash: newHash,
    };
  }
  return updatedBlocks;
};

export const getTokenString = (txs: ITokenBlockTxs[]) => {
  let data = "";
  txs.forEach((tx) => {
    data = `${data}${tx.value}${tx.from}${tx.to}`;
  });
  return data;
};

export const getCointString = (block: ICoinBlock) => {
  let data = `${block.coinbasevalue}${block.coinbaseto}`;
  block.txs.forEach((tx) => {
    data = `${data}${tx.value}${tx.from}${tx.to}`;
  });
  return data;
};

// 일반적인 블록체인의 데이터 처리 함수
export const recalculateBlockChain = (
  updatedBlocks: IBlock[],
  startIndex: number = 0
) => {
  return calculateBlockchain<IBlock>(
    updatedBlocks,
    startIndex,
    (block) => block.data
  );
};

// 토큰 블록체인의 데이터 처리 함수
export const recalculateTokenBlockChain = (
  updatedBlocks: ITokenBlock[],
  startIndex: number = 0
) => {
  return calculateBlockchain<ITokenBlock>(updatedBlocks, startIndex, (block) =>
    getTokenString(block.data)
  );
};

// 코인 블록체인의 데이터 처리 함수
export const recalculateCoinBlockChain = (
  updatedBlocks: ICoinBlock[],
  startIndex: number = 0
) => {
  return calculateBlockchain<ICoinBlock>(updatedBlocks, startIndex, (block) =>
    getCointString(block)
  );
};

export const getBitCoinString = (block: IBitCoinBlock) => {
  let data = `${block.coinbasevalue}${block.coinbaseto}`;
  block.txs.forEach((tx) => {
    data = `${data}${tx.value}${tx.from}${tx.to}${tx.seq}${tx.sig}`;
  });
  return data;
};

// 코인 블록체인의 데이터 처리 함수
export const recalculateBitCoinBlockChain = (
  updatedBlocks: IBitCoinBlock[],
  startIndex: number = 0
) => {
  return calculateBlockchain<IBitCoinBlock>(
    updatedBlocks,
    startIndex,
    (block) => getBitCoinString(block)
  );
};
