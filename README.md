### Donation Vault Dapp

1. `pnpm install`
2. `pnpm hardhat compile`
3. `pnpm hardhat node`
4. `pnpm hardhat run ./scripts/deploy.ts --network localhost`
5. `pnpm run frontend`
6. interact with MetaMask
7. **(Optional) 
  - Copy the generated contract address 
  - `pnpm hardhat run ./scripts/event-listener.ts`