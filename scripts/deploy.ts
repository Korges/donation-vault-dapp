import hre, { artifacts } from "hardhat";
import path from "path";
import fs from "fs";

const { ethers, networkName } = await hre.network.connect();


async function main() {
  // 1. Get the contract factory
  const MyContractFactory = await ethers.getContractFactory("SimpleBank");

  // 2. Deploy the contract
  const contract = await MyContractFactory.deploy();

  console.log(contract)

  // 3. Wait for deployment to finish
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("Contract deployed to:", address);

  saveContractFiles(address, "SimpleBank");
}

async function saveContractFiles(address: any, contractName: string) {
  const contractDir = path.join(process.cwd(), "frontend", "src", "contracts");

  // Tworzymy folder jeśli nie istnieje
  if (!fs.existsSync(contractDir)) {
    fs.mkdirSync(contractDir, { recursive: true });
  }

  // Save contract address
  fs.writeFileSync(
    path.join(contractDir, `contract-address-${networkName}.json`),
    JSON.stringify({ [contractName]: address }, null, 2)
  );

  // Save contract ABI & metadata
  const artifact = await hre.artifacts.readArtifact(contractName);

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