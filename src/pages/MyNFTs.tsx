import React, { useEffect, useState } from "react";
import { useMetaMask } from "../hooks/useMetamask";
import { useNetwork } from "../hooks/NetworkContext"; // Importer useNetwork

interface TokenDetails {
  id: number;
  uri: string;
  contractAddress: string;
}

const MyNFTs: React.FC = () => {
  const { web3, accounts } = useMetaMask();
  const { network, NFTContract, switchNetwork } = useNetwork();
  const [tokens, setTokens] = useState<TokenDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Ajouter un état de chargement

  // Fonction pour proposer le changement de réseau dans MetaMask
  const requestNetworkSwitch = async (chainId: string, chainName: string, rpcUrl: string) => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId,
          chainName,
          rpcUrls: [rpcUrl],
        }],
      });
    } catch (error) {
      console.error("Erreur lors du changement de réseau:", error);
    }
  };

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (web3 && accounts.length > 0) {
        const account = accounts[0];

        // Vérifier le réseau de MetaMask
        const chainId = await web3.eth.getChainId();
        const expectedChainId = network === 'sepolia' ? 11155111 : network === 'amoy' ? 137 : 80001; // Sepolia: 11155111, Matic: 137, Amoy Testnet: 80001

        if (Number(chainId) !== expectedChainId) { // Conversion du chainId en number
          // Proposer le changement de réseau
          if (network === 'sepolia') {
            requestNetworkSwitch('0xaa36a7', 'Sepolia Test Network', 'https://rpc.sepolia.org');
          } else if (network === 'amoy') {
            requestNetworkSwitch('0x13882', 'Polygon Amoy Test Network', 'https://rpc-amoy.polygon.technology/');
          }
          return;
        }

        try {
          console.log("Compte connecté:", account);

          const balance = await NFTContract.methods.balanceOf(account).call();
          console.log("Balance:", balance);

          const tokenDetails: TokenDetails[] = [];
          for (let i = 0; i < balance; i++) {
            const id = await NFTContract.methods.tokenOfOwnerByIndex(account, i).call();
            console.log(`Token ID récupéré: ${id}`);
            const uri = await NFTContract.methods.tokenURI(id).call();
            console.log(`Token URI récupéré: ${uri}`);
            const contractAddress = NFTContract.options.address || "Address not found";
            tokenDetails.push({ id, uri, contractAddress });
          }
          setTokens(tokenDetails);
        } catch (error) {
          console.error("Erreur lors du chargement des données blockchain:", error);
        } finally {
          setLoading(false); // Fin du chargement
        }
      } else {
        console.error('MetaMask non détecté ou aucun compte trouvé');
        setLoading(false); // Fin du chargement même en cas d'erreur
      }
    };

    setTokens([]); // Réinitialiser les tokens lors du changement de réseau
    setLoading(true); // Début du chargement
    loadBlockchainData();
  }, [web3, accounts, network, NFTContract]); // Ajouter network et NFTContract comme dépendances

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchNetwork(e.target.value as 'sepolia' | 'amoy'); // Ajouter 'amoy'
  };

  return (
    <div>
      <h1>Mes NFTs</h1>
      <p>Compte connecté: {accounts[0]}</p>
      {loading ? (
        <p>Chargement des NFTs...</p>
      ) : (
        <>
          <p>Nombre de NFTs possédés: {tokens.length}</p>
          <ul>
            {tokens.map((token, index) => (
              <li key={index}>
                <p><strong>NFT ID:</strong> {token.id}</p>
                <p><strong>Contract Address:</strong> {token.contractAddress}</p>
                <p>
                  <strong>URI:</strong> {" "}
                  <a href={token.uri} target="_blank" rel="noopener noreferrer">
                    {token.uri}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
      <div>
        <label htmlFor="network-select">Sélectionner le réseau:</label>
        <select
          id="network-select"
          value={network}
          onChange={handleNetworkChange}
        >
          <option value="sepolia">Sepolia</option>
          <option value="matic">Matic</option>
          <option value="amoy">Amoy</option> {/* Ajouter l'option pour Amoy */}
        </select>
      </div>
    </div>
  );
};

export default MyNFTs;


















