import { useState, useEffect } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import contractAddress from "./contracts/contract-address-localhost.json";
import SimpleBankArtifact from "./contracts/SimpleBank.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [isAdmin, setIsAdmin] = useState(false);
  const [bankBalance, setBankBalance] = useState("0");
  const [userBalances, setUserBalances] = useState([]);
  const [txError, setTxError] = useState(null);
  const [txInfo, setTxInfo] = useState(null);
  const [depositAmount, setDepositAmount] = useState("0.1");
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
      const signer = await web3Provider.getSigner(0);

      // Load contract with signer
      const bankContract = new ethers.Contract(contractAddress.SimpleBank, SimpleBankArtifact.abi, signer);

      setProvider(web3Provider);
      setContract(bankContract);

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

      // Load user balance
      const balance = await bankContract.getBalance();
      setBalance(ethers.formatEther(balance));

      const adminAddress = await bankContract.admin();
      const signerAddress = await bankContract.runner.getAddress();

      if (adminAddress.toLowerCase() === signerAddress.toLowerCase()) {
        setIsAdmin(true);
        await loadAdminData(bankContract);

        // Load bank balance
        const bankBalance = await bankContract.getContractBalance();
        setBankBalance(ethers.formatEther(bankBalance));
      } else {
        setIsAdmin(false);
      }

    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setTxError(err.message);
    }
  };

  // Add 1 ETH to the contract
  const deposit = async () => {
    if (!contract) return;

    try {
      const tx = await contract.deposit({
        value: ethers.parseEther(depositAmount),
      });
      setTxInfo(tx.hash);
      const receipt = await tx.wait();

      if (receipt.status === 0) throw new Error("Transaction failed");

      // Reload balance
      const balance = await contract.getBalance();
      setBalance(ethers.formatEther(balance));

      if (isAdmin) {
        const bankBalance = await contract.getContractBalance();
        setBankBalance(ethers.formatEther(bankBalance));

        // 2️⃣ Pobranie listy wszystkich userów i ich balansów
        const balances = await contract.getAllUserBalances();

        const formatted = balances.map(b => ({
          user: b.user,
          balance: ethers.formatEther(b.balance)
        }));

        setUserBalances(formatted);
      }
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
      const balance = await contract.getBalance();
      setBalance(ethers.formatEther(balance));

      if (isAdmin) {
        const bankBalance = await contract.getContractBalance();
        setBankBalance(ethers.formatEther(bankBalance));

        // 2️⃣ Pobranie listy wszystkich userów i ich balansów
        const balances = await contract.getAllUserBalances();

        const formatted = balances.map(b => ({
          user: b.user,
          balance: ethers.formatEther(b.balance)
        }));

        setUserBalances(formatted);
      }
    } catch (err) {
      console.error("Failed to withdraw:", err);
      setTxError(err.reason || err.message);
    } finally {
      setTxInfo(null);
    }
  };

  async function loadAdminData(contract) {
    try {
      // sprawdzenie czy user to admin (zakładam że masz pomocniczą funkcję)
      const admin = await contract.admin();
      const signerAddress = await contract.runner.getAddress();

      if (admin.toLowerCase() !== signerAddress.toLowerCase()) {
        console.log("Not admin - skipping admin dashboard");
        return;
      }

      // 1️⃣ Pobranie salda kontraktu
      const cBalance = await contract.getContractBalance();
      setBankBalance(ethers.formatEther(cBalance));

      // 2️⃣ Pobranie listy wszystkich userów i ich balansów
      const balances = await contract.getAllUserBalances();

      const formatted = balances.map(b => ({
        user: b.user,
        balance: ethers.formatEther(b.balance)
      }));

      setUserBalances(formatted);

    } catch (e) {
      console.error("Admin data error:", e);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Simple Bank App</h1>

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
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
          />

          <button
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            onClick={deposit}
            disabled={!contract}
          >
            Deposit ETH
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="number"
            min="0"
            step="0.1"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
          />

          <button
            className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-gray-400"
            onClick={withdraw}
            disabled={!contract}
          >
            Withdraw ETH
          </button>
        </div>
        {isAdmin && (
          <div className="admin-section mt-6">
            <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

            <div className="text-lg mb-4">
              Bank Total Balance: <strong>{bankBalance}</strong> ETH
            </div>

            <div className="text-lg mb-4">User Balances:</div>

            {/* Responsive scroll container */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">User Address</th>
                    <th className="px-4 py-2 text-left font-semibold">Balance (ETH)</th>
                  </tr>
                </thead>

                <tbody>
                  {userBalances.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 break-all">{item.user}</td>
                      <td className="px-4 py-2">{item.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
