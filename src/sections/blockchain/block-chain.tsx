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
} from "@mui/material";
import HashOutput from "./hash-output";
import { mine, sha256, updateState } from "@/utils/blockchain";

interface Block {
  id: number;
  chain: number;
  nonce: number;
  data: string;
  previous: string;
  hash?: string;
  mining?: boolean;
}

interface BlockChainProps {
  currentBlock: Block;
  onChange: (block: Block) => void;
}

const BlockChain: React.FC<BlockChainProps> = ({ currentBlock, onChange }) => {
  const [block, setBlock] = useState(currentBlock);
  const [status, setStatus] = useState<string | undefined>();
  const [mining, setMining] = useState(false);

  const isChain = status === "success";

  const onUpdateHashStatus = (inputBlock: Block) => {
    const hashStatus = updateState(inputBlock.hash || "");
    console.log(hashStatus);
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

  const getBlockData = (block: Block) =>
    `${block.id}${block.nonce}${block.data}${block.previous}`;

  const handleMine = useCallback(() => {
    setMining(true);

    const miningResult = mine({
      nonce: block.nonce,
      blockNumber: block.id,
      data: block.data,
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

    const blockData = getBlockData(inputBlock);

    const hashValue = sha256(blockData);

    const hashStatus = updateState(hashValue);
    if (hashStatus === "valid") {
      setStatus("success");
    } else {
      setStatus("failure");
    }

    setBlock({ ...inputBlock, hash: hashValue });

    onChange({ ...inputBlock, hash: hashValue });
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
          <TextField
            label="Data"
            name="data"
            value={block.data}
            onChange={handleChange}
            multiline
            rows={3}
          />
          <HashOutput hash={block?.previous} title="Previous Hash" />
          <HashOutput hash={block?.hash || ""} status={isChain} title="Hash" />
        </Stack>
      </CardContent>
      <CardActions>
        <Button onClick={handleMine}>
          {mining ? "Mining..." : "Mine Block"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default BlockChain;
