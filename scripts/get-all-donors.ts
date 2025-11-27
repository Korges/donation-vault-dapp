import { JsonRpcProvider, ethers } from "ethers";
import * as vaultArtifact from "../artifacts/contracts/Vault.sol/Vault.json";


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

  const donors: string[] = await contract.getAllDonors();

  console.log("=== All Donors ===");
  donors.forEach((addr, index) => {
    console.log(`${index + 1}. ${addr}`);
  });

}

main().catch(console.error);