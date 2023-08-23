import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { chains, wagmiClient } from "../src/config/rainbowWalletConfig";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Meta } from "../src/components/Meta";
import { store } from "../src/redux/index";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Script from "next/script";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { customTheme } from "../src/config/rainbowWalletTheme";
import { useRouter } from "next/router";
import { MetaAirdrop } from "../src/components/Meta/MetaAirdrop";
import { firebase } from "../src/config/firebaseConfig";
import { getAnalytics, logEvent, Analytics, setCurrentScreen } from "firebase/analytics";

let persistor = persistStore(store);

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(new QueryClient());
  const router = useRouter();

  useEffect(() => {
    const analytics = getAnalytics(firebase);

    if (process.env.NODE_ENV === "production") {
      const logEvents = (url: string) => {
        logEvent(analytics, "screen_view");
        logEvent(analytics, "page_view", { page_path: url, page_title: url });
      };

      router.events.on("routeChangeComplete", logEvents);
      logEvents(window.location.pathname);

      return () => {
        router.events.off("routeChangeComplete", logEvents);
      };
    }
  }, []);
  return (
    <>
      {/* <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-820H15VVZM"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-820H15VVZM');
        `}
      </Script> */}
      {router.pathname.includes("airdrop") ? <MetaAirdrop /> : <Meta />}
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {/* Wrapping all the pages and components with Wagami Config and RainbowKit provider for using wallets across the app.
                Configured wagami client, chains and theme are passed here.
             */}
            <WagmiConfig config={wagmiClient}>
              <RainbowKitProvider chains={chains} modalSize="compact" theme={customTheme}>
                <Component {...pageProps} />
              </RainbowKitProvider>
            </WagmiConfig>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
