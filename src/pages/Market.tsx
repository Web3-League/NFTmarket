// src/pages/Market.tsx
import React, { useEffect, useState } from 'react';
import { createOffer, getAllOffers, buyNFT, cancelOffer } from '../marketplace';
import { web3Sepolia, web3Matic, NFTMarketplaceContractSepolia, NFTMarketplaceContractMatic } from '../web3';

interface Offer {
    tokenId: number;
    seller: string;
    price: string; // Price in wei
}

const Market: React.FC = () => {
    const [account, setAccount] = useState<string>("");
    const [offers, setOffers] = useState<Offer[]>([]);
    const [tokenId, setTokenId] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [network, setNetwork] = useState<'sepolia' | 'matic'>('sepolia');

    const web3 = 'sepolia' ? web3Sepolia : web3Matic;
    const NFTMarketplaceContract = 'sepolia' ? NFTMarketplaceContractSepolia : NFTMarketplaceContractMatic;

    useEffect(() => {
        const loadBlockchainData = async () => {
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
            const fetchedOffers = await getAllOffers(NFTMarketplaceContract);
            setOffers(fetchedOffers);
        };

        loadBlockchainData();
    }, [NFTMarketplaceContract, web3.eth]);

    const handleCreateOffer = async () => {
        if (tokenId && price) {
            await createOffer(Number(tokenId), Number(price), account, NFTMarketplaceContract, web3);
            const fetchedOffers = await getAllOffers(NFTMarketplaceContract);
            setOffers(fetchedOffers);
        }
    };

    const handleBuyNFT = async (tokenId: number, price: string) => {
        await buyNFT(tokenId, Number(web3.utils.fromWei(price, "ether")), account, NFTMarketplaceContract, web3);
        const fetchedOffers = await getAllOffers(NFTMarketplaceContract);
        setOffers(fetchedOffers);
    };

    const handleCancelOffer = async (tokenId: number) => {
        await cancelOffer(tokenId, account, NFTMarketplaceContract);
        const fetchedOffers = await getAllOffers(NFTMarketplaceContract);
        setOffers(fetchedOffers);
    };

    return (
        <div>
            <h1>Market</h1>
            <h2>Create Offer</h2>
            <div>
                <input 
                    type="text" 
                    placeholder="Token ID" 
                    value={tokenId} 
                    onChange={e => setTokenId(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Price (ETH)" 
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                />
                <button onClick={handleCreateOffer}>Create Offer</button>
            </div>
            <h2>Offers</h2>
            <ul>
                {offers.map((offer, index) => (
                    <li key={index}>
                        <p><strong>Token ID:</strong> {offer.tokenId}</p>
                        <p><strong>Seller:</strong> {offer.seller}</p>
                        <p><strong>Price:</strong> {web3.utils.fromWei(offer.price, "ether")} ETH</p>
                        <button onClick={() => handleBuyNFT(offer.tokenId, offer.price)}>Buy</button>
                        {offer.seller === account && (
                            <button onClick={() => handleCancelOffer(offer.tokenId)}>Cancel Offer</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Market;
