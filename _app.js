import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <SWRConfig 
        value={{
          fetcher: (url) => fetch(url).then(r => r.json()),
          onError: (err) => {
            console.error(err);
          }
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </SessionProvider>
  );
}

export default MyApp;
