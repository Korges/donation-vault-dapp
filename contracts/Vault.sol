// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Owned.sol";
import "./Logger.sol";
import "./IVault.sol";


contract Vault is Owned, Logger, IVault {

  struct DonationInfo {
    address donor;
    uint amount;
  }

  mapping(address => uint) private donations;
  address[] private donors;

  modifier limitWithdraw(uint withdrawAmount) {
    require(
      withdrawAmount <= address(this).balance,
     "Not enough balance in contract"
    );
    _;
  }

  receive() external payable {}

  function addDonation() external override payable {
    address donorAddress = msg.sender;

    if (donations[donorAddress] == 0) {
      donors.push(donorAddress);
    }

    donations[donorAddress] += msg.value;

    log("New donation received");
  }

  function withdraw(uint withdrawAmount) override external onlyOwner limitWithdraw(withdrawAmount) {

    require(address(this).balance >= withdrawAmount, "Not enough balance in contract");
    payable(msg.sender).transfer(withdrawAmount);

    log("Withdrawal executed");
  }

  function withdrawAll() override external onlyOwner {
    payable(msg.sender).transfer(address(this).balance);

    log("All funds withdrawn");
  }

  function getAllDonors() external view returns (address[] memory) {
    return donors;
  }

  function getDonationForCaller() external view returns (uint) {
    return donations[msg.sender];
  }

  function getAllDonations() external view returns (DonationInfo[] memory) {
    DonationInfo[] memory result = new DonationInfo[](donors.length);

    for (uint i = 0; i < donors.length; i++) {
      result[i] = DonationInfo({
        donor: donors[i],
        amount: donations[donors[i]]
      });
    }

    return result;
  }
}