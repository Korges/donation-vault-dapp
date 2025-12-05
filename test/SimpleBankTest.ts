import { expect } from "chai";
import hre from "hardhat";

const { ethers } = await hre.network.connect();

describe("Vault - deposit / addDonation", function () {
  it("should accept a donation and increase contract balance", async function () {
    // Deploy kontraktu
    const vault = await ethers.deployContract("Vault");
    await vault.waitForDeployment();

    // Pobieramy signerów
    const [owner, donor] = await ethers.getSigners();

    const donationValue = ethers.parseEther("1"); // 1 ETH

    // Donor wysyła donację
    await expect(vault.connect(donor).addDonation({ value: donationValue }))
      .to.emit(vault, "LogMessage") // event z Logger
      .withArgs(await donor.getAddress(), "New donation received");

    // Sprawdzenie salda kontraktu
    const contractBalance = await ethers.provider.getBalance(await vault.getAddress());
    expect(contractBalance).to.equal(donationValue);

    // Sprawdzenie stanu wewnętrznego (mapa donations)
    const donorDonation = await vault.connect(donor).getDonationForCaller();
    expect(donorDonation).to.equal(donationValue);
  });
});