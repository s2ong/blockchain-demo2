import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

import { BLOCKS } from "@/_mock/_block";

import { IBlock } from "@/types/blockchain";

import { recalculateBlcokChain, sha256 } from "@/utils/blockchain";

import BlockChain from "../block-chain";

const DistributedView = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Distributed
      </Typography>

      <Stack spacing={1}>
        <PeerBlockChain peerName="Peer A" initialBlocks={BLOCKS} />

        <PeerBlockChain peerName="Peer B" initialBlocks={BLOCKS} />

        <PeerBlockChain peerName="Peer C" initialBlocks={BLOCKS} />
      </Stack>
    </Container>
  );
};

export default DistributedView;

const PeerBlockChain = ({
  peerName,
  initialBlocks,
}: {
  peerName: string;
  initialBlocks: IBlock[];
}) => {
  const [blocks, setBlocks] = useState(initialBlocks);

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
    const blocksWithHashes = initializeHashes(initialBlocks);
    setBlocks(blocksWithHashes);
  }, [initialBlocks]);

  const handleUpdate = (updatedBlock: IBlock) => {
    const updatedBlocks = [...blocks];
    const blockIndex = updatedBlocks.findIndex(
      (block) => block.id === updatedBlock.id
    );

    if (blockIndex !== -1) {
      updatedBlocks[blockIndex] = { ...updatedBlock };
      const recalculatedBlocks = recalculateBlcokChain(
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
          <BlockChain
            key={index}
            currentBlock={block}
            onChange={handleUpdate}
          />
        ))}
      </Stack>
    </Paper>
  );
};
