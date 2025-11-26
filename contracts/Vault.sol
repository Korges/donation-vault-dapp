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
      withdrawAmount <= 100000000000000000,
      "Cannot withdraw more than 0.1 ether"
    );
    _;
  }

  event Funder(address indexed user, uint amount);
  event Withdrawal(address indexed user, uint amount);

  receive() external payable {}

  function emitLog() public override pure returns(bytes32) {
    return "Hello World";
  }

  function addDonation() external override payable {
    address funder = msg.sender;

    if (donations[msg.sender] == 0) {
      donors.push(msg.sender);
    }

    donations[msg.sender] += msg.value;

    emit Funder(funder, msg.value);
  }

  function withdraw(uint withdrawAmount) override external limitWithdraw(withdrawAmount) {

    require(address(this).balance >= withdrawAmount, "Not enough balance in contract");
    payable(msg.sender).transfer(withdrawAmount);

    emit Withdrawal(msg.sender, withdrawAmount);
  }

  function getAllFunders() external view returns (address[] memory) {
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