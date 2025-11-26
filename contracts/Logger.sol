// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


abstract contract Logger {

  event LogMessage(address indexed sender, string message);

  function log(string memory message) internal {
    emit LogMessage(msg.sender, message);
  }

}
