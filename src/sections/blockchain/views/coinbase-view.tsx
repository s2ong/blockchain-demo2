import { useState, useEffect } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

import { COINS } from "@/_mock/_blockchain";

import { recalculateCoinBlockChain } from "@/utils/blockchain";

import { ICoinBlock } from "@/types/blockchain";

import CoinBlockChain from "../coin-block-chain";

const CoinbaseView = () => {
  const tokens1 = COINS(1);
  const tokens2 = COINS(2);
  const tokens3 = COINS(3);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Coinbase
      </Typography>

      <Stack spacing={1}>
        <PeerTokenChain peerName="Peer A" initialBlocks={tokens1} />

        <PeerTokenChain peerName="Peer B" initialBlocks={tokens2} />

        <PeerTokenChain peerName="Peer C" initialBlocks={tokens3} />
      </Stack>
    </Container>
  );
};

export default CoinbaseView;

const PeerTokenChain = ({
  peerName,
  initialBlocks,
}: {
  peerName: string;
  initialBlocks: ICoinBlock[];
}) => {
  const [blocks, setBlocks] = useState(initialBlocks);

  const initializeHashes = (initialBlocks: ICoinBlock[]) => {
    const updatedBlocks = [...initialBlocks];
    const result = recalculateCoinBlockChain(updatedBlocks);
    setBlocks(result);
  };

  useEffect(() => {
    initializeHashes(initialBlocks);
  }, [initialBlocks]);

  const handleUpdate = (updatedBlock: ICoinBlock) => {
    const updatedBlocks = [...blocks];
    const blockIndex = updatedBlocks.findIndex(
      (block) => block.id === updatedBlock.id
    );

    if (blockIndex !== -1) {
      updatedBlocks[blockIndex] = { ...updatedBlock };

      const recalculatedBlocks = recalculateCoinBlockChain(
        updatedBlocks,
        blockIndex
      );

      setBlocks(recalculatedBlocks);
    }
  };

  return (
    <Paper sx={{ p: 2, bgcolor: "text.secondary" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {peerName}
      </Typography>
      <Stack spacing={2} direction="row" sx={{ overflow: "auto", pb: 1 }}>
        {blocks.map((block, index) => (
          <CoinBlockChain
            key={block.id}
            currentBlock={block}
            onChange={handleUpdate}
          />
        ))}
      </Stack>
    </Paper>
  );
};
