import React, { ChangeEvent } from "react";
import { TextField, Stack } from "@mui/material";

import { ITokenBlockTxs } from "@/types/blockchain";

interface Props {
  txs: ITokenBlockTxs;
  txsIndex: number;
  onChange: (txsIndex: number, updateTxs: ITokenBlockTxs) => void;
}

const BlockChainItem: React.FC<Props> = ({ txs, txsIndex, onChange }) => {
  const { value, from, to } = txs;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(txsIndex, { ...txs, [event.target.name]: event.target.value });
  };

  return (
    <Stack spacing={2} direction="row">
      <TextField
        label="₩"
        name="value"
        value={value}
        onChange={handleChange}
        sx={{ width: 300 }}
      />
      <TextField
        label="보낸이"
        name="from"
        value={from}
        onChange={handleChange}
        sx={{ width: 300 }}
      />
      <TextField
        label="받는이"
        name="to"
        value={to}
        onChange={handleChange}
        sx={{ width: 300 }}
      />
    </Stack>
  );
};

export default BlockChainItem;
