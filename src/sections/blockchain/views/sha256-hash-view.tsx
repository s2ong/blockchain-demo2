import { ChangeEvent, useEffect, useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { calculateHash } from "@/utils/blockchain";

import HashOutput from "../hash-output";

const SHA256HashView = () => {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    const hashValue = calculateHash(value);
    setHash(hashValue);
  };

  useEffect(() => {
    const hashValue = calculateHash(input);
    setHash(hashValue);
  }, [input]);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        SHA256 Hashing
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Stack>
          <TextField
            fullWidth
            label="Data"
            variant="outlined"
            value={input}
            onChange={handleInputChange}
            multiline
            rows={3}
          />

          <HashOutput hash={hash} />
        </Stack>
      </Paper>
    </Container>
  );
};

export default SHA256HashView;
