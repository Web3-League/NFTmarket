// src/alchemy.ts
import { Alchemy, Network } from "alchemy-sdk";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY, // Remplacez par votre clé API Alchemy.
  network: Network.ETH_SEPOLIA, // Remplacez par le réseau de votre choix.
};

const alchemy = new Alchemy(settings);

export default alchemy;
