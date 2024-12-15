import { ponder } from "ponder:registry";
import { graphql, eq, desc } from "ponder";
import { token } from "ponder:schema";

ponder.use("/", graphql());
ponder.use("/graphql", graphql());

ponder.get("/", (c) => {
	return c.text("Hello, world!");
});

ponder.get("/nft", async (c) => {
	if (c.req.header("x-api-key") !== process.env.API_KEY) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const address = c.req.query("address");

	if (address) {
		const nftData = await c.db
			.select()
			.from(token)
			.where(eq(token.owner, address))
			.orderBy(desc(token.id));
		const safeNfts = nftData.map((nft) => ({
			...nft,
			id: String(nft.id),
		}));
		return c.json({ nfts: safeNfts }, 200);
	}
	const nftData = await c.db.select().from(token).orderBy(desc(token.id));
	const safeNfts = nftData.map((nft) => ({
		...nft,
		id: String(nft.id),
	}));
	return c.json({ nfts: safeNfts }, 200);
});

ponder.get("/nft/:id", async (c) => {
	if (c.req.header("x-api-key") !== process.env.API_KEY) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const tokenId = c.req.param("id");

	const nftData = await c.db.select().from(token).where(eq(token.id, tokenId));

	const safeNfts = nftData.map((nft) => ({
		...nft,
		id: String(nft.id),
	}));

	if (safeNfts.length === 0) {
		return c.json({ error: "NFT not Found" }, 400);
	}
	return c.json(safeNfts[0], 200);
});
