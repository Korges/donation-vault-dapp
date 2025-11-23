import hre from "hardhat";
import VaultModule from "../ignition/modules/Vault.js";

async function main() {
  const connection = await hre.network.connect();
  const { vault } = await connection.ignition.deploy(VaultModule);
  
  console.log(`Vault deployed to: ${vault.address}`);
}

main().catch(console.error);