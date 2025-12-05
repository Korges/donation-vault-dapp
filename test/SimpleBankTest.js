import { expect } from "chai";
import hre from "hardhat";

const { ethers } = await hre.network.connect();

describe("SimpleBank", function () {
  let bank;
  let admin, user1, user2;

  beforeEach(async function () {
    [admin, user1, user2] = await ethers.getSigners();

    const SimpleBank = await ethers.getContractFactory("SimpleBank");
    bank = await SimpleBank.connect(admin).deploy();
    await bank.waitForDeployment();
  });

  it("should set deployer as admin", async function () {
    expect(await bank.admin()).to.equal(admin.address);
  });
  
});