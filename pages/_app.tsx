import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { Provider } from 'react-redux';
import { store } from '../src/redux/index';

function MyApp({ Component, pageProps }: AppProps) {
  if (typeof window === 'undefined') {
    return (
      <Provider store={store}>
        <></>
      </Provider>
    );
  }
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
