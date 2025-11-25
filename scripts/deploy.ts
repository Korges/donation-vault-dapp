import { ethers, artifacts, network } from "hardhat";
import path from "path"
import fs from "fs"

async function main() {
  // 1. Get the contract factory
  const MyContractFactory = await ethers.getContractFactory("Vault");

  // 2. Deploy the contract
  const contract = await MyContractFactory.deploy();

  // 3. Wait for deployment to finish
  await contract.waitForDeployment();

  console.log("Contract deployed to:", contract.target); 

  saveContractFiles(contract, "Vault");
}

function saveContractFiles(contract: any, contractName: string) {
  const contractDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractDir)) {
    fs.mkdirSync(contractDir);
  }

  // Save contract address
  fs.writeFileSync(
    path.join(contractDir, `contract-address-${network.name}.json`),
    JSON.stringify({ [contractName]: contract.target }, null, 2)
  );

  // Save contract ABI & metadata
  const artifact = artifacts.readArtifactSync(contractName);

  fs.writeFileSync(
    path.join(contractDir, `${contractName}.json`),
    JSON.stringify(artifact, null, 2)
  );
}

// Run the script and handle errors
main().catch((error) => {
  console.error(error);
  process.exit(1);
});


// pnpm hardhat run scripts/deploy.js --network localhost