import { ChangeEvent, useEffect, useState } from "react";

import { ec } from "elliptic";
import CryptoJS from "crypto-js";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { ITokenBlockTxs } from "@/types/blockchain";
import { IKey } from "@/types/sign";

import { verifySignatureWithPublicKey } from "@/utils/keygen";

import MessageSignature from "../message-signature";

type Props = {
  keys: IKey | null;
  keyPair: ec.KeyPair | null;
};

const SignatureView = ({ keys, keyPair }: Props) => {
  const [message, setMessage] = useState<ITokenBlockTxs>({
    value: "20.00",
    from: "04bbbe956c94edcce682d1fdd10432ba8136b6c5af797ed174521011de1c7b2137b89eeac4b2fd5ea70a6e1274b897ba624d98b5b494312e0c93b2241279aa3b9d",
    to: "04cc955bf8e359cc7ebbb66f4c2dc616a93e8ba08e93d27996e20299ba92cba9cbd73c2ff46ed27a3727ba09486ba32b5ac35dd20c0adec020536996ca4d9f3d74",
  });
  const [signature, setSignature] = useState("");
  const [publicKey, setPublicKey] = useState<string>();

  const [verification, setVerification] = useState<boolean>();
  const [verifyMessage, setVerifyMessage] = useState(message);
  const [verifySignature, setVerifySignature] = useState("");

  useEffect(() => {
    if (keys) {
      setPublicKey(keys?.public);
    }
  }, [keys]);

  const signMessage = () => {
    const result = `${message.value}${message.from}${message.to}`;

    const messageHash = CryptoJS.SHA256(result).toString(CryptoJS.enc.Hex);

    const binaryMessage = Buffer.from(messageHash, "hex");

    if (keys && keyPair) {
      const signature = keyPair.sign(binaryMessage);

      // 서명을 DER 형식으로 변환 후, Hex 문자열로 변환
      const hexSignature = Buffer.from(signature.toDER()).toString("hex");

      setSignature(hexSignature);
      setVerifySignature(hexSignature);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage({ ...message, [event.target.name]: event.target.value });
  };

  const handleChangeVerify = (event: ChangeEvent<HTMLInputElement>) => {
    setVerifyMessage({
      ...verifyMessage,
      [event.target.name]: event.target.value,
    });
  };

  const handleClickVerify = () => {
    if (publicKey) {
      const result = `${verifyMessage.value}${verifyMessage.from}${verifyMessage.to}`;

      const isSignatureValid = verifySignatureWithPublicKey(
        result,
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
        Transaction
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign
        </Typography>
        <Stack spacing={2}>
          <Stack spacing={2} direction="row">
            <TextField
              label="₩"
              name="value"
              value={message.value}
              onChange={handleChange}
            />
            <TextField
              label="보낸이"
              name="from"
              value={message.from}
              onChange={handleChange}
            />
            <TextField
              label="받는이"
              name="to"
              value={message.to}
              onChange={handleChange}
            />
          </Stack>
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
          <Stack spacing={2} direction="row">
            <TextField
              label="₩"
              name="value"
              value={verifyMessage.value}
              onChange={handleChangeVerify}
            />
            <TextField
              label="보낸이"
              name="from"
              value={verifyMessage.from}
              onChange={handleChangeVerify}
            />
            <TextField
              label="받는이"
              name="to"
              value={verifyMessage.to}
              onChange={handleChangeVerify}
            />
          </Stack>
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
