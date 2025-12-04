// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


interface ISimpleBank {
  function deposit() external payable;
  function withdraw(uint withdrawAmount) external;
}
