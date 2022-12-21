import { getDefaultWallets, Chain } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";
import { configureChains, createClient } from "wagmi";
import { mainnet, polygon } from 'wagmi/chains';

/* Add supported chains along with custon icons(should be served from public folder) */
export const defaultChains: Chain[] = [
  {
    ...mainnet,
    iconUrl: "/assets/chains/ethereum.svg",
  },
  {
    ...polygon,
    iconUrl: "/assets/chains/polygon.svg",
  },
];

/* Configure chains and providers(alchemy, infura, public or jsonRpc) [currently using public providers] */
const { chains, provider } = configureChains(defaultChains, [publicProvider()]);

/* Configure wallets [currently using default wallets from RaibowKit] */
const { connectors } = getDefaultWallets({
  appName: "plenty.network",
  chains,
});

/* Create the wagami client with all config(chain, connectors and providers) */
export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
export { chains };
