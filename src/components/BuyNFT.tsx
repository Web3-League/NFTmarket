// src/components/BuyNFT.tsx
import React from 'react';
import { useMetaMask } from '../hooks/useMetamask';
import { useNetwork, Network } from '../hooks/NetworkContext';
import { contracts } from '../contracts';

interface BuyNFTProps {
  tokenId: string;
  price: string;
  nftContract: string;
  network: Network;
  onBuy: () => void; // Callback function to refresh the list after purchase
}

const BuyNFT: React.FC<BuyNFTProps> = ({ tokenId, price, nftContract, network, onBuy }) => {
  const { web3, accounts } = useMetaMask();
  const { switchNetwork } = useNetwork();

  const buyNFT = async () => {
    if (!web3 || !accounts.length) {
      console.error("Web3 is not initialized or no accounts found");
      return;
    }

    try {
      // Switch to the correct network
      await switchNetwork(network);

      const priceInWei = web3.utils.toWei(price, 'ether');

      // Interact with the marketplace contract
      const marketContract = new web3.eth.Contract(
        contracts[network].NFTMarketplace.abi,
        contracts[network].NFTMarketplace.address
      );

      await marketContract.methods
        .buyNFT(tokenId, nftContract)
        .send({ from: accounts[0], value: priceInWei });

      alert("NFT purchased successfully");
      onBuy(); // Call the onBuy function to refresh the list
    } catch (error) {
      console.error("Error purchasing NFT:", error);
      alert("Error purchasing NFT. Please try again.");
    }
  };

  return (
    <div>
      <button onClick={buyNFT}>Buy</button>
    </div>
  );
};

export default BuyNFT;
















