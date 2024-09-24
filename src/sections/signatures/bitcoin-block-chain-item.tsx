import React, { ChangeEvent, useState } from "react";

import CryptoJS from "crypto-js";
import { ec as EC } from "elliptic";

import { TextField, Stack, Paper } from "@mui/material";

import { IBitcoinBlockTx } from "@/types/sign";
import { PRIVATE_KEYS } from "@/_mock/_signatures";

// elliptic curve 객체 생성
const ec = new EC("secp256k1");

interface Props {
  txs: IBitcoinBlockTx;
  txsIndex: number;
  onChange: (txsIndex: number, updateTxs: IBitcoinBlockTx) => void;
}

const BitcoinBlockChainItem: React.FC<Props> = ({
  txs,
  txsIndex,
  onChange,
}) => {
  const [status, setStatus] = useState<boolean | null>(null);

  const { value, from, to, seq, sig } = txs;

  const getBitcoinTxString = (block: IBitcoinBlockTx) => {
    return `${block.value}${block.from}${block.to}${block.seq}${block.sig}`;
  };

  const verifyMessage = (tx: IBitcoinBlockTx) => {
    const txData = getBitcoinTxString(tx);

    const messageHash = CryptoJS.SHA256(txData).toString(CryptoJS.enc.Hex);

    const binaryMessage = Buffer.from(messageHash, "hex");

    const result = PRIVATE_KEYS.find((t) => t.public === tx.from);

    if (result) {
      // private key로부터 key pair를 생성
      const keyPair = ec.keyFromPrivate(result.private, "hex");

      // 서명을 검증할 public key를 가져옴
      const publicKey = keyPair.getPublic("hex");

      console.log("Public Key:", publicKey);

      // 트랜잭션의 서명을 검증
      const isValid = keyPair.verify(binaryMessage, tx.sig);

      console.log("Signature is valid:", isValid);
      setStatus(isValid);
    } else {
      console.log("Public key not found for the given 'from' address.");
      setStatus(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const result = { ...txs, [event.target.name]: event.target.value };

    verifyMessage(result);

    onChange(txsIndex, result);
  };

  return (
    <Paper sx={{ bgcolor: "text.secondary", p: 1 }}>
      <Paper sx={{ backgroundColor: "white", p: 1 }}>
        <Stack spacing={2} direction="row">
          <TextField
            label="₩"
            name="value"
            value={value}
            onChange={handleChange}
            sx={{ width: 300 }}
            size="small"
          />
          <TextField
            label="보낸이"
            name="from"
            value={from}
            onChange={handleChange}
            sx={{ width: 300 }}
            size="small"
          />
          <TextField
            label="받는이"
            name="to"
            value={to}
            onChange={handleChange}
            sx={{ width: 300 }}
            size="small"
          />
        </Stack>
        <Stack spacing={2} direction="row" sx={{ mt: 1 }}>
          <TextField
            label="Seq"
            name="seq"
            value={seq}
            onChange={handleChange}
            size="small"
          />
          <TextField
            label="Signature"
            name="sig"
            value={sig}
            onChange={handleChange}
            size="small"
            fullWidth
            sx={{
              input: {
                color: status === false ? "red" : "black",
              },
            }}
          />
        </Stack>
      </Paper>
    </Paper>
  );
};

export default BitcoinBlockChainItem;
