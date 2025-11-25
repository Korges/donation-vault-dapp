import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28"
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  typechain: {
    dontOverrideCompile: true // nie uruchamiaj po compile
  }
};

export default config;
