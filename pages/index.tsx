import Head from "next/head";
import { About } from "../components/About";
import Hero from "../components/Hero";
import { MintSection } from "../components/MintSection";
import { useMintingContract } from "../hooks/useMintingContract";
import { useWalletClient } from "../hooks/useWalletClient";

function App() {
  const { ensureWalletClient, switchNetwork } = useWalletClient();
  const { totalSupply, isMintable, isContractConfigured, handleMint } =
    useMintingContract({ ensureWalletClient, switchNetwork });

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
