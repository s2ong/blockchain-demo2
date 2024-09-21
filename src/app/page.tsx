"use client";

import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import SHA256HashView from "@/sections/blockchain/views/sha256-hash-view";
import BlockView from "@/sections/blockchain/views/block-view";
import BlockChainView from "@/sections/blockchain/views/blockchain-view";
import DistributedView from "@/sections/blockchain/views/distributed-view";
import TokenView from "@/sections/blockchain/views/token-view";
import CoinbaseView from "@/sections/blockchain/views/coinbase-view";

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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
    </Box>
  );
}
