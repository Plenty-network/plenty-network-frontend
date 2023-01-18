import Head from "next/head";
import * as React from "react";

export function MetaAirdrop() {
  return (
    <Head>
      <title>Plenty | Decentralized trading on Tezos</title>
      <meta
        content="Plenty is a decentralized exchange on the Tezos blockchain that allows users to trade and earn additional income through voting, staking, and providing liquidity. The platform offers both stable and volatile liquidity pools and a bridge from Ethereum and Polygon to Tezos."
        name="description"
      />
      <meta content="Plenty | Decentralized trading on Tezos" property="og:title" />
      <meta
        content="Plenty is a decentralized exchange on the Tezos blockchain that allows users to trade and earn additional income through voting, staking, and providing liquidity. The platform offers both stable and volatile liquidity pools and a bridge from Ethereum and Polygon to Tezos."
        property="og:description"
      />
      <meta content="/assets/airdropOG.png" property="og:image" />
      <meta content="Plenty | Decentralized trading on Tezos" property="twitter:title" />
      <meta
        content="Plenty is a decentralized exchange on the Tezos blockchain that allows users to trade and earn additional income through voting, staking, and providing liquidity. The platform offers both stable and volatile liquidity pools and a bridge from Ethereum and Polygon to Tezos."
        property="twitter:description"
      />
      <meta content="/assets/airdropOG.png" property="twitter:image" />
      <meta property="og:type" content="website" />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link
        href="https://uploads-ssl.webflow.com/6307b856943c0f1358714dab/6324cdd14e4daa665e7eddfc_fav-icon_32%20(1).png"
        rel="shortcut icon"
        type="image/x-icon"
      />
      <link
        href="https://uploads-ssl.webflow.com/6307b856943c0f1358714dab/6324cdc06009f1225eaf74c3_fav-icon_256%20(1).png"
        rel="apple-touch-icon"
      />
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>
  );
}
