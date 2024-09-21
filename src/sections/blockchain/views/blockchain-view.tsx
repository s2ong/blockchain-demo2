import { useEffect, useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import { sha256 } from "@/utils/blockchain";

import { BLOCKS } from "@/_mock/_block";

import { IBlock } from "@/types/blockchain";

import BlockChain from "../block-chain";

const BlockChainView = () => {
  const [blocks, setBlocks] = useState<IBlock[]>([]);

  const initializeHashes = (initialBlocks: IBlock[]) => {
    const updatedBlocks = [...initialBlocks];
    for (let i = 0; i < updatedBlocks.length; i++) {
      const previousHash =
        i === 0
          ? "0000000000000000000000000000000000000000000000000000000000000000"
          : updatedBlocks[i - 1].hash || "";
      const blockData = `${updatedBlocks[i].id}${updatedBlocks[i].nonce}${updatedBlocks[i].data}${previousHash}`;
      const newHash = sha256(blockData).toString();

      updatedBlocks[i] = {
        ...updatedBlocks[i],
        previous: previousHash,
        hash: newHash,
      };
    }
    return updatedBlocks;
  };

  useEffect(() => {
    const blocksWithHashes = initializeHashes(BLOCKS);
    setBlocks(blocksWithHashes);
  }, []);

  const recalculateHashes = (updatedBlocks: IBlock[], startIndex: number) => {
    for (let i = startIndex; i < updatedBlocks.length; i++) {
      const previousHash =
        i === 0
          ? "0000000000000000000000000000000000000000000000000000000000000000"
          : updatedBlocks[i - 1].hash || "";
      const blockData = `${updatedBlocks[i].id}${updatedBlocks[i].nonce}${updatedBlocks[i].data}${previousHash}`;
      const newHash = sha256(blockData);

      updatedBlocks[i] = {
        ...updatedBlocks[i],
        previous: previousHash,
        hash: newHash,
      };
    }
    return updatedBlocks;
  };

  const handleUpdate = (updatedBlock: IBlock) => {
    const updatedBlocks = [...blocks];
    const blockIndex = updatedBlocks.findIndex(
      (block) => block.id === updatedBlock.id
    );

    if (blockIndex !== -1) {
      updatedBlocks[blockIndex] = { ...updatedBlock };
      const recalculatedBlocks = recalculateHashes(updatedBlocks, blockIndex);

      setBlocks(recalculatedBlocks);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Blockchian
      </Typography>
      <Paper sx={{ p: 2, bgcolor: "text.secondary" }}>
        <Stack spacing={2} direction="row" sx={{ overflow: "auto", pb: 1 }}>
          {blocks.map((block, index) => (
            <BlockChain
              key={index}
              currentBlock={block}
              onChange={handleUpdate}
            />
          ))}
        </Stack>
      </Paper>
    </Container>
  );
};

export default BlockChainView;
