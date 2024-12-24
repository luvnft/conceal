import { ponder } from "ponder:registry";
import schema from "ponder:schema";
import { publicClient } from "../utils/viem";
import { ConcealmintAbi } from "../abis/ConcealmintAbi";
import { pinata } from "../utils/pinata";
import type { NFT } from "../utils/types";

const fetchTokenURI = async (tokenId: number) => {
	try {
		const tokenURI = await publicClient.readContract({
			address: process.env.CONTRACT_ADDRESS as `0x`,
			abi: ConcealmintAbi,
			functionName: "tokenURI",
			args: [tokenId],
		});
		return tokenURI;
	} catch (error) {
		console.error("Error fetching token URI:", error);
		return null;
	}
};

const fetchNFTData = async (tokenURI: string) => {
	try {
		const { data: nftData } = await pinata.gateways.get(tokenURI);
		return nftData as NFT;
	} catch (error) {
		console.error("Error fetching NFT data from Pinata:", error);
		return null;
	}
};

const fetchBaseImageURL = async (image: string) => {
	try {
		const baseImageURL = await pinata.gateways.convert(image);
		return baseImageURL;
	} catch (error) {
		console.error("Error fetching image URL:", error);
		return null;
	}
};

ponder.on("Concealmint:MetadataUpdate", async ({ event, context }) => {
	const tokenId = event.args._tokenId;

	const tokenURI = await fetchTokenURI(tokenId);
	if (!tokenURI) return; // Early exit if tokenURI fetch fails

	const nft = await fetchNFTData(tokenURI as string);
	if (!nft) return; // Early exit if NFT data fetch fails

	const baseImageURL = await fetchBaseImageURL(nft.image);
	if (!baseImageURL) return; // Early exit if image URL fetch fails

	// Create or update a Token.
	await context.db
		.insert(schema.token)
		.values({
			id: tokenId,
			token_uri: tokenURI,
			metadata: {
				name: nft.name,
				description: nft.description,
				external_url: nft.external_url,
				image: nft.image,
				file: nft.file,
			},
			images: {
				original: baseImageURL,
				thumbnail: `${baseImageURL}?img-width=200`,
				sm: `${baseImageURL}?img-width=400`,
				md: `${baseImageURL}?img-width=800`,
				lg: `${baseImageURL}?img-width=1200`,
			},
		})
		.onConflictDoUpdate({
			token_uri: tokenURI,
			metadata: {
				name: nft.name,
				description: nft.description,
				external_url: nft.external_url,
				image: nft.image,
				file: nft.file,
			},
			images: {
				original: baseImageURL,
				thumbnail: `${baseImageURL}?img-width=200`,
				sm: `${baseImageURL}?img-width=400`,
				md: `${baseImageURL}?img-width=800`,
				lg: `${baseImageURL}?img-width=1200`,
			},
		});
});

ponder.on("Concealmint:Transfer", async ({ event, context }) => {
	// Create an Account for the sender, or update the balance if it already exists.
	await context.db
		.insert(schema.account)
		.values({ address: event.args.from })
		.onConflictDoNothing();
	// Create an Account for the recipient, or update the balance if it already exists.
	await context.db
		.insert(schema.account)
		.values({ address: event.args.to })
		.onConflictDoNothing();

	const tokenURI = await fetchTokenURI(event.args.tokenId);
	if (!tokenURI) return; // Early exit if tokenURI fetch fails

	const nft = await fetchNFTData(tokenURI as string);
	if (!nft) return; // Early exit if NFT data fetch fails

	const baseImageURL = await fetchBaseImageURL(nft.image);
	if (!baseImageURL) return; // Early exit if image URL fetch fails

	// Create or update a Token.
	await context.db
		.insert(schema.token)
		.values({
			id: event.args.tokenId,
			owner: event.args.to,
			token_uri: tokenURI,
			metadata: {
				name: nft.name,
				description: nft.description,
				external_url: nft.external_url,
				image: nft.image,
				file: nft.file,
			},
			images: {
				original: baseImageURL,
				thumbnail: `${baseImageURL}?img-width=200`,
				sm: `${baseImageURL}?img-width=400`,
				md: `${baseImageURL}?img-width=800`,
				lg: `${baseImageURL}?img-width=1200`,
			},
		})
		.onConflictDoUpdate({ owner: event.args.to });

	// Create a TransferEvent.
	await context.db.insert(schema.transferEvent).values({
		id: event.log.id,
		from: event.args.from,
		to: event.args.to,
		token: event.args.tokenId,
		timestamp: Number(event.block.timestamp),
	});
});
