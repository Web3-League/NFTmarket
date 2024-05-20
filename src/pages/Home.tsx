import React, { useEffect, useState } from "react";
import { useMetaMask } from "../hooks/useMetamask";
import { useNetwork } from "../hooks/NetworkContext";
import { uploadFileToPinata } from "../pinata";

interface TokenDetails {
  id: number;
  uri: string;
}

const Home: React.FC = () => {
  const { web3, accounts } = useMetaMask();
  const { network, NFTContract, switchNetwork } = useNetwork();
  const [totalSupply, setTotalSupply] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string>("");
  const [tokens, setTokens] = useState<TokenDetails[]>([]);
  const [importContractAddress, setImportContractAddress] = useState<string>("");
  const [importTokenId, setImportTokenId] = useState<string>("");

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (web3 && accounts.length > 0) {
        const account = accounts[0];
        try {
          console.log("Compte connecté:", account);

          const supply: number = await NFTContract.methods.totalSupply().call();
          console.log("Nombre total de NFT:", supply);
          setTotalSupply(Number(supply));

          const balance: number = await NFTContract.methods.balanceOf(account).call();
          console.log("Balance:", balance);

          const tokenDetails: TokenDetails[] = [];
          for (let i = 0; i < balance; i++) {
            const id: number = await NFTContract.methods.tokenOfOwnerByIndex(account, i).call();
            console.log(`Token ID récupéré: ${id}`);
            const uri: string = await NFTContract.methods.tokenURI(id).call();
            console.log(`Token URI récupéré: ${uri}`);
            tokenDetails.push({ id, uri });
          }
          setTokens(tokenDetails);
        } catch (error) {
          console.error("Erreur lors du chargement des données blockchain:", error);
        }
      } else {
        console.error('MetaMask non détecté ou aucun compte trouvé');
      }
    };

    loadBlockchainData();
  }, [web3, accounts, network]);

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
      const expectedChainId = network === 'sepolia' ? 11155111 : 80002; // Sepolia: 11155111, Amoy (Mumbai): 80001

      if (Number(chainId) !== expectedChainId) {
        alert(`Veuillez changer de réseau dans MetaMask. Réseau actuel: ${chainId}, Réseau attendu: ${expectedChainId}`);
        return;
      }

      const account = accounts[0];
      const data = NFTContract.methods.safeMint(account, fileUrl).encodeABI();

      const gasPrice = await web3.eth.getGasPrice();
      const gasEstimate = await NFTContract.methods.safeMint(account, fileUrl).estimateGas({ from: account });

      const tx = {
        from: account,
        to: NFTContract.options.address,
        data: data,
        gas: gasEstimate,
        gasPrice: gasPrice,
        chainId: expectedChainId
      };

      web3.eth.sendTransaction(tx)
        .on('transactionHash', (hash) => {
          console.log('Transaction Hash:', hash);
        })
        .on('receipt', async (receipt) => {
          if (receipt.events && receipt.events.NFTMinted && receipt.events.NFTMinted.returnValues) {
            const newTokenId: number = Number(receipt.events.NFTMinted.returnValues.tokenId);
            const newTokenUri: string = await NFTContract.methods.tokenURI(newTokenId).call();
            console.log('New token minted:', { id: newTokenId, uri: newTokenUri });

            if (newTokenId !== undefined && newTokenUri) {
              setTokens([...tokens, { id: newTokenId, uri: newTokenUri }]);
            } else {
              console.error("Erreur: l'ID ou l'URI du nouveau token est indéfini.");
            }
          } else {
            console.error("Erreur: Événement de NFT minté non trouvé ou mal formaté.");
          }

          const supply: number = await NFTContract.methods.totalSupply().call();
          setTotalSupply(Number(supply));
        })
        .on('error', console.error);
    } catch (error) {
      console.error("Erreur lors du minting:", error);
    }
  };

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
        setTokens([...tokens, { id: Number(importTokenId), uri }]);
      } else {
        console.error("Erreur: URI du token non valide ou vide.");
      }
    } catch (error) {
      console.error("Erreur lors de l'importation du NFT:", error);
    }
  };

  return (
    <div>
      <h1>Bienvenue sur la page d'accueil de votre DApp</h1>
      <p>Compte connecté: {accounts[0]}</p>
      <p>Nombre total de NFT: {totalSupply}</p>
      <p>Nombre de NFT possédés: {tokens.length}</p>
      <ul>
        {tokens.map((token) => (
          <li key={token.id}>
            NFT ID: {token.id}, URI:{" "}
            <a href={token.uri} target="_blank" rel="noopener noreferrer">
              {token.uri}
            </a>
          </li>
        ))}
      </ul>
      <div>
        <input type="file" id="file" name="file" onChange={onFileChange} />
        <button onClick={mintNFT}>Mint NFT</button>
      </div>
      {fileURL && (
        <p>
          Fichier IPFS:{" "}
          <a href={fileURL} target="_blank" rel="noopener noreferrer">
            {fileURL}
          </a>
        </p>
      )}
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
      <div>
        <label htmlFor="network-select">Sélectionner le réseau:</label>
        <select
          id="network-select"
          value={network}
          onChange={(e) => switchNetwork(e.target.value as 'sepolia' | 'amoy')}
        >
          <option value="sepolia">Sepolia</option>
          <option value="amoy">Amoy</option> {/* Ajouter l'option pour Amoy */}
        </select>
      </div>
    </div>
  );
};

export default Home;
