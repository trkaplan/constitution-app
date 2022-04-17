import { useState } from 'react';
import { NextPage } from 'next'
import { Iframe } from '../components/Iframe'
const IPFS_HASH = 'QmbAV7dZithaG4Fr85yNZUEebF26tmxcNrDKv948kPXUKM';
const CHARTER_IPFS_URL= `https://ipfs.io/ipfs/${IPFS_HASH}`;

const Home: NextPage = () => {
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);

  const handleLoad = () => {
    setIsIframeLoaded(true);
  }

  return (
    <main>
      <h1 className="text-center">
        <span className="color-primary">CityDAO</span> Charter
      </h1>
      <p className="text-center mt-1">
        Here you can read the CityDAO charter. If you hold Citizen NFTs you can vote to ratify the charter on <a href="https://snapshot.org/#/daocity.eth/proposal/0xc6596e12ae6391d81d73cbeee16254ebe9592fb2c47ba9bd1c2dd2861ed3c70b" target="_blank" rel="noreferrer">Snapshot</a>.
      </p>
      <p>
      <form className="vote-form" action="https://snapshot.org/#/daocity.eth/proposal/0xc6596e12ae6391d81d73cbeee16254ebe9592fb2c47ba9bd1c2dd2861ed3c70b">
        <button type="submit">Vote on Snapshot</button>
      </form>
      </p>
      <section className="charter-container">
        {!isIframeLoaded && <b className="loader-bar">Loading...</b>}
        <Iframe
          width="100%"
          height="100%"
          url={CHARTER_IPFS_URL}
          onLoad={handleLoad}
        />
      </section>
      <section className="text-center">
        <p className="opacity-50">
          This charter is stored forever on <a target="_blank" href={`https://ipfs.io/ipfs/${IPFS_HASH}`} rel="noreferrer">IPFS</a>
        </p>
        <a target="_blank" href={`https://ipfs.io/ipfs/${IPFS_HASH}`} className="text-sm text-italic opacity-50" rel="noreferrer">
          IPFS hash: {IPFS_HASH}
        </a>
      </section>

    </main>
  )
}

export default Home
