// SPDX-License-Identifier: MIT
pragma solidity >=0.4.35 <0.9.0;

contract SimpleStorage3 {
  uint storedData;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
