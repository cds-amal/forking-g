WIP: an easier-ish way to test different truffle profiles against Ganache

add conracts

## Run it

You'll have to modify the `run.js` to an appropriate truffle location for your env.

1. `npm ci`
1. `node src`

If all goes well, a `report.csv` will be in the project root folder.

## Notes

Maybe some useful notes?

### Scaffold a truffle project

1. Start with init
   `truffle init`
1. Remove Migrations
   ```
   rm contracts/Migrations.sol
   rm migrations/1_initial_migration.js
   ```
1. Create simple contract
   ```
   cat << EOF > contracts/SS1.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.9.0;

contract SimpleStorage1 {
  uint storedData;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
EOF
   ```
1. Create corresponding migraton file
   ```
cat << EOF > migrations/1_ss.js
const SS = artifacts.require("SimpleStorage1");
module.exports = function(deployer) { deployer.deploy(SS); };
EOF
   ```
1. Add contracts and deployments
   ```bash
   for i in {2..25}; do
     cmd="s:SimpleStorage1:SimpleStorage$i:" 
     sed "$cmd" contracts/SS1.sol > contracts/SS${i}.sol
     sed "$cmd" migrations/1_ss.js > migrations/${i}_ss.js
    done
   ```
