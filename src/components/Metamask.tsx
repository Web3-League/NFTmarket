// src/components/MetaMask.tsx
import React, { useEffect, useState } from 'react';
import { useMetaMask } from '../hooks/useMetamask';

const MetaMask: React.FC = () => {
  const { web3, accounts, connect } = useMetaMask();
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    }
  }, [accounts]);

  return (
    <div>
      {account ? (
        <p>Compte connecté: {account}</p>
      ) : (
        <button onClick={connect}>Connecter MetaMask</button>
      )}
    </div>
  );
};

export default MetaMask;

