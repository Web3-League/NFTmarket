// src/pages/Market.tsx
import React from 'react';
import SellNFT from '../components/NFTSell';
import AllNFTsForSale from '../components/AllNFTsForSale';
import NetworkSwitcher from '../components/NetworkSwitcher';

const Market: React.FC = () => {
  return (
    <div>
      <h1>Marché des NFTs</h1>
      <SellNFT onSell={() => { window.location.reload(); }} />
      <AllNFTsForSale />
      <NetworkSwitcher />
    </div>
  );
};

export default Market;



















