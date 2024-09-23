import { ChangeEvent, useEffect, useState } from "react";

import { ec } from "elliptic";
import CryptoJS from "crypto-js";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { IKey } from "@/types/sign";

import { verifySignatureWithPublicKey } from "@/utils/keygen";

import MessageSignature from "../message-signature";

type Props = {
  keys: IKey | null;
  keyPair: ec.KeyPair | null;
};

const SignatureView = ({ keys, keyPair }: Props) => {
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [publicKey, setPublicKey] = useState<string>();

  const [verification, setVerification] = useState<boolean>();
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifySignature, setVerifySignature] = useState("");

  useEffect(() => {
    if (keys) {
      setPublicKey(keys?.public);
    }
  }, [keys]);

  const signMessage = () => {
    const messageHash = CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);

    const binaryMessage = Buffer.from(messageHash, "hex");

    if (keys && keyPair) {
      const signature = keyPair.sign(binaryMessage);

      // 서명을 DER 형식으로 변환 후, Hex 문자열로 변환
      const hexSignature = Buffer.from(signature.toDER()).toString("hex");

      setSignature(hexSignature);
      setVerifySignature(hexSignature);
    }
  };

  const handleChangeMessage = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    setVerifyMessage(event.target.value);
  };

  const handleClickVerify = () => {
    if (publicKey) {
      const isSignatureValid = verifySignatureWithPublicKey(
        verifyMessage,
        verifySignature,
        publicKey
      );
      console.log("Signature is valid:", isSignatureValid);
      setVerification(isSignatureValid);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Signatures
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={handleChangeMessage}
            multiline
            rows={3}
          />
          <TextField
            label="Private Key"
            fullWidth
            value={keys?.private || ""}
            disabled
          />
          <Button variant="contained" onClick={signMessage}>
            서명
          </Button>
          <MessageSignature hash={signature} />
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Verify
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={verifyMessage}
            onChange={(e) => setVerifyMessage(e.target.value)}
            multiline
            rows={3}
          />
          <TextField
            label="Public Key"
            fullWidth
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
          />
          <TextField
            label="Signature"
            fullWidth
            value={verifySignature}
            onChange={(e) => setVerifySignature(e.target.value)}
          />

          <Button variant="contained" onClick={handleClickVerify}>
            검증
          </Button>
          <MessageSignature
            hash={verification ? "true" : "false"}
            status={verification}
          />
        </Stack>
      </Paper>
    </Container>
  );
};

export default SignatureView;
