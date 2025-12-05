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

  it("user can deposit ETH and getBalance returns correct amount", async function () {
    await bank.connect(user1).deposit({ value: ethers.parseEther("1") });

    const balance = await bank.connect(user1).getBalance();
    expect(balance).to.equal(ethers.parseEther("1"));
  });

  it("user can withdraw ETH and balance decreases", async function () {
    await bank.connect(user1).deposit({ value: ethers.parseEther("2") });

    await bank.connect(user1).withdraw(ethers.parseEther("1"));

    const balance = await bank.connect(user1).getBalance();
    expect(balance).to.equal(ethers.parseEther("1"));
  });

  it("should revert withdraw if amount > balance", async function () {
    await bank.connect(user1).deposit({ value: ethers.parseEther("1") });

    await expect(
      bank.connect(user1).withdraw(ethers.parseEther("2"))
    ).to.be.revertedWith("Insufficient Balance");
  });

    it("admin can get contract balance", async function () {
    await bank.connect(user1).deposit({ value: ethers.parseEther("3") });

    const cBalance = await bank.connect(admin).getContractBalance();
    expect(cBalance).to.equal(ethers.parseEther("3"));
  });

  it("non-admin cannot get contract balance", async function () {
    await expect(
      bank.connect(user1).getContractBalance()
    ).to.be.revertedWith("Only admin can call this");
  });

  it("admin can get all user balances", async function () {
    await bank.connect(user1).deposit({ value: ethers.parseEther("1") });
    await bank.connect(user2).deposit({ value: ethers.parseEther("2") });

    const allBalances = await bank.connect(admin).getAllUserBalances();

    expect(allBalances.length).to.equal(2);
    expect(allBalances[0].user).to.equal(user1.address);
    expect(allBalances[0].balance).to.equal(ethers.parseEther("1"));
    expect(allBalances[1].user).to.equal(user2.address);
    expect(allBalances[1].balance).to.equal(ethers.parseEther("2"));
  });

  it("non-admin cannot get all user balances", async function () {
    await bank.connect(user1).deposit({ value: ethers.parseEther("1") });

    await expect(
      bank.connect(user1).getAllUserBalances()
    ).to.be.revertedWith("Only admin can call this");
  });

  it("deposit emits Deposit event", async function () {
    await expect(bank.connect(user1).deposit({ value: ethers.parseEther("1") }))
      .to.emit(bank, "Deposit")
      .withArgs(user1.address, ethers.parseEther("1"));
  });

  it("withdraw emits Withdraw event", async function () {
    await bank.connect(user1).deposit({ value: ethers.parseEther("1") });

    await expect(bank.connect(user1).withdraw(ethers.parseEther("1")))
      .to.emit(bank, "Withdraw")
      .withArgs(user1.address, ethers.parseEther("1"));
  });
  
});