"use client";

import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import SHA256HashView from "@/sections/blockchain/views/sha256-hash-view";
import BlockView from "@/sections/blockchain/views/block-view";
import BlockChainView from "@/sections/blockchain/views/blockchain-view";
import DistributedView from "@/sections/blockchain/views/distributed-view";
import TokenView from "@/sections/blockchain/views/token-view";
import CoinbaseView from "@/sections/blockchain/views/coinbase-view";
import KeysView from "@/sections/signatures/views/keys-view";
import SignatureView from "@/sections/signatures/views/signature-view";
import { generateKeysInDecimal } from "@/utils/keygen";
import { ec } from "elliptic";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BlockchainPage() {
  const [value, setValue] = useState(0);
  const [keys, setKeys] = useState<IKey | null>(null);
  const [genKeyPair, setGenKeyPair] = useState<ec.KeyPair | null>(null);

  const disabledKey = keys?.private === "";

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const updateKeyPair = (keys: IKey) => {
    setKeys({ private: keys.private, public: keys.public });
  };

  const generateKeys = () => {
    const { privateKey, publicKey, keyPair } = generateKeysInDecimal();

    setKeys({ private: privateKey, public: publicKey });

    setGenKeyPair(keyPair);
  };

  useEffect(() => {
    if (!keys) {
      generateKeys();
    }
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="해시" {...a11yProps(0)} />
          <Tab label="블록" {...a11yProps(1)} />
          <Tab label="블록체인" {...a11yProps(2)} />
          <Tab label="분산" {...a11yProps(3)} />
          <Tab label="토큰" {...a11yProps(4)} />
          <Tab label="코인베이스" {...a11yProps(5)} />
          <Tab label="공개키와 개인키" {...a11yProps(6)} />
          <Tab label="서명" {...a11yProps(7)} disabled={disabledKey} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <SHA256HashView />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <BlockView />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <BlockChainView />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <DistributedView />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <TokenView />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <CoinbaseView />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={6}>
        <KeysView keys={keys} onUpdateKeys={updateKeyPair} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={7}>
        <SignatureView keys={keys} keyPair={genKeyPair} />
      </CustomTabPanel>
    </Box>
  );
}
