// src/pages/ManageOffers.tsx
import React, { useEffect, useState } from "react";
import { web3Sepolia, web3Matic, NFTMarketplaceContractSepolia, NFTMarketplaceContractMatic } from "../web3";
import { getAllOffers, cancelOffer } from "../marketplace";

const ManageOffers: React.FC = () => {
    const [account, setAccount] = useState<string>("");
    const [offers, setOffers] = useState<any[]>([]);
    const [network, setNetwork] = useState<'sepolia' | 'matic'>('sepolia');

    const web3 = network === 'sepolia' ? web3Sepolia : web3Matic;
    const NFTMarketplaceContract = network === 'sepolia' ? NFTMarketplaceContractSepolia : NFTMarketplaceContractMatic;

    useEffect(() => {
        const loadOffers = async () => {
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
            console.log("Connected account:", accounts[0]);

            const allOffers = await getAllOffers(NFTMarketplaceContract);
            const userOffers = allOffers.filter((offer: any) => offer.seller === accounts[0]);
            setOffers(userOffers);
        };

        loadOffers();
    }, [NFTMarketplaceContract, network, web3]);

    const handleCancelOffer = async (tokenId: number) => {
        try {
            await cancelOffer(tokenId, account, NFTMarketplaceContract);
            alert("Offer canceled successfully!");
            setOffers(offers.filter((offer: any) => offer.tokenId !== tokenId));
        } catch (error) {
            console.error("Error canceling offer:", error);
            alert("Error canceling offer. Check the console for more details.");
        }
    };

    return (
        <div>
            <h1>Manage Offers</h1>
            <p>Connected account: {account}</p>
            <div>
                <label htmlFor="network-select">Select Network:</label>
                <select
                    id="network-select"
                    value={network}
                    onChange={e => setNetwork(e.target.value as 'sepolia' | 'matic')}
                >
                    <option value="sepolia">Sepolia</option>
                    <option value="matic">Matic</option>
                </select>
            </div>
            <ul>
                {offers.map((offer, index) => (
                    <li key={index}>
                        <p><strong>Token ID:</strong> {offer.tokenId}</p>
                        <p><strong>Seller:</strong> {offer.seller}</p>
                        <p><strong>Price:</strong> {web3.utils.fromWei(offer.price, "ether")} ETH</p>
                        <button onClick={() => handleCancelOffer(offer.tokenId)}>Cancel Offer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageOffers;

