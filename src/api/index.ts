import { ponder } from "ponder:registry";
import { graphql } from "ponder";
import { token } from "ponder:schema";
import { transferEvent } from "../../ponder.schema";
import { eq } from "ponder";

ponder.use("/", graphql());
ponder.use("/graphql", graphql());

ponder.get("/hello", (c) => {
	return c.text("Hello, world!");
});

ponder.get("/transfers", async (c) => {
	const transfers = await c.db.select().from(transferEvent);

	const safeTransfers = transfers.map((transfer) => ({
		...transfer,
		id: String(transfer.id),
		token: String(transfer.token),
		timestamp: Number(transfer.timestamp),
	}));

	return c.json(safeTransfers);
});

ponder.get("/account/:address", async (c) => {
	const address = c.req.param("address");

	const nfts = await c.db.select().from(token).where(eq(token.owner, address));

	const safeNfts = nfts.map((nft) => ({
		...nft,
		id: String(nft.id),
	}));
	return c.json(safeNfts);
});

ponder.get("/nfts", async (c) => {
	const nfts = await c.db.select().from(token);
	const safeNfts = nfts.map((nft) => ({
		...nft,
		id: String(nft.id),
	}));
	return c.json(safeNfts);
});
