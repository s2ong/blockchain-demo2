import { useCallback, useEffect, useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { mine, sha256, updateState } from "@/utils/blockchain";

import HashOutput from "../hash-output";

const BlockView = () => {
  const [blockNumber, setBlockNumber] = useState(1);
  const [nonce, setNonce] = useState(72608);
  const [data, setData] = useState("");
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [mining, setMining] = useState(false);

  const calculateHash = useCallback(() => {
    const blockData = `${blockNumber}${nonce}${data}`;

    const hashValue = sha256(blockData);
    setHash(hashValue);

    const hashStatus = updateState(hashValue);
    if (hashStatus === "valid") {
      setStatus("success");
    } else {
      setStatus("failure");
    }
  }, [blockNumber, data, nonce]);

  const handleMine = useCallback(() => {
    setMining(true);

    const miningResult = mine({ nonce, blockNumber, data });

    if (miningResult.status === "success") {
      setNonce(miningResult.nonce);
      setHash(miningResult.hash);
    }
    setStatus(miningResult?.status);
    setMining(false);
  }, [blockNumber, data, nonce]);

  useEffect(() => {
    calculateHash();
  }, [blockNumber, data, nonce, calculateHash]);

  const isChain = status === "success";

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Block
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Block Number"
            variant="outlined"
            type="number"
            value={blockNumber}
            onChange={(e) => setBlockNumber(Number(e.target.value))}
          />
          <TextField
            fullWidth
            label="Nonce"
            variant="outlined"
            type="number"
            value={nonce}
            onChange={(e) => setNonce(Number(e.target.value))}
          />
          <TextField
            fullWidth
            label="Data"
            variant="outlined"
            value={data}
            onChange={(e) => setData(e.target.value)}
            multiline
            rows={3}
          />

          <HashOutput hash={hash} status={isChain} />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleMine}
            disabled={mining}
          >
            {mining ? <CircularProgress size={24} /> : "채굴"}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default BlockView;
