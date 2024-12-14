import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

export const publicClient = createPublicClient({
	chain: baseSepolia,
	transport: http(process.env.PONDER_RPC_URL_84532),
});
