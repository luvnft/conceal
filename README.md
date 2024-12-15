## Concealmint Indexer

![cover](./assets/og.png)

This repo contains a basic indexer for [CONCEALMINT](https://concealmint.com) using [ponder.sh](https://conder.sh) and [Pinata](https://pinata.cloud). Using the `Transfer` and `MetadataUpdate` events on the [contract](https://github.com/PinataCloud/concealmint-contracts) it will record basic information of the NFTs, who their owners are, and build optimized image links using Pinata IPFS Gateways and CDN.

## Development

Clone the  repo and install dependencies (would recommend `pnpm`)

```
git clone https://github.com/PinataCloud/concealmint-indexer
cd concealmint-indexer
pnpm install
```

Rename the `.env.example` file to `.env.local` and fill in the values

```
PONDER_RPC_URL_84532= # RPC URL, the 84532 is for Base Sepolia so be sure to update it to your chain id
CONTRACT_ADDRESS= # The deployed contract address
PINATA_JWT= # Your Pinata JWT API Key
GATEWAY_URL= # Your Pinata IPFS Gateway URL
API_KEY= # Optional API key you can generate to help secure your API routes, i.e. `openssl rand -hex 64`
```

Start up the dev server and let it index events from the contract

```
pnpm dev
```
