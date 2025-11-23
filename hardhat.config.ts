import { defineConfig } from "hardhat/config";
import hardhatIgnitionViemPlugin from "@nomicfoundation/hardhat-ignition-viem";

export default defineConfig({
  plugins: [hardhatIgnitionViemPlugin],
  solidity: {
    version: "0.8.28"
  },
  networks: {
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545"
    }
  },
});
