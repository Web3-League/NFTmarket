// src/components/NFTCard.tsx
import React from "react";

interface NFTCardProps {
  contractAddress: string;
  tokenId: string;
  price: string;
  onBuy: (contractAddress: string, tokenId: string, price: string) => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ contractAddress, tokenId, price, onBuy }) => {
  const handleBuy = () => {
    onBuy(contractAddress, tokenId, price);
  };

  return (
    <li>
      <p><strong>Contract Address:</strong> {contractAddress}</p>
      <p><strong>Token ID:</strong> {tokenId}</p>
      <p><strong>Prix:</strong> {price} ETH</p>
      <button onClick={handleBuy}>Acheter</button>
    </li>
  );
};

export default NFTCard;





