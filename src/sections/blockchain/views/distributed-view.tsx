import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { BLOCKS } from "@/_mock/_block";

import PeerBlockChain from "../peer-block-chain";

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
