// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


abstract contract Logger {

  uint public testNum;

  constructor() {
    testNum = 1000;
  }

  function emitLog() public pure virtual returns(bytes32);

}
