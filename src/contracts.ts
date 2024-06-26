// src/contracts.ts
import CreateNftAbi from './abis/CreateNft.json';
import CommentsAbi from './abis/Comments.json';
import EventManagerAbi from './abis/EventManager.json';
import NFTMarketplaceAbi from './abis/NFTMarketplace.json';
import NFTBidsAbi from './abis/NFTBids.json';
import NFTWithRoyaltiesAbi from './abis/NFTWithRoyalties.json';
import { AbiItem } from 'web3-utils';

interface ContractConfig {
    address: string;
    abi: AbiItem[];
}

export const contracts: { [key: string]: { [key: string]: ContractConfig } } = {
    sepolia: {
        CreateNft: {
            address: "0xAA5599B921485b6c1a5657FB73a75A6EC2C87E62",
            abi: CreateNftAbi.abi as AbiItem[]
        },
        Comments: {
            address: "0xddB180F6b0808e44C82636518e3251121FAbF7FA",
            abi: CommentsAbi.abi as AbiItem[]
        },
        EventManager: {
            address: "0x76Ea7Fd0F68cb8A137aEBD6730907F5DeCc199F8",
            abi: EventManagerAbi.abi as AbiItem[]
        },
        NFTMarketplace: {
            address: "0x53Fdf651943a91C82a66D1b88f9287867401f723",
            abi: NFTMarketplaceAbi.abi as AbiItem[]
        },
        NFTBids: {
            address: "0xe3312D9Ca4C5EFC28f99Fce8E757a68E4da2e177",
            abi: NFTBidsAbi.abi as AbiItem[]
        },
        NFTWithRoyalties: {
            address: "0x1E2397aF297d9C96123Dd983d5921c29bba15577",  // Adresse manquante à ajouter
            abi: NFTWithRoyaltiesAbi.abi as AbiItem[]
        }
    },
    amoy: {
        CreateNft: {
            address: "0xBb11a1a4e10D62D6eBAE575524bbDCE01F9EEd2C",
            abi: CreateNftAbi.abi as AbiItem[]
        },
        Comments: {
            address: "0x855045c497c08efaf2a6E4FFbeB3D005C6A78C37",
            abi: CommentsAbi.abi as AbiItem[]
        },
        EventManager: {
            address: "0xc3d425Cc523588B4834e5AaEE08BdCB4701f76eD",
            abi: EventManagerAbi.abi as AbiItem[]
        },
        NFTMarketplace: {
            address: "0x5601d6D2b8bb6134060378280eACA7863019f2D8",
            abi: NFTMarketplaceAbi.abi as AbiItem[]
        },
        NFTBids: {
            address: "0xfa531778f105AE4C495dF5FD4ee932117FBd034b",
            abi: NFTBidsAbi.abi as AbiItem[]
        },
        NFTWithRoyalties: {
            address: "0xf477870d8bD2EF1f0460b0C2d34bc1cD10e424aD",
            abi: NFTWithRoyaltiesAbi.abi as AbiItem[]
        }
    }
};



