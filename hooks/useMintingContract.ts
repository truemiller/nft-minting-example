import { useCallback, useEffect, useMemo, useState } from "react";
import { type Abi, type WalletClient, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import abi from "../abis/abi.json";
import {
  CONTRACT,
  MINT_MAX,
  RPC,
  isContractConfigured,
} from "../lib/mintConfig";

const contractAbi = abi as Abi;

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(RPC),
});

type ReadFunctionName = "totalSupply" | "isPublicMintEnabled";

const readContractValue = (functionName: ReadFunctionName) => {
  return publicClient.readContract({
    address: CONTRACT as `0x${string}`,
    abi: contractAbi,
    functionName,
  });
};

type UseMintingContractArgs = {
  ensureWalletClient: () => Promise<WalletClient | null>;
  switchNetwork: () => Promise<void>;
};

export const useMintingContract = ({
  ensureWalletClient,
  switchNetwork,
}: UseMintingContractArgs) => {
  const [totalSupply, setTotalSupply] = useState(0);
  const [isPublicMintEnabled, setIsPublicMintEnabled] = useState(false);

  const isSoldOut = useMemo(() => totalSupply >= MINT_MAX, [totalSupply]);
  const isMintable = useMemo(
    () => isContractConfigured && !isSoldOut && isPublicMintEnabled,
    [isPublicMintEnabled, isSoldOut],
  );

  const fetchTotalSupply = useCallback(async () => {
    if (!isContractConfigured) return;

    const supply = await readContractValue("totalSupply");
    setTotalSupply(Number(supply));
  }, []);

  const fetchIsPublicMintEnabled = useCallback(async () => {
    if (!isContractConfigured) {
      setIsPublicMintEnabled(false);
      return;
    }

    const enabled = await readContractValue("isPublicMintEnabled");
    setIsPublicMintEnabled(Boolean(enabled));
  }, []);

  const mint = useCallback(async (walletClient: WalletClient) => {
    if (!isContractConfigured) return;

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
  }, []);

  const handleMint = useCallback(async () => {
    if (!isContractConfigured) return;

    const walletClient = await ensureWalletClient();
    if (!walletClient) return;

    await switchNetwork();
    await mint(walletClient);
  }, [ensureWalletClient, mint, switchNetwork]);

  useEffect(() => {
    fetchTotalSupply();
    fetchIsPublicMintEnabled();
  }, [fetchIsPublicMintEnabled, fetchTotalSupply]);

  return {
    totalSupply,
    isMintable,
    isContractConfigured,
    handleMint,
  };
};
