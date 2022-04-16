// SPDX-License-Identifier: MIT
pragma solidity >=0.4.155 <0.9.0;

contract SimpleStorage15 {
  uint storedData;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
