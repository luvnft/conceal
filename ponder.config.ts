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
			address: process.env.CONTRACT_ADDRESS as `0xFfad5A63E1Ed90DaC920A11340f9DfBc0ed3d3ee`,
			network: "baseSepolia",
			startBlock: 19169268,
		},
	},
});
