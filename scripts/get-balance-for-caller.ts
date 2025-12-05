import { JsonRpcProvider, ethers } from "ethers";
import * as vaultArtifact from "../artifacts/contracts/SimpleBank.sol/SimpleBank.json";


async function main() {
  const provider = new JsonRpcProvider("http://127.0.0.1:8545/");
  const signer = await provider.getSigner(0);
  const address = await signer.getAddress();

  const abi = vaultArtifact.abi;

   const contract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3", //smartcontract deployment address
    abi,
    signer
  );

  const donationAmount = await contract.getBalance();

  console.log(`Balance for ${address}: ${ethers.formatEther(donationAmount)} ETH`);
}

main().catch(console.error);