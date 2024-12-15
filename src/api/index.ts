import { ponder } from "ponder:registry";
import { graphql, eq } from "ponder";
import { token } from "ponder:schema";

ponder.use("/", graphql());
ponder.use("/graphql", graphql());

ponder.get("/", (c) => {
	return c.text("Hello, world!");
});

ponder.get("/nft", async (c) => {
	const address = c.req.query("address");
	if (address) {
		const nftData = await c.db
			.select()
			.from(token)
			.where(eq(token.owner, address));
		const safeNfts = nftData.map((nft) => ({
			...nft,
			id: String(nft.id),
		}));
		return c.json({ nfts: safeNfts }, 200);
	}
	const nftData = await c.db.select().from(token);
	const safeNfts = nftData.map((nft) => ({
		...nft,
		id: String(nft.id),
	}));
	return c.json({ nfts: safeNfts }, 200);
});

ponder.get("/nft/:id", async (c) => {
	const tokenId = c.req.param("id");
	const nftData = await c.db.select().from(token).where(eq(token.id, tokenId));
	const safeNfts = nftData.map((nft) => ({
		...nft,
		id: String(nft.id),
	}));

	if (safeNfts.length === 0) {
		return c.json({ error: "NFT not Found" }, 400);
	}
	return c.json(nftData[0], 200);
});
