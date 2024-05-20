import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Web3 from 'web3';
import { web3Sepolia, web3Matic, NFTContractSepolia, NFTContractMatic } from '../web3';

type Network = 'sepolia' | 'matic';

interface NetworkContextProps {
  web3: Web3;
  NFTContract: any;
  network: Network;
  switchNetwork: (newNetwork: Network) => void;
}

const NetworkContext = createContext<NetworkContextProps | undefined>(undefined);

export const useNetwork = (): NetworkContextProps => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<Network>('sepolia');
  const [web3, setWeb3] = useState<Web3>(web3Sepolia);
  const [NFTContract, setNFTContract] = useState(NFTContractSepolia);

  useEffect(() => {
    if (network === 'sepolia') {
      setWeb3(web3Sepolia);
      setNFTContract(NFTContractSepolia);
    } else if (network === 'matic') {
      setWeb3(web3Matic);
      setNFTContract(NFTContractMatic);
    }
  }, [network]);

  const switchNetwork = (newNetwork: Network) => {
    setNetwork(newNetwork);
  };

  return (
    <NetworkContext.Provider value={{ web3, NFTContract, network, switchNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};


