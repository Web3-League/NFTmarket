// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Market from './pages/Market';
import { NetworkProvider } from './hooks/NetworkContext';
import { MetaMaskProvider } from './hooks/useMetamask';

const App: React.FC = () => {
  return (
    <NetworkProvider>
      <MetaMaskProvider>
        <Router>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/market" element={<Market />} />
            </Routes>
          </div>
        </Router>
      </MetaMaskProvider>
    </NetworkProvider>
  );
};

export default App;
















