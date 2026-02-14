import { useMemo } from "react";
import Countdown from "react-countdown";
import { CONTRACT, MINT_MAX, MINT_PRICE, PARAMS } from "../pages";

type MintSectionProps = {
  totalSupply: number;
  isMintable: boolean;
  isContractConfigured: boolean;
  handleMint: () => Promise<void>;
};

export const MintSection = ({
  totalSupply,
  isMintable,
  isContractConfigured,
  handleMint,
}: MintSectionProps) => {
  const latestMintName = "Example Collection";
  const date = useMemo(() => {
    return new Date(Date.UTC(2023, 2, 18, 17));
  }, []);
  return (
    <div id="mint" className="p-5 py-20 bg-black flex flex-col mx-auto my-auto">
      <div className="container mx-auto">
        <h2>Mint</h2>
        <p>
          Mint from <strong>{latestMintName}</strong>.
        </p>
        <div
          className="bg-slate-900 bg-opacity-75 backdrop-blur-xl p-5 rounded-xl border-2 mx-auto"
          style={{ width: 700 }}
        >
          <div className="text-center">
            <Countdown date={date} />
          </div>
          <div className="p-1 font-extrabold">
            Mint {latestMintName} ({totalSupply}/{MINT_MAX})
          </div>
          <div className="rounded-xl flex flex-col gap-3">
            <span className="absolute mt-3 ml-3">Price (ETH)</span>
            <input
              type="text"
              className="w-full rounded-xl p-3 bg-slate-700 text-right"
              placeholder="Price"
              value={"Free"}
              disabled
            />
            {isMintable && (
              <button
                onClick={handleMint}
                className={`bg-white text-slate-900 ${
                  isMintable && "bg-green-500"
                }`}
              >
                Mint
              </button>
            )}
            {!isContractConfigured && (
              <p className="text-sm">
                Contract not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS to
                enable minting.
              </p>
            )}

            <ul className="text-sm">
              <li>Network: {PARAMS[0].chainName}</li>
              <li>Price: {MINT_PRICE} ETH</li>
              <li>Contract: {CONTRACT || "Not configured"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
