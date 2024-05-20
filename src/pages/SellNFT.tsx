// src/pages/sellNFT.tsx
import React, { useEffect, useState } from 'react';
import { createOffer, cancelOffer, buyNFT } from '../marketplace';
import { web3Sepolia, web3Matic, NFTMarketplaceContractSepolia, NFTMarketplaceContractMatic } from '../web3';

const SellNFT: React.FC = () => {
  const [account, setAccount] = useState<string>("");
  const [tokenId, setTokenId] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [network, setNetwork] = useState<'sepolia' | 'matic'>('sepolia');

  const web3 = network === 'sepolia' ? web3Sepolia : web3Matic;
  const NFTMarketplaceContract = network === 'sepolia' ? NFTMarketplaceContractSepolia : NFTMarketplaceContractMatic;

  useEffect(() => {
    const loadAccount = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    loadAccount();
  }, [network, web3]);

  const handleCreateOffer = async () => {
    if (!tokenId || !price) {
      alert("Veuillez entrer un ID de token et un prix.");
      return;
    }

    try {
      await createOffer(Number(tokenId), Number(price), account, NFTMarketplaceContract, web3);
      alert("Offre créée avec succès!");
    } catch (error) {
      console.error("Erreur lors de la création de l'offre:", error);
      alert("Erreur lors de la création de l'offre. Vérifiez la console pour plus de détails.");
    }
  };

  return (
    <div>
      <h1>Enregistrer un NFT à la vente</h1>
      <p>Compte connecté: {account}</p>
      <div>
        <label htmlFor="network-select">Sélectionner le réseau:</label>
        <select
          id="network-select"
          value={network}
          onChange={e => setNetwork(e.target.value as 'sepolia' | 'matic')}
        >
          <option value="sepolia">Sepolia</option>
          <option value="matic">Matic</option>
        </select>
      </div>
      <div>
        <input
          type="text"
          placeholder="ID de Token"
          value={tokenId}
          onChange={e => setTokenId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Prix (en ETH)"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <button onClick={handleCreateOffer}>Créer une offre</button>
      </div>
    </div>
  );
};

export default SellNFT;

