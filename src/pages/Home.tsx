// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import { useMetaMask } from "../hooks/useMetamask";
import { useNetwork } from "../hooks/NetworkContext";
import MintNFT from "../components/MintNFT";
import ImportNFT from "../components/ImportNFT";
import NetworkSwitcher from "../components/NetworkSwitcher";

interface TokenDetails {
  id: string;
  uri: string;
  contractAddress: string;
}

const Home: React.FC = () => {
  const { web3, accounts } = useMetaMask();
  const { network, NFTContract } = useNetwork();
  const [totalSupply, setTotalSupply] = useState<number | null>(null);
  const [tokens, setTokens] = useState<TokenDetails[]>([]);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (web3 && accounts.length > 0) {
        const account = accounts[0];
        try {
          console.log("Compte connecté:", account);

          const supply = await NFTContract.methods.totalSupply().call();
          console.log("Nombre total de NFT:", supply);
          setTotalSupply(Number(supply));

          const balance = await NFTContract.methods.balanceOf(account).call();
          console.log("Balance:", balance);

          const tokenDetails: TokenDetails[] = [];
          for (let i = 0; i < balance; i++) {
            const id = await NFTContract.methods.tokenOfOwnerByIndex(account, i).call();
            console.log(`Token ID récupéré: ${id}`);
            const uri = await NFTContract.methods.tokenURI(id).call();
            console.log(`Token URI récupéré: ${uri}`);
            const contractAddress = NFTContract.options.address || "Address not found";
            tokenDetails.push({ id: id.toString(), uri, contractAddress });
          }
          setTokens(tokenDetails);
        } catch (error) {
          console.error("Erreur lors du chargement des données blockchain:", error);
        }
      } else {
        console.error('MetaMask non détecté ou aucun compte trouvé');
      }
    };

    setTokens([]);
    loadBlockchainData();
  }, [web3, accounts, network, NFTContract]);

  const addToken = (newToken: { id: string; uri: string; contractAddress: string }) => {
    setTokens([...tokens, newToken]);
  };

  return (
    <div>
      <h1>Bienvenue sur la page d'accueil de votre DApp</h1>
      <p>Compte connecté: {accounts[0]}</p>
      <p>Nombre total de NFT: {totalSupply}</p>
      <p>Nombre de NFT possédés: {tokens.length}</p>
      <ul>
        {tokens.map((token) => (
          <li key={token.id}>
            <p><strong>NFT ID:</strong> {token.id}</p>
            <p><strong>Contract Address:</strong> {token.contractAddress}</p>
            <p><strong>URI:</strong> <a href={token.uri} target="_blank" rel="noopener noreferrer">{token.uri}</a></p>
          </li>
        ))}
      </ul>
      <MintNFT onMint={addToken} />
      <ImportNFT onImport={addToken} />
      <NetworkSwitcher />
    </div>
  );
};

export default Home;




