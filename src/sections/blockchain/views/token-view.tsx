import { useState, useEffect } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

import { TOKENS } from "@/_mock/_blockchain";

import { recalculateTokenBlockChain } from "@/utils/blockchain";

import { ITokenBlock } from "@/types/blockchain";

import TokenBlockChain from "../token-block-chain";

const TokenView = () => {
  const tokens1 = TOKENS(1);
  const tokens2 = TOKENS(2);
  const tokens3 = TOKENS(3);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Token
      </Typography>

      <Stack spacing={1}>
        <PeerTokenChain peerName="Peer A" initialBlocks={tokens1} />

        <PeerTokenChain peerName="Peer B" initialBlocks={tokens2} />

        <PeerTokenChain peerName="Peer C" initialBlocks={tokens3} />
      </Stack>
    </Container>
  );
};

export default TokenView;

const PeerTokenChain = ({
  peerName,
  initialBlocks,
}: {
  peerName: string;
  initialBlocks: ITokenBlock[];
}) => {
  const [blocks, setBlocks] = useState(initialBlocks);

  const initializeHashes = (initialBlocks: ITokenBlock[]) => {
    const updatedBlocks = [...initialBlocks];
    const recalculatedBlocks = recalculateTokenBlockChain(updatedBlocks);
    setBlocks(recalculatedBlocks);
  };

  useEffect(() => {
    initializeHashes(initialBlocks);
  }, [initialBlocks]);

  const handleUpdate = (updatedBlock: ITokenBlock) => {
    const updatedBlocks = [...blocks];
    const blockIndex = updatedBlocks.findIndex(
      (block) => block.id === updatedBlock.id
    );

    if (blockIndex !== -1) {
      updatedBlocks[blockIndex] = { ...updatedBlock };

      const recalculatedBlocks = recalculateTokenBlockChain(
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
          <TokenBlockChain
            key={block.id}
            currentBlock={block}
            onChange={handleUpdate}
          />
        ))}
      </Stack>
    </Paper>
  );
};
