// src/components/NetworkSwitcher.tsx
import React from "react";
import { useNetwork } from "../hooks/NetworkContext";

const NetworkSwitcher: React.FC = () => {
  const { network, switchNetwork } = useNetwork();

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchNetwork(e.target.value as 'sepolia' | 'amoy');
  };

  return (
    <div>
      <label htmlFor="network-select">Sélectionner le réseau:</label>
      <select
        id="network-select"
        value={network}
        onChange={handleNetworkChange}
      >
        <option value="sepolia">Sepolia</option>
        <option value="amoy">Amoy</option>
      </select>
    </div>
  );
};

export default NetworkSwitcher;


