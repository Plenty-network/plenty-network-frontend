import type { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { Meta } from '../src/components/Meta';
import { store } from '../src/redux/index';
import '../styles/globals.css';

let persistor = persistStore(store);

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(new QueryClient());
  return (
    <>
    <Meta/>
    <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
    </QueryClientProvider>
    </>
  );
}

export default MyApp;
