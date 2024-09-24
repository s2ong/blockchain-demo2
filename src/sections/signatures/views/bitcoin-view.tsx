import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

import { BITCOINS } from "@/_mock/_signatures";

import { IBitCoinBlock } from "@/types/sign";

import { recalculateBitCoinBlockChain } from "@/utils/blockchain";

import BitcoinBlockChain from "../bitcoin-block-chain";

const BitcoinView = () => {
  const blockchains1 = BITCOINS(1);
  const blockchains2 = BITCOINS(2);
  const blockchains3 = BITCOINS(3);

  return (
    <Box sx={{ m: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bitcoin blockchain
      </Typography>

      <Stack spacing={1}>
        <PeerBlockChain peerName="Peer A" initialBlocks={blockchains1} />

        <PeerBlockChain peerName="Peer B" initialBlocks={blockchains2} />

        <PeerBlockChain peerName="Peer C" initialBlocks={blockchains3} />
      </Stack>
    </Box>
  );
};

export default BitcoinView;

const PeerBlockChain = ({
  peerName,
  initialBlocks,
}: {
  peerName: string;
  initialBlocks: IBitCoinBlock[];
}) => {
  const [blocks, setBlocks] = useState(initialBlocks);

  const initializeHashes = (initialBlocks: IBitCoinBlock[]) => {
    const updatedBlocks = [...initialBlocks];
    const result = recalculateBitCoinBlockChain(updatedBlocks);
    setBlocks(result);
  };

  useEffect(() => {
    initializeHashes(initialBlocks);
  }, [initialBlocks]);

  const handleUpdate = (updatedBlock: IBitCoinBlock) => {
    const updatedBlocks = [...blocks];
    const blockIndex = updatedBlocks.findIndex(
      (block) => block.id === updatedBlock.id
    );

    if (blockIndex !== -1) {
      updatedBlocks[blockIndex] = { ...updatedBlock };

      const recalculatedBlocks = recalculateBitCoinBlockChain(
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
        {blocks.map((block) => (
          <BitcoinBlockChain
            key={block.id}
            currentBlock={block}
            onChange={handleUpdate}
          />
        ))}
      </Stack>
    </Paper>
  );
};
