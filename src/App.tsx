import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import MyNFTs from './pages/MyNFTs';
import Market from './pages/Market';
import SellNFT from './pages/SellNFT';
import ManageOffers from './pages/ManageOffers';
import { NetworkProvider } from './hooks/NetworkContext';
import NetworkSwitcher from './components/NetworkSwitcher';

const App: React.FC = () => {
  return (
    <NetworkProvider>
      <Router>
        <div>
          <Navbar />
          <NetworkSwitcher />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/mynfts" element={<MyNFTs />} />
            <Route path="/market" element={<Market />} />
            <Route path="/sellnft" element={<SellNFT />} />
            <Route path="/manageoffers" element={<ManageOffers />} />
          </Routes>
        </div>
      </Router>
    </NetworkProvider>
  );
};

export default App;














