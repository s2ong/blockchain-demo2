import { ChangeEvent, useEffect, useState } from "react";

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
};

const SignatureView = ({ keys }: Props) => {
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");

  const [verification, setVerification] = useState<boolean>();
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifyPublic, setVerifyPublic] = useState("");
  const [verifySignature, setVerifySignature] = useState("");

  const keyPair = keys?.keyPair;

  useEffect(() => {
    if (keys) {
      setVerifyPublic(keys.public);
    }
  }, [keys]);

  const signMessage = () => {
    const messageHash = CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);

    const binaryMessage = Buffer.from(messageHash, "hex");

    if (keyPair) {
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
    const isSignatureValid = verifySignatureWithPublicKey(
      verifyMessage,
      verifySignature,
      verifyPublic
    );

    console.log("Signature is valid:", isSignatureValid);
    setVerification(isSignatureValid);
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
            value={verifyPublic}
            onChange={(e) => setVerifyPublic(e.target.value)}
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
