# NFT Minting Example

This is a basic NFT minting example built with Next.js and viem.

It is intentionally simple and educational:
- wallet connect
- chain switch
- contract reads (`totalSupply`, `isPublicMintEnabled`)
- mint transaction call

## Scope

- This is a learning template, not production-ready infrastructure.
- Security hardening, indexing, analytics, and advanced UX are out of scope.
- Expect limited updates, if any.

## Quick Start

Requirements:
- Node.js 18+
- pnpm 10+

Install and run:

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 (or the next available port).

## Required Configuration

Create `.env.local`:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
```

If `NEXT_PUBLIC_CONTRACT_ADDRESS` is missing or invalid, minting is disabled on purpose.

## Scripts

- `pnpm dev` - start dev server
- `pnpm build` - production build
- `pnpm start` - run built app
- `pnpm lint` - Biome lint
- `pnpm lint:fix` - Biome lint with safe fixes
- `pnpm format` - format files
- `pnpm format:check` - formatting check
- `pnpm check` - lint + format check

## Notes

- Sample NFT metadata is included in `public/json/cats` as placeholder example data.
- Replace contract ABI, address, metadata, and UI text before using this in a real project.
