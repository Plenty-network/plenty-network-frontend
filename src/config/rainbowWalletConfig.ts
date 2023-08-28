import { getDefaultWallets, Chain } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";
import { configureChains, createConfig } from "wagmi";
import { mainnet, polygon, bsc, optimism } from "wagmi/chains";

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
  {
    ...bsc,
    iconUrl: "/assets/chains/bsc.svg",
  },
  {
    ...optimism,
    iconUrl: "/assets/chains/optimism.svg",
  },
];

/* Configure chains and providers(alchemy, infura, public or jsonRpc) [currently using public providers] */
const { chains, publicClient } = configureChains(defaultChains, [publicProvider()]);

/* Configure wallets [currently using default wallets from RaibowKit] */
const { connectors } = getDefaultWallets({
  appName: "plenty.network",
  projectId: "e14efa7f19ceec22c3d80a562273e30c",
  chains,
});

/* Create the wagami client with all config(chain, connectors and providers) */
export const wagmiClient = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
export { chains };
