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
  Listening for Vault events...
  0x70997970C51812dc3A010C7d01b50e0d17dc79C8 New donation received
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 Withdrawal executed
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 All funds withdrawn
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 New donation received
  ```
  - `pnpm hardhat run ./scripts/get-all-donors.ts`
  ```
  === All Donors ===
  1. 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  2. 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
  ```
  - `pnpm hardhat run ./scripts/get-all-donations.ts`
  ```
  === All Donations ===
  1. Donor: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, Amount: 2.2 ETH
  2. Donor: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8, Amount: 1.0 ETH
  ```
  - `pnpm hardhat run ./scripts/get-donation-for-caller.ts`
  ```
  Donation for 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266: 1.1 ETH
  ```
  

  ![alt text](image.png)