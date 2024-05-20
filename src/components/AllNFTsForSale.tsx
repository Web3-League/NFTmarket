// src/components/AllNFTsForSale.tsx
import React, { useEffect, useState } from 'react';
import { useMetaMask } from '../hooks/useMetamask';
import { contracts } from '../contracts';
import Web3 from 'web3';
import BuyNFT from './BuyNFT';
import { Network } from '../hooks/NetworkContext'; // Assuming this is correctly exported now

interface Offer {
  tokenId: string;
  seller: string;
  price: string;
  nftContract: string;
  network: Network;
}

const AllNFTsForSale: React.FC = () => {
  const { web3 } = useMetaMask();
  const [offers, setOffers] = useState<Offer[]>([]);

  const fetchOffers = async (web3Instance: Web3, network: Network) => {
    try {
      const marketContract = new web3Instance.eth.Contract(
        contracts[network].NFTMarketplace.abi,
        contracts[network].NFTMarketplace.address
      );

      const fetchedOffers = await marketContract.methods.getOffers().call();
      console.log(`Fetched offers from ${network}:`, fetchedOffers);

      if (Array.isArray(fetchedOffers)) {
        return fetchedOffers.map((offer: any) => ({
          tokenId: offer.tokenId.toString(),
          seller: offer.seller,
          price: web3Instance.utils.fromWei(offer.price.toString(), 'ether'),
          nftContract: offer.nftContract,
          network,
        }));
      } else {
        console.error(`Fetched offers from ${network} is not an array:`, fetchedOffers);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching offers from ${network}:`, error);
      return [];
    }
  };

  const handleBuy = async () => {
    if (!web3) return;

    const sepoliaProvider = new Web3.providers.HttpProvider('https://rpc.sepolia.org');
    const sepoliaWeb3 = new Web3(sepoliaProvider);
    const sepoliaOffers = await fetchOffers(sepoliaWeb3, 'sepolia');

    const amoyProvider = new Web3.providers.HttpProvider('https://rpc-amoy.polygon.technology/');
    const amoyWeb3 = new Web3(amoyProvider);
    const amoyOffers = await fetchOffers(amoyWeb3, 'amoy');

    setOffers([...sepoliaOffers, ...amoyOffers]);
  };

  useEffect(() => {
    handleBuy();
  }, [web3]);

  return (
    <div>
      <h2>NFTs for Sale</h2>
      <ul>
        {offers.map((offer, index) => (
          <li key={index}>
            <p>Token ID: {offer.tokenId}</p>
            <p>Seller: {offer.seller}</p>
            <p>Price: {offer.price} {offer.network === 'sepolia' ? 'ETH' : 'MATIC'}</p>
            <p>NFT Contract: {offer.nftContract}</p>
            <p>Network: {offer.network}</p>
            <BuyNFT
              tokenId={offer.tokenId}
              price={offer.price}
              nftContract={offer.nftContract}
              network={offer.network}
              onBuy={handleBuy}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllNFTsForSale;





