// src/components/MetaMaskConnect.tsx
import React, { useState, useEffect } from 'react';
import { useMetaMask } from '../hooks/useMetamask';

const MetaMaskConnect: React.FC = () => {
  const { web3, accounts, connect } = useMetaMask();
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    }
  }, [accounts]);

  const handleConnect = async () => {
    await connect();
  };

  return (
    <div>
      {account ? (
        <p>Compte: {account}</p>
      ) : (
        <button onClick={handleConnect}>Connecter MetaMask</button>
      )}
    </div>
  );
};

export default MetaMaskConnect;
