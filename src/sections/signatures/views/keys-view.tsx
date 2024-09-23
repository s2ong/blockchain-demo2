import { ChangeEvent, useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { IKey } from "@/types/sign";

import { convertPrivateKey, generateKeysInDecimal } from "@/utils/keygen";
type Props = {
  keys: IKey | null;
  onUpdateKeys: (keys: IKey) => void;
};

const KeysView = ({ keys, onUpdateKeys }: Props) => {
  const [privateKey, setPrivateKey] = useState(keys?.private);
  const [publicKey, setPublicKey] = useState(keys?.public);

  const handlePrivateKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    const updatedPublicKey = convertPrivateKey(input);

    onUpdateKeys({ private: input, public: updatedPublicKey });

    setPrivateKey(input);
    setPublicKey(updatedPublicKey);
  };

  const handleGenerateKeys = () => {
    const { privateKey, publicKey } = generateKeysInDecimal();

    onUpdateKeys({ private: privateKey, public: publicKey });

    setPrivateKey(privateKey);
    setPublicKey(publicKey);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Public / Private Key Pairs
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Button variant="contained" onClick={handleGenerateKeys}>
            Generate Keys
          </Button>
          <TextField
            label="Private Key"
            fullWidth
            value={privateKey}
            onChange={handlePrivateKeyChange}
          />
          <TextField label="Public Key" fullWidth value={publicKey} disabled />
        </Stack>
      </Paper>
    </Container>
  );
};

export default KeysView;
