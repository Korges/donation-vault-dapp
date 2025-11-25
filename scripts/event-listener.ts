import { JsonRpcProvider, ethers } from "ethers";
import VaultArtifact from "../artifacts/contracts/Vault.sol/Vault.json";
import deployed from "../ignition/deployments/chain-31337/deployed_addresses.json";

function getVaultAddress() {

  const VAULT_ADDRESS = deployed["VaultModule#Vault"];
  console.log(VAULT_ADDRESS);

  return  VAULT_ADDRESS;
}

async function main() {
  const provider = new JsonRpcProvider("http://127.0.0.1:8545/");
  const vaultAddress = getVaultAddress();
  console.log("vault address : " + vaultAddress)

  const signer = await provider.getSigner(0);

  const contract = new ethers.Contract(
    vaultAddress,
    VaultArtifact.abi,
    signer
  );

  contract.on("Funder", (user, amount, event) => {
    const formattedAmount = ethers.formatEther(amount);
    console.log(`${user} : ${formattedAmount} ETH`);
  });

  console.log("Listening for Transfer events...");
}

main().catch(console.error);
