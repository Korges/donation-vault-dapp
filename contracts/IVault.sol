// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


interface IVault {
  function addDonation() external payable;
  function withdraw(uint withdrawAmount) external;
  function withdrawAll() external;
}
