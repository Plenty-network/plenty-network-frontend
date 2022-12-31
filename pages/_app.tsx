import type { AppProps } from "next/app";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(new QueryClient());

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-MZEH85SJMJ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-MZEH85SJMJ');
        `}
      </Script>

      <QueryClientProvider client={queryClient}>
        {/* Wrapping all the pages and components with Wagami Config and RainbowKit provider for using wallets across the app.
                Configured wagami client, chains and theme are passed here.
             */}

        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
