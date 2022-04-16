// SPDX-License-Identifier: MIT
pragma solidity >=0.4.215 <0.9.0;

contract SimpleStorage21 {
  uint storedData;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}