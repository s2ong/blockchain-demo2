import React, { ChangeEvent } from "react";

import CryptoJS from "crypto-js";
import { ec as EC } from "elliptic";

import { TextField, Stack, Paper } from "@mui/material";

import { IBitcoinBlockTx } from "@/types/sign";

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
  const { value, from, to, seq, sig } = txs;

  const getBitcoinTxString = (block: IBitcoinBlockTx) => {
    return `${block.value}${block.from}${block.to}${block.seq}${block.sig}`;
  };

  const verifyMessage = (tx: IBitcoinBlockTx) => {
    const txData = getBitcoinTxString(tx);

    const messageHash = CryptoJS.SHA256(txData).toString(CryptoJS.enc.Hex);

    const binaryMessage = Buffer.from(messageHash, "hex");

    const publicKey = ec.keyFromPublic(tx.from, "hex");
    console.log(publicKey);

    console.log("Signature is valid:", publicKey.verify(binaryMessage, tx.sig));
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
            sx={{ width: 80 }}
            size="small"
          />
          <TextField
            label="Signature"
            name="sig"
            value={sig}
            onChange={handleChange}
            size="small"
            fullWidth
          />
        </Stack>
      </Paper>
    </Paper>
  );
};

export default BitcoinBlockChainItem;
