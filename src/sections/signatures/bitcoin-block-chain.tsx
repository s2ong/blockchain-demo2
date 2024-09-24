import React, {
  useState,
  useCallback,
  ChangeEvent,
  useMemo,
  useEffect,
} from "react";

import {
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Stack,
  Typography,
} from "@mui/material";

import { IBitCoinBlock, IBitcoinBlockTx } from "@/types/sign";

import {
  getBitCoinString,
  mine,
  sha256,
  updateState,
} from "@/utils/blockchain";

import BitcoinBlockChainItem from "./bitcoin-block-chain-item";
import HashOutput from "../blockchain/hash-output";

interface BlockChainProps {
  currentBlock: IBitCoinBlock;
  onChange: (block: IBitCoinBlock) => void;
}

const BitCoinBlockChain: React.FC<BlockChainProps> = ({
  currentBlock,
  onChange,
}) => {
  const [block, setBlock] = useState(currentBlock);
  const [status, setStatus] = useState<string | undefined>();
  const [mining, setMining] = useState(false);

  const isChain = status === "success";

  const onUpdateHashStatus = (inputBlock: IBitCoinBlock) => {
    const hashStatus = updateState(inputBlock.hash || "");
    if (hashStatus === "valid") {
      setStatus("success");
    } else {
      setStatus("failure");
    }
  };

  useMemo(() => {
    setBlock(currentBlock);
  }, [currentBlock]);

  useEffect(() => {
    onUpdateHashStatus(currentBlock);
  }, [currentBlock]);

  const calculateBlock = (inputBlock: IBitCoinBlock) => {
    const blockData = getBitCoinString(inputBlock);

    const hashValue = sha256(blockData);

    const hashStatus = updateState(hashValue);

    if (hashStatus === "valid") {
      setStatus("success");
    } else {
      setStatus("failure");
    }

    return { ...inputBlock, hash: hashValue };
  };

  const handleMine = useCallback(() => {
    setMining(true);

    const data = getBitCoinString(block);

    const miningResult = mine({
      nonce: block.nonce,
      blockNumber: block.id,
      data,
      previous: block.previous,
    });

    if (miningResult.status === "success") {
      const newBlock = {
        ...block,
        nonce: miningResult.nonce,
        hash: miningResult.hash,
      };
      setBlock(newBlock);
      onChange(newBlock);
    }
    setStatus(miningResult?.status);
    setMining(false);
  }, [block, onChange]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const inputBlock = { ...block, [name]: value };

    const blockData = calculateBlock(inputBlock);

    setBlock(blockData);

    onChange(blockData);
  };

  const handleChangeTransaction = (
    txsIndex: number,
    updateTransactions: IBitcoinBlockTx
  ) => {
    const updatedBlock = { ...currentBlock };
    updatedBlock.txs[txsIndex] = updateTransactions;

    const blockData = calculateBlock(updatedBlock);

    setBlock(blockData);

    onChange(blockData);
  };

  return (
    <Card sx={{ width: 400, flexShrink: 0 }}>
      <CardContent>
        <Stack spacing={2}>
          <TextField
            label="Block Number"
            name="id"
            value={block.id}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Nonce"
            name="nonce"
            value={block.nonce}
            onChange={handleChange}
            fullWidth
          />
          <Typography variant="body2" component="h1" gutterBottom>
            코인베이스
          </Typography>
          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <TextField
              label="₩"
              name="coinbasevalue"
              value={block.coinbasevalue}
              onChange={handleChange}
            />
            <TextField
              label="보낸이"
              name="coinbaseto"
              value={block.coinbaseto}
              onChange={handleChange}
            />
          </Stack>

          <Typography variant="body2" component="h1" gutterBottom>
            송금
          </Typography>
          {block.txs.map((txs, index) => (
            <BitcoinBlockChainItem
              key={`${block.id}-${index}`}
              txs={txs}
              txsIndex={index}
              onChange={handleChangeTransaction}
            />
          ))}

          <HashOutput hash={block?.previous} title="Previous Hash" />
          <HashOutput hash={block?.hash || ""} status={isChain} title="Hash" />
        </Stack>
      </CardContent>
      <CardActions>
        <Button onClick={handleMine} variant="contained" fullWidth>
          {mining ? "Mining..." : "Mine Block"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default BitCoinBlockChain;
