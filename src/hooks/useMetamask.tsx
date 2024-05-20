// src/hooks/useMetamask.ts
import { useState, useEffect, createContext, useContext } from 'react';
import Web3 from 'web3';

interface MetaMaskContextProps {
  web3: Web3 | null;
  accounts: string[];
  connect: () => Promise<void>;
}

const MetaMaskContext = createContext<MetaMaskContextProps | undefined>(undefined);

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext);
  if (!context) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider');
  }
  return context;
};

export const MetaMaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);

  const connect = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccounts(accounts);
      } catch (error) {
        console.error('User denied account access', error);
      }
    } else {
      console.error('No Ethereum provider detected. Install MetaMask.');
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccounts(accounts);
      } else {
        console.error('No Ethereum provider detected. Install MetaMask.');
      }
    };
    initialize();
  }, []);

  return (
    <MetaMaskContext.Provider value={{ web3, accounts, connect }}>
      {children}
    </MetaMaskContext.Provider>
  );
};

