import { isAddress } from "viem";

export const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.trim() ?? "";
export const RPC = "https://rpc.ankr.com/eth";
export const MINT_PRICE = 0;
export const MINT_MAX = 100;

export const PARAMS = [
  {
    chainId: `0x${(1).toString(16)}`,
    chainName: "Ethereum",
    rpcUrls: [RPC],
    blockExplorer: ["https://etherscan.io/"],
  },
];

export const isContractConfigured = isAddress(CONTRACT);
