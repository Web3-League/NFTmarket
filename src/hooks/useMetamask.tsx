import { useEffect, useState } from "react";
import Web3 from "web3";

export const useMetaMask = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);

  useEffect(() => {
    const connectMetaMask = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);
          console.log("Accounts retrieved:", accounts);
        } catch (error) {
          console.error("User denied account access or there was an error:", error);
        }
      } else {
        console.error("MetaMask not detected");
      }
    };

    connectMetaMask();
  }, []);

  return { web3, accounts };
};
