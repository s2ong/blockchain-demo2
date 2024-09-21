import { useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import BlockChain from "../block-chain";
import { sha256 } from "@/utils/blockchain";

type Block = {
  id: number;
  chain: number;
  nonce: number;
  data: string;
  previous: string;
  hash?: string;
  mining?: boolean;
};

const initialBlocks: Block[] = [
  {
    id: 1,
    chain: 1,
    nonce: 11316,
    data: "",
    previous:
      "0000000000000000000000000000000000000000000000000000000000000000",
  },
  {
    id: 2,
    chain: 1,
    nonce: 35230,
    data: "",
    previous:
      "000015783b764259d382017d91a36d206d0600e2cbb3567748f46a33fe9297cf",
  },
  {
    id: 3,
    chain: 1,
    nonce: 12937,
    data: "",
    previous:
      "000012fa9b916eb9078f8d98a7864e697ae83ed54f5146bd84452cdafd043c19",
  },
  {
    id: 4,
    chain: 1,
    nonce: 35990,
    data: "",
    previous:
      "0000b9015ce2a08b61216ba5a0778545bf4ddd7ceb7bbd85dd8062b29a9140bf",
  },
  {
    id: 5,
    chain: 1,
    nonce: 56265,
    data: "",
    previous:
      "0000ae8bbc96cf89c68be6e10a865cc47c6c48a9ebec3c6cad729646cefaef83",
  },
];

const BlockChainView = () => {
  const [blocks, setBlocks] = useState(initialBlocks);

  const recalculateHashes = (updatedBlocks: Block[], startIndex: number) => {
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

  const handleUpdate = (updatedBlock: Block) => {
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
