import Head from "next/head";
import { useEffect, useState } from "react";
import {
  isAddress,
  http,
  type Abi,
  type WalletClient,
  createPublicClient,
  createWalletClient,
  custom,
} from "viem";
import { mainnet } from "viem/chains";
import abi from "../abis/abi.json";
import { About } from "../components/About";
import Hero from "../components/Hero";
import { MintSection } from "../components/MintSection";

export const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.trim() ?? "";
export const RPC = "https://rpc.ankr.com/eth";
export const MINT_PRICE = 0;
export const MINT_MAX = 100;

export const PARAMS = [
  {
    chainId: "0x" + (1).toString(16),
    chainName: "Ethereum",
    rpcUrls: [RPC],
    blockExplorer: ["https://etherscan.io/"],
  },
];

const contractAbi = abi as Abi;
const isContractConfigured = isAddress(CONTRACT);

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(RPC),
});

function App() {
  const [connected, setConnected] = useState(false);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [isPublicMintEnabled, setIsPublicMintEnabled] = useState(false);

  const isSoldOut: boolean = totalSupply >= MINT_MAX;
  const isMintable: boolean =
    isContractConfigured && !isSoldOut && isPublicMintEnabled;

  const getWalletClient = () => {
    if (!window.ethereum) return null;

    return createWalletClient({
      chain: mainnet,
      transport: custom(window.ethereum),
    });
  };

  const connect = async () => {
    if (!window.ethereum) return;

    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    const client = getWalletClient();
    setWalletClient(client);
    setConnected(!!accounts[0]);
  };

  const mint = async () => {
    if (!walletClient || !isContractConfigured) return;

    try {
      const addresses = await walletClient.getAddresses();
      const account = addresses[0];
      if (!account) return;

      const hash = await walletClient.writeContract({
        account,
        address: CONTRACT as `0x${string}`,
        abi: contractAbi,
        chain: mainnet,
        functionName: "mint",
      });

      await publicClient.waitForTransactionReceipt({ hash });
      setTotalSupply((current) => current + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalSupply = async () => {
    if (!isContractConfigured) return;

    const supply = await publicClient.readContract({
      address: CONTRACT as `0x${string}`,
      abi: contractAbi,
      functionName: "totalSupply",
    });

    setTotalSupply(Number(supply));
  };

  const switchNetwork = async () => {
    if (!window.ethereum) return;

    const ethereum = window.ethereum as {
      request: (args: { method: string; params?: unknown }) => Promise<unknown>;
    };

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: PARAMS[0].chainId }],
      });
    } catch (switchError) {
      console.log(switchError);
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: PARAMS,
        });
      } catch (addError) {
        console.log(addError);
      }
    }
  };

  const handleConnect = async () => {
    await connect();
  };

  const handleMint = async () => {
    if (!isContractConfigured) return;

    await handleConnect();
    await switchNetwork();
    await mint();
  };

  const fetchIsPublicMintEnabled = async () => {
    if (!isContractConfigured) {
      setIsPublicMintEnabled(false);
      return;
    }

    const enabled = await publicClient.readContract({
      address: CONTRACT as `0x${string}`,
      abi: contractAbi,
      functionName: "isPublicMintEnabled",
    });

    setIsPublicMintEnabled(Boolean(enabled));
  };

  useEffect(() => {
    const preConnect = async () => {
      if (!window.ethereum) return;

      const accounts = (await window.ethereum.request({
        method: "eth_accounts",
      })) as string[];

      const client = getWalletClient();
      setWalletClient(client);
      setConnected(!!accounts[0]);
    };

    fetchTotalSupply();
    fetchIsPublicMintEnabled();
    preConnect();
  }, []);

  return (
    <>
      <Hero />
      <Head>
        <title>NFT Minting Example</title>
      </Head>
      <MintSection
        totalSupply={totalSupply}
        isMintable={isMintable}
        isContractConfigured={isContractConfigured}
        handleMint={handleMint}
      />
      <About />
      <footer className="flex w-screen mt-auto bg-black">
        <div className="container text-white mx-auto p-3 flex">
          <span>
            Educational NFT minting example. Limited updates expected.
          </span>
        </div>
      </footer>
    </>
  );
}

export default App;
