import { useState, useEffect } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import contractAddress from "./contracts/contract-address-localhost.json";
import VaultArtifact from "./contracts/Vault.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [txError, setTxError] = useState(null);
  const [txInfo, setTxInfo] = useState(null);
  const [donationAmount, setDonationAmount] = useState("0.1");
  const [withdrawAmount, setWithdrawAmount] = useState("0.1");

  // Connect wallet and initialize contract
  const connectWallet = async () => {
    try {
      const detectedProvider = await detectEthereumProvider();
      if (!detectedProvider) {
        alert("Please install MetaMask!");
        return;
      }

      // Request accounts
      const [selectedAccount] = await detectedProvider.request({
        method: "eth_requestAccounts",
      });
      setAccount(selectedAccount);

      // Create provider and signer
      const web3Provider = new ethers.BrowserProvider(detectedProvider);
      const network = await web3Provider.getNetwork();
      const signer = await web3Provider.getSigner(0);

      // Load contract with signer
      const vaultContract = new ethers.Contract(contractAddress.Vault, VaultArtifact.abi, signer);

      setProvider(web3Provider);
      setContract(vaultContract);

      // Listen for account or network changes
      detectedProvider.on("accountsChanged", ([newAccount]) => {
        if (!newAccount) {
          setAccount(null);
          setContract(null);
          setBalance("0");
        } else {
          connectWallet(); // reconnect with new account
        }
      });
      detectedProvider.on("chainChanged", () => window.location.reload());

      // Load initial contract balance
      const contractBalance = await web3Provider.getBalance(
        vaultContract.target || vaultContract.address
      );
      setBalance(ethers.formatEther(contractBalance));
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setTxError(err.message);
    }
  };

  // Add 1 ETH to the contract
  const addDonation = async () => {
    if (!contract) return;

    try {
      const tx = await contract.addDonation({
        value: ethers.parseEther(donationAmount),
      });
      setTxInfo(tx.hash);
      const receipt = await tx.wait();

      if (receipt.status === 0) throw new Error("Transaction failed");

      // Reload balance
      const contractBalance = await provider.getBalance(
        contract.target || contract.address
      );
      setBalance(ethers.formatEther(contractBalance));
    } catch (err) {
      console.error("Failed to add funds:", err);
      setTxError(err.reason || err.message);
    } finally {
      setTxInfo(null);
    }
  };


  // Withdraw ETH from the contract
  const withdraw = async () => {
    if (!contract) return;

    try {
      const tx = await contract.withdraw(ethers.parseEther(withdrawAmount));
      setTxInfo(tx.hash);
      const receipt = await tx.wait();

      if (receipt.status === 0) throw new Error("Transaction failed");

      // Reload balance
      const contractBalance = await provider.getBalance(
        contract.target || contract.address
      );
      setBalance(ethers.formatEther(contractBalance));
    } catch (err) {
      console.error("Failed to withdraw:", err);
      setTxError(err.reason || err.message);
    } finally {
      setTxInfo(null);
    }
  };

  // Withdraw All ETH from the contract
  const withdrawAll = async () => {
    if (!contract) return;

    try {
      const tx = await contract.withdrawAll();
      setTxInfo(tx.hash);
      const receipt = await tx.wait();

      if (receipt.status === 0) throw new Error("Transaction failed");

      // Reload balance
      const contractBalance = await provider.getBalance(
        contract.target || contract.address
      );
      setBalance(ethers.formatEther(contractBalance));
    } catch (err) {
      console.error("Failed to withdraw:", err);
      setTxError(err.reason || err.message);
    } finally {
      setTxInfo(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Faucet</h1>

        {!account ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4" 
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <div className="mb-4">
            <span className="font-semibold">Account: </span>
            {account}
          </div>
        )}

        <div className="text-lg mb-4">
          Current Balance: <strong>{balance}</strong> ETH
        </div>

        {txError && (
          <div className="mb-2 text-red-600">
            Transaction Error: {txError}
          </div>
        )}

        {txInfo && (
          <div className="mb-2 text-green-600">
            Transaction in progress: {txInfo}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <input
            type="number"
            min="0"
            step="0.1"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="flex-1 px-3 py-2 border rounded text-right"
          />

          <button
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            onClick={addDonation}
            disabled={!contract}
          >
            Donate ETH
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="number"
            min="0"
            step="0.1"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="flex-1 px-3 py-2 border rounded text-right"
          />

          <button
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            onClick={withdraw}
            disabled={!contract}
          >
            Withdraw ETH
          </button>
        </div>

        <div className="flex">
          <button
            className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-gray-400"
            onClick={withdrawAll}
            disabled={!contract}
          >
            Withdraw All
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
