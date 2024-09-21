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

import { IBlock, ITokenBlock, ITokenBlockTxs } from "@/types/blockchain";

import {
  getTransactionsString,
  mine,
  sha256,
  updateState,
} from "@/utils/blockchain";

import HashOutput from "./hash-output";
import TokenBlockChainItem from "./token-block-chain-item";

interface BlockChainProps {
  currentBlock: ITokenBlock;
  onChange: (block: ITokenBlock) => void;
}

const TokenBlockChain: React.FC<BlockChainProps> = ({
  currentBlock,
  onChange,
}) => {
  const [block, setBlock] = useState(currentBlock);
  const [status, setStatus] = useState<string | undefined>();
  const [mining, setMining] = useState(false);

  const isChain = status === "success";

  const onUpdateHashStatus = (inputBlock: ITokenBlock) => {
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

  const getBlockData = (block: IBlock) => {
    return `${block.id}${block.nonce}${block.data}${block.previous}`;
  };

  const calculateBlock = (inputBlock: ITokenBlock) => {
    const data = getTransactionsString(inputBlock.data);

    const blockData = getBlockData({ ...inputBlock, data });

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

    const data = getTransactionsString(block.data);

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
    updateTransactions: ITokenBlockTxs
  ) => {
    const updatedBlock = { ...currentBlock };
    updatedBlock.data[txsIndex] = updateTransactions;

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
            송금
          </Typography>
          {block.data.map((txs, index) => (
            <TokenBlockChainItem
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

export default TokenBlockChain;
