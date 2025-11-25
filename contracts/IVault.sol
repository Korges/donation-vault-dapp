// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// they cannot inherit from other smart contracts
// they can only inherit from other interfaces

// They cannot declare a constructor
// They cannot declare state variables
// all declared functions have to be external

interface IVault {
  function addFunds() external payable;
  function withdraw(uint withdrawAmount) external;
}
