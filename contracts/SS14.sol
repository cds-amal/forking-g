// SPDX-License-Identifier: MIT
pragma solidity >=0.4.145 <0.9.0;

contract SimpleStorage14 {
  uint storedData;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
