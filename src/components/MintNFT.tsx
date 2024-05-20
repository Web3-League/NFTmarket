// src/components/MintNFT.tsx
import React, { useState } from "react";
import { uploadFileToPinata } from "../pinata";
import { useMetaMask } from "../hooks/useMetamask";
import { useNetwork } from "../hooks/NetworkContext";

interface MintNFTProps {
  onMint: (newToken: { id: string; uri: string; contractAddress: string }) => void;
}

const MintNFT: React.FC<MintNFTProps> = ({ onMint }) => {
  const { web3, accounts } = useMetaMask();
  const { network, NFTContract } = useNetwork();
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string>("");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const mintNFT = async () => {
    if (!file) {
      alert("Veuillez sélectionner un fichier.");
      return;
    }

    if (!web3) {
      console.error("Web3 is not initialized");
      return;
    }

    try {
      const fileUrl: string = await uploadFileToPinata(file);
      setFileURL(fileUrl);
      console.log("Fichier uploadé sur IPFS:", fileUrl);

      const chainId = await web3.eth.getChainId();
      const expectedChainId = network === 'sepolia' ? 11155111 : network === 'amoy' ? 80002 : 80002;

      if (Number(chainId) !== expectedChainId) {
        console.error(`Veuillez changer de réseau dans MetaMask. Réseau actuel: ${chainId}, Réseau attendu: ${expectedChainId}`);
        return;
      }

      const tx = {
        from: accounts[0],
        to: NFTContract.options.address,
        data: NFTContract.methods.safeMint(accounts[0], fileUrl).encodeABI(),
        gas: await NFTContract.methods.safeMint(accounts[0], fileUrl).estimateGas({ from: accounts[0] }),
      };

      await web3.eth.sendTransaction(tx)
        .on('receipt', async (receipt) => {
          console.log("Mint transaction receipt:", receipt);

          if (receipt.events && receipt.events.NFTMinted && receipt.events.NFTMinted.returnValues) {
            const newTokenId: number = Number(receipt.events.NFTMinted.returnValues.tokenId);
            const newTokenUri: string = await NFTContract.methods.tokenURI(newTokenId).call();
            console.log('New token minted:', { id: newTokenId, uri: newTokenUri });

            if (newTokenId !== undefined && newTokenUri) {
              onMint({ id: newTokenId.toString(), uri: newTokenUri, contractAddress: NFTContract.options.address });
            } else {
              console.error("Erreur: l'ID ou l'URI du nouveau token est indéfini.");
            }
          } else {
            console.error("Erreur: Événement de NFT minté non trouvé ou mal formaté.");
          }
        });
    } catch (error) {
      console.error("Erreur lors du minting:", error);
    }
  };

  return (
    <div>
      <input type="file" id="file" name="file" onChange={onFileChange} />
      <button onClick={mintNFT}>Mint NFT</button>
      {fileURL && (
        <p>
          Fichier IPFS: <a href={fileURL} target="_blank" rel="noopener noreferrer">{fileURL}</a>
        </p>
      )}
    </div>
  );
};

export default MintNFT;
