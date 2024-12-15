import { createConfig } from "ponder";
import { http } from "viem";

import { ConcealmintAbi } from "./abis/ConcealmintAbi";

export default createConfig({
	networks: {
		baseSepolia: {
			chainId: 84532,
			transport: http(process.env.PONDER_RPC_URL_84532),
			pollingInterval: 2_000,
			maxRequestsPerSecond: 100,
		},
	},
	contracts: {
		Concealmint: {
			abi: ConcealmintAbi,
			address: "0x9B046Ca68dD4c7F7fC36A98DEdecf01C8EE904f7",
			network: "baseSepolia",
			startBlock: 19169268,
		},
	},
});
