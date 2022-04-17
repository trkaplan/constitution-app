import { useMemo, useState, useEffect, useCallback, ReactNode, FC } from 'react';
import { NextPage } from 'next'
import { ethers } from 'ethers'
import { Iframe } from '../components/Iframe'
const IPFS_HASH = 'QmbAV7dZithaG4Fr85yNZUEebF26tmxcNrDKv948kPXUKM';
const CITIZEN_NFT_CONTRACT_ADDRESS = '0x7eef591a6cc0403b9652e98e88476fe1bf31ddeb';
const CITIZEN_NFT_IDS = [7, 42, 69];
const GITHUB_APPROVALS_URL = 'https://github.com/davidfant/constitution-approvals';
const CHARTER_IPFS_URL= `https://ipfs.io/ipfs/${IPFS_HASH}`;

interface StepProps {
  index: number;
  label: ReactNode;
  cta?: string;
  active: boolean;
  enabled?: boolean;
  onClick?(): void;
}

const Step: FC<StepProps> = ({index, label, cta, active, enabled, onClick}) => {
  return (
    <div className={`step ${active ? 'step-active' : ''}`}>
      <span className="step-index">{index + 1}</span>
      {typeof label === 'string' ? <p className="step-content">{label}</p> : <div className="step-content">{label}</div>}
      <div className="step-cta">
        {active && enabled && <button onClick={onClick}>{cta}</button>}
      </div>
    </div>
  );
}

const Home: NextPage = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [address, setAddress] = useState<string>(); 
  const [nftCount, setNftCount] = useState<number>();
  const [approvalUrl, setApprovalUrl] = useState<string>();
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);

  const handleLoad = () => {
    setIsIframeLoaded(true);
  }
  const provider = useMemo(
    () =>
      typeof window !== 'undefined'
      ? new ethers.providers.Web3Provider((window as any).ethereum, 'mainnet')
      : undefined,
    []);
  const citizenContract = useMemo(() => new ethers.Contract(
    CITIZEN_NFT_CONTRACT_ADDRESS,
    require('./contract.json').abi,
    provider,
  ), [provider]);

  const connectWallet = useCallback(async () => {
    if (!provider) return;
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    if (!address) return;
    
    const balances = await citizenContract.balanceOfBatch(
      CITIZEN_NFT_IDS.map(() => address),
      CITIZEN_NFT_IDS,
    );
    const count = balances.map(Number).reduce((a: number, b: number) => a + b, 0);

    setNftCount(count);
    setAddress(address);
    setStepIndex(1);
  }, [citizenContract, provider]);

  const submitSignature = useCallback(async (payload: any, signature: string) => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify({payload, signature, address}),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json());
    setApprovalUrl(response.url);
    setStepIndex(3);
  }, [address]);

  const ratifyCharter = useCallback(async () => {
    if (!provider) return;
    const payload = {
      message: 'I ratify the CityDAO charter',
      ipfsHash: IPFS_HASH,
    };

    const signature = await provider.send(
      'personal_sign',
      [address, JSON.stringify(payload)],
    );

    setStepIndex(2);
    submitSignature(payload, signature);
  }, [address, submitSignature, provider]);

  return (
    <main>
      <h1 className="text-center">
        <span className="color-primary">CityDAO</span> Charter
      </h1>
      <p className="text-center mt-1">
        Here you can read the CityDAO charter. If you hold Citizen NFTs you can vote to ratify the charter at the bottom of the page. All ratifications are stored on <a href={GITHUB_APPROVALS_URL} target="_blank" rel="noreferrer">our repo on Github</a>.
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


      <div className="steps-container">
        <Step
          index={0}
          label="Connect wallet with Citizen NFTs"
          cta="Metamask"
          enabled
          active={stepIndex === 0}
          onClick={connectWallet}
        />
        <Step
          index={1}
          label={(
            <div>
              <p>
                Ratify the CityDAO Charter (Citizen NFTs needed)
              </p>
              <p className="text-sm text-italic opacity-50">
                When ratifying the charter, you will sign a message with the charter IPFS hash, and the message signature will be stored in <a href={GITHUB_APPROVALS_URL}
                target="_blank" rel="noreferrer">this Github project</a>
              </p>
            </div>
          )}
          cta={`Ratify (${nftCount} ${nftCount === 1 ? 'NFT' : 'NFTs'})`}
          enabled={!!nftCount}
          active={stepIndex === 1}
          onClick={ratifyCharter}
        />
        <Step
          index={2}
          label={stepIndex === 2 ? 'Submitting vote...' : 'Submit vote'}
          active={stepIndex === 2}
        />
        <Step
          index={3}
          label={(
            <div>
              <p>
                Done
              </p>
              {!!approvalUrl && (
                <p className="text-sm text-italic opacity-50">
                  See your ratification and signature <a href={approvalUrl} target="_blank" rel="noreferrer">here</a>
                </p>
              )}
            </div>
          )}
          active={stepIndex === 3}
        />
      </div>
    </main>
  )
}

export default Home
