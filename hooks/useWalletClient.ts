import { useCallback, useEffect, useState } from "react";
import { type WalletClient, createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";
import { PARAMS } from "../lib/mintConfig";

type RequestMethod = "eth_requestAccounts" | "eth_accounts";

export const useWalletClient = () => {
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);

  const getWalletClient = useCallback(() => {
    if (!window.ethereum) return null;

    return createWalletClient({
      chain: mainnet,
      transport: custom(window.ethereum),
    });
  }, []);

  const requestAccounts = useCallback(async (method: RequestMethod) => {
    if (!window.ethereum) return;

    await window.ethereum.request({ method });
  }, []);

  const syncWalletClient = useCallback(() => {
    const client = getWalletClient();
    setWalletClient(client);
    return client;
  }, [getWalletClient]);

  const ensureWalletClient = useCallback(async () => {
    if (walletClient) return walletClient;

    await requestAccounts("eth_requestAccounts");
    return syncWalletClient();
  }, [requestAccounts, syncWalletClient, walletClient]);

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: PARAMS[0].chainId }],
      });
    } catch (switchError) {
      console.log(switchError);
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: PARAMS,
        });
      } catch (addError) {
        console.log(addError);
      }
    }
  }, []);

  useEffect(() => {
    const preConnect = async () => {
      if (!window.ethereum) return;

      await requestAccounts("eth_accounts");
      syncWalletClient();
    };

    preConnect();
  }, [requestAccounts, syncWalletClient]);

  return {
    ensureWalletClient,
    switchNetwork,
  };
};
