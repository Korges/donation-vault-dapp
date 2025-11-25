### Donation Vault Dapp

1. `pnpm install`
2. `pnpm hardhat compile`
3. `pnpm hardhat node`
4. `pnpm hardhat run ./scripts/deploy.ts --network localhost`
5. `pnpm run frontend`
6. interact with MetaMask
7. **(Optional)**
  - Copy the generated contract address 
  - `pnpm hardhat run ./scripts/event-listener.ts`

  ```
  korges@macbook donation-vault-dapp % pnpm hardhat run ./scripts/event-listener.ts
  Listening for Funder events...
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 addFunds: 1.0 ETH
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 addFunds: 1.0 ETH
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 withdraw: 0.1 ETH
```

  ![alt text](image.png)