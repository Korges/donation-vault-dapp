import { JsonRpcProvider, ethers } from "ethers";
import * as vaultArtifact from "../artifacts/contracts/SimpleBank.sol/SimpleBank.json";


interface UserBalance {
  user: string;
  balance: bigint; // ethers v6 uses bigint for uint256
}

async function main() {
  const provider = new JsonRpcProvider("http://127.0.0.1:8545/");
  const network = await provider.getNetwork();
  const signer = await provider.getSigner(0);

  const abi = vaultArtifact.abi;

   const contract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3", //smartcontract deployment address
    abi,
    signer
  );

  const donations: UserBalance[] = await contract.getAllUserBalances();

  console.log("=== User Balances ===");
  donations.forEach((row, index) => {
    console.log(`${index + 1}. User: ${row.user}, Balance: ${ethers.formatEther(row.balance)} ETH`);
  });

}

main().catch(console.error);