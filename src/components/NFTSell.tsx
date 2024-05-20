// src/components/NFTSell.tsx
import React, { useState } from "react";
import { useMetaMask } from "../hooks/useMetamask";
import { useNetwork } from "../hooks/NetworkContext";
import { contracts } from "../contracts";

interface SellNFTProps {
  onSell: () => void;
}

const SellNFT: React.FC<SellNFTProps> = ({ onSell }) => {
  const { web3, accounts } = useMetaMask();
  const { network } = useNetwork();
  const [contractAddress, setContractAddress] = useState<string>("");
  const [tokenId, setTokenId] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const sellNFT = async () => {
    if (!contractAddress || !tokenId || !price) {
      alert("Please enter the contract address, token ID, and price.");
      return;
    }

    if (!web3 || !accounts.length) {
      console.error("Web3 is not initialized or no accounts found");
      return;
    }

    try {
      const priceInWei = web3.utils.toWei(price, "ether");

      // Approve the marketplace to transfer the NFT on your behalf
      const nftContract = new web3.eth.Contract(
        contracts[network].CreateNft.abi,
        contractAddress
      );
      await nftContract.methods
        .approve(contracts[network].NFTMarketplace.address, tokenId)
        .send({ from: accounts[0] });

      // List the NFT for sale
      const marketContract = new web3.eth.Contract(
        contracts[network].NFTMarketplace.abi,
        contracts[network].NFTMarketplace.address
      );
      const gas = await marketContract.methods
        .createOffer(contractAddress, tokenId, priceInWei)
        .estimateGas({ from: accounts[0] });
      await marketContract.methods
        .createOffer(contractAddress, tokenId, priceInWei)
        .send({ from: accounts[0], gas: gas.toString() });

      alert("NFT listed for sale successfully");
      onSell(); // Call the onSell function to refresh the page
    } catch (error) {
      console.error("Error listing NFT for sale:", error);
      alert("Error listing NFT for sale. Please try again.");
    }
  };

  return (
    <div>
      <h2>Sell an NFT</h2>
      <input
        type="text"
        placeholder="Contract Address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder={`Price in ${network === 'sepolia' ? 'ETH' : 'MATIC'}`}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={sellNFT}>List NFT for Sale</button>
    </div>
  );
};

export default SellNFT;















