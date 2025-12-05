// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ISimpleBank.sol";


contract SimpleBank is ISimpleBank {

  // Admin address
  address public admin;

  /*
  ============================================================
  STATE VARIABLES
  ============================================================
  */

  mapping(address => uint) private balances;
  address[] private depositors;

  /*
  ============================================================
  EVENTS
  ============================================================
  */

  event Deposit(address indexed user, uint256 amount);
  event Withdraw(address indexed user, uint256 amount);

  /*
  ============================================================
  STRUCTS 
  ============================================================
  */

  struct UserBalance {
    address user;
    uint balance;
  }

  /*
  ============================================================
  MODIFIERS
  ============================================================
  */

  /*
  ============================================================
  CONSTRUCTOR
  ============================================================
  */

  constructor() {
    admin = msg.sender; // set contract deployer as admin
  }

  /*
  ============================================================
  RECEIVE & FALLBACK HANDLING
  ============================================================
  */

  receive() external payable {
    revert("Use deposit() to send ETH");
  }

  fallback() external payable {
    revert("Invalid function call");
  }

  /*
  ============================================================
  CORE FUNCTIONS
  ============================================================
  */

  function deposit() external override payable {
    address depositor = msg.sender;

    if (balances[depositor] == 0) {
      depositors.push(depositor);
    }

    balances[depositor] += msg.value;

    emit Deposit(depositor, msg.value);
  }

  function withdraw(uint withdrawAmount) external override {
    require(withdrawAmount > 0, "Amount must be greater than 0");
    require(withdrawAmount <= balances[msg.sender], "Insufficient Balance");
    require(withdrawAmount <= address(this).balance, "Not enough balance in contract");

    balances[msg.sender] -= withdrawAmount;

    (bool success, ) = payable(msg.sender).call{value: withdrawAmount}("");
    require(success, "Transfer failed");

    emit Withdraw(msg.sender, withdrawAmount);
  }

  /*
  ============================================================
  VIEW FUNCTIONS
  ============================================================
  */

  function getBalance() external view returns (uint) {
    return balances[msg.sender];
  }

  function getContractBalance() external view returns (uint) {
    return address(this).balance;
  }

  function getAllUserBalances() external view returns (UserBalance[] memory) {
    UserBalance[] memory result = new UserBalance[](depositors.length);

    for (uint i = 0; i < depositors.length; i++) {
      result[i] = UserBalance({
        user: depositors[i],
        balance: balances[depositors[i]]
      });
    }

    return result;
  }
}