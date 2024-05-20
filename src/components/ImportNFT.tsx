// src/components/ImportNFT.tsx
import React, { useState } from "react";
import { useMetaMask } from "../hooks/useMetamask";
import { useNetwork } from "../hooks/NetworkContext";

interface ImportNFTProps {
  onImport: (newToken: { id: string; uri: string; contractAddress: string }) => void;
}

const ImportNFT: React.FC<ImportNFTProps> = ({ onImport }) => {
  const { web3 } = useMetaMask();
  const { NFTContract } = useNetwork();
  const [importContractAddress, setImportContractAddress] = useState<string>("");
  const [importTokenId, setImportTokenId] = useState<string>("");

  const importNFT = async () => {
    if (!importContractAddress || !importTokenId) {
      alert("Veuillez entrer l'adresse du contrat et l'ID du token.");
      return;
    }

    if (!web3) {
      console.error("Web3 is not initialized");
      return;
    }

    try {
      const importedContract = new web3.eth.Contract(NFTContract.options.jsonInterface, importContractAddress);
      const uri: string = await importedContract.methods.tokenURI(importTokenId).call();
      console.log('Imported token URI:', uri);

      if (typeof uri === "string" && uri.length > 0) {
        onImport({ id: importTokenId, uri, contractAddress: importContractAddress });
      } else {
        console.error("Erreur: URI du token non valide ou vide.");
      }
    } catch (error) {
      console.error("Erreur lors de l'importation du NFT:", error);
    }
  };

  return (
    <div>
      <h2>Importer un NFT</h2>
      <input
        type="text"
        id="importContractAddress"
        name="importContractAddress"
        placeholder="Adresse du contrat"
        value={importContractAddress}
        onChange={(e) => setImportContractAddress(e.target.value)}
      />
      <input
        type="text"
        id="importTokenId"
        name="importTokenId"
        placeholder="ID du token"
        value={importTokenId}
        onChange={(e) => setImportTokenId(e.target.value)}
      />
      <button onClick={importNFT}>Importer NFT</button>
    </div>
  );
};

export default ImportNFT;
