import '../styles/globals.css'
import { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CityDAO Charter</title>
        <meta name="description" content="Read and approve the CityDAO Charter" />
        <link rel="icon" href="/logo.jpeg" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp
