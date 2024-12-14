import { onchainTable } from "ponder";

export const account = onchainTable("account", (t) => ({
	address: t.hex().primaryKey(),
}));

export const token = onchainTable("token", (t) => ({
	id: t.bigint().primaryKey(),
	owner: t.hex().notNull(),
	token_uri: t.text(),
	metadata: t.json(),
	images: t.json(),
}));

export const transferEvent = onchainTable("transfer_event", (t) => ({
	id: t.text().primaryKey(),
	timestamp: t.integer().notNull(),
	from: t.hex().notNull(),
	to: t.hex().notNull(),
	token: t.bigint().notNull(),
}));
