WIP: an easier-ish way to test different truffle profiles against Ganache

add conracts

```bash
for i in {3..25}
do
  cmd="s:2:$i:" 
  sed "$cmd" contracts/SS2.sol > contracts/SS$i.sol
  sed "$cmd" migrations/2_ss.js > migrations/${i}_ss.js
done
```
## Run it

You'll have to modify the `run.js` to an appropriate truffle location for your env.

1. `npm ci`
1. `node run`

If all goes well, a `report.csv` will be in the cwd.
