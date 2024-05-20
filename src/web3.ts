import Web3 from 'web3';
import { contracts } from './contracts';
import { AbiItem } from 'web3-utils';

declare global {
    interface Window {
        ethereum: any;
    }
}

const web3Sepolia = new Web3(`https://eth-sepolia.g.alchemy.com/v2/vM38OKvmEsueB_FEzbTXYmy1qyjSPooN`);
const web3Matic = new Web3(`https://polygon-amoy.g.alchemy.com/v2/koGWWAPz_ocvtqGvcFe1LpjOAZZ3o1GP`);

console.log('Contracts:', contracts);

const getContractInstance = (web3Instance: Web3, abi: AbiItem[], address: string) => {
    return new web3Instance.eth.Contract(abi, address);
};

export const NFTContractSepolia = getContractInstance(web3Sepolia, contracts.sepolia.CreateNft.abi, contracts.sepolia.CreateNft.address);
export const NFTContractMatic = getContractInstance(web3Matic, contracts.amoy.CreateNft.abi, contracts.amoy.CreateNft.address);

export const CommentsContractSepolia = getContractInstance(web3Sepolia, contracts.sepolia.Comments.abi, contracts.sepolia.Comments.address);
export const CommentsContractMatic = getContractInstance(web3Matic, contracts.amoy.Comments.abi, contracts.amoy.Comments.address);

export const EventManagerContractSepolia = getContractInstance(web3Sepolia, contracts.sepolia.EventManager.abi, contracts.sepolia.EventManager.address);
export const EventManagerContractMatic = getContractInstance(web3Matic, contracts.amoy.EventManager.abi, contracts.amoy.EventManager.address);

export const NFTMarketplaceContractSepolia = getContractInstance(web3Sepolia, contracts.sepolia.NFTMarketplace.abi, contracts.sepolia.NFTMarketplace.address);
export const NFTMarketplaceContractMatic = getContractInstance(web3Matic, contracts.amoy.NFTMarketplace.abi, contracts.amoy.NFTMarketplace.address);

export const NFTBidsContractSepolia = getContractInstance(web3Sepolia, contracts.sepolia.NFTBids.abi, contracts.sepolia.NFTBids.address);
export const NFTBidsContractMatic = getContractInstance(web3Matic, contracts.amoy.NFTBids.abi, contracts.amoy.NFTBids.address);

export { web3Sepolia, web3Matic };

