// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Owned.sol";
import "./Logger.sol";
import "./IVault.sol";

contract Vault is Owned, Logger, IVault {
  uint public numOfFunders;

  mapping(address => bool) private funders;
  mapping(uint => address) private lutFunders;

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

  function addFunds() override external payable {
    address funder = msg.sender;

    if (!funders[funder]) {
      uint index = numOfFunders++;
      funders[funder] = true;
      lutFunders[index] = funder;
      
    }
    emit Funder(msg.sender, msg.value);
  }

  function withdraw(uint withdrawAmount) override external limitWithdraw(withdrawAmount) {

    require(address(this).balance >= withdrawAmount, "Not enough balance in contract");
    payable(msg.sender).transfer(withdrawAmount);

    emit Withdrawal(msg.sender, withdrawAmount);
  }

  function getAllFunders() external view returns (address[] memory) {
    address[] memory _funders = new address[](numOfFunders);

    for (uint i = 0; i < numOfFunders; i++) {
      _funders[i] = lutFunders[i];
    }

    return _funders;
  }

  function getFunderAtIndex(uint8 index) external view returns(address) {
    return lutFunders[index];
  }
}