import { JsonRpcProvider, ethers } from "ethers";
import { loadIgnitionContract } from "../utils/loadIgnitionContract";


async function main() {
  const provider = new JsonRpcProvider("http://127.0.0.1:8545/");
  const network = await provider.getNetwork();
  const signer = await provider.getSigner(0);

  // Load contract automatically from Ignition
  const contract = loadIgnitionContract(
    "Vault",  // contract name
    Number(network.chainId),     // chainId
    signer
  );

  contract.on("Funder", (user, amount, event) => {
    const formattedAmount = ethers.formatEther(amount);
    console.log(`${user} : ${formattedAmount} ETH`);
  });

  console.log("Listening for Funder events...");
}

main().catch(console.error);
