// SPDX-License-Identifier: MIT
pragma solidity >=0.4.135 <0.9.0;

contract SimpleStorage13 {
  uint storedData;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}