import { readFileSync } from "fs";
import path from "path";
import { Contract, Signer } from "ethers";

/**
 * Universal contract loader for Hardhat Ignition deployments.
 */
export function loadIgnitionContract(contractName: string, chainId: number, signer: Signer) {
  const deploymentsPath = path.resolve(process.cwd(),`ignition/deployments/chain-${chainId}`);

  // 1. Load address
  const addresses = JSON.parse(
    readFileSync(`${deploymentsPath}/deployed_addresses.json`, "utf-8")
  );

  const address = addresses[`VaultModule#${contractName}`];
  if (!address) {
    throw new Error(`Contract not found: ${contractName} on chain ${chainId}`);
  }

  // --- 2. Load ABI from Hardhat artifacts ---
  const artifactPath = path.resolve(
    process.cwd(),
    `artifacts/contracts/${contractName}.sol/${contractName}.json`
  );

  const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
  const abi = artifact.abi;

  // 3. Return ethers.js contract instance
  return new Contract(address, abi, signer);
}
