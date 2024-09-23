import { useState, useEffect } from "react";

import { ec } from "elliptic";

import Box from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

import { BITCOINS } from "@/_mock/_signatures";

import { IBitCoinBlock, IKey } from "@/types/sign";

import { recalculateBitCoinBlockChain } from "@/utils/blockchain";

import BitcoinBlockChain from "../bitcoin-block-chain";

type Props = {
  keys: IKey | null;
  keyPair: ec.KeyPair | null;
};

const BitcoinView = ({ keys, keyPair }: Props) => {
  const blockchains1 = BITCOINS(1);
  const blockchains2 = BITCOINS(2);
  const blockchains3 = BITCOINS(3);

  return (
    <Box sx={{ m: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bitcoin blockchain
      </Typography>

      <Stack spacing={1}>
        <PeerBlockChain
          peerName="Peer A"
          initialBlocks={blockchains1}
          keys={keys}
          keyPair={keyPair}
        />

        <PeerBlockChain
          peerName="Peer B"
          initialBlocks={blockchains2}
          keys={keys}
          keyPair={keyPair}
        />

        <PeerBlockChain
          peerName="Peer C"
          initialBlocks={blockchains3}
          keys={keys}
          keyPair={keyPair}
        />
      </Stack>
    </Box>
  );
};

export default BitcoinView;

const PeerBlockChain = ({
  peerName,
  initialBlocks,
  keys,
  keyPair,
}: {
  peerName: string;
  initialBlocks: IBitCoinBlock[];
  keys: IKey | null;
  keyPair: ec.KeyPair | null;
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
            keys={keys}
            keyPair={keyPair}
            onChange={handleUpdate}
          />
        ))}
      </Stack>
    </Paper>
  );
};
