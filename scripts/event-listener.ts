import { JsonRpcProvider, ethers } from "ethers";
import * as vaultArtifact from "../artifacts/contracts/SimpleBank.sol/SimpleBank.json";

async function main() {
  const provider = new JsonRpcProvider("http://127.0.0.1:8545/");
  const signer = await provider.getSigner(0);

  const abi = vaultArtifact.abi;

   const contract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3", //smartcontract deployment address
    abi,
    signer
  );

  contract.on("Deposit", (user, amount) => {
    console.log(`Deposit | user: ${user} | amount: ${ethers.formatEther(amount)}`);
  });

  contract.on("Withdraw", (user, amount) => {
    console.log(`Withdraw | user: ${user} | amount:${ethers.formatEther(amount)}`);
  });

  console.log("Listening on events...");
}

main().catch(console.error);
