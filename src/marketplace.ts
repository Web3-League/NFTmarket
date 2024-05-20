// src/marketplace.ts
import Web3 from 'web3';

export const createOffer = async (tokenId: number, price: number, from: string, NFTMarketplaceContract: any, web3: Web3) => {
    return await NFTMarketplaceContract.methods.createOffer(tokenId, web3.utils.toWei(price.toString(), "ether")).send({ from });
};

export const cancelOffer = async (tokenId: number, from: string, NFTMarketplaceContract: any) => {
    return await NFTMarketplaceContract.methods.cancelOffer(tokenId).send({ from });
};

export const buyNFT = async (tokenId: number, price: number, from: string, NFTMarketplaceContract: any, web3: Web3) => {
    return await NFTMarketplaceContract.methods.buyNFT(tokenId).send({ from, value: web3.utils.toWei(price.toString(), "ether") });
};

export const getOffer = async (tokenId: number, NFTMarketplaceContract: any) => {
    return await NFTMarketplaceContract.methods.getOffer(tokenId).call();
};

export const getAllOffers = async (NFTMarketplaceContract: any) => {
    const events = await NFTMarketplaceContract.getPastEvents('allEvents', {
        fromBlock: 0,
        toBlock: 'latest'
    });

    const offerEvents = events.filter((event: any) => event.event === 'OfferCreated');
    return offerEvents.map((event: any) => event.returnValues);
};




