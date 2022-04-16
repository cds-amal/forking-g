const Ganache = require("ganache");
const { spawn, spawnSync } = require('child_process');



let logger = "";
const mnemonic = "window twenty cat alone physical foam smoke annual collect pluck educate course";
const controller = new AbortController();
const { signal } = controller;
const ganache = spawn('ganache', ['-m', mnemonic, '-p', '8545' ], { signal });

const expectedKeys = [
  'total',
  'net_version',
  'eth_sendRawTransaction',
  'eth_getTransactionReceipt',
  'eth_getTransactionCount',
  'eth_getTransactionByHash',
  'eth_getCode',
  'eth_getBlockByNumber',
  'eth_getBalance',
  'eth_gasPrice',
  'eth_estimateGas',
  'eth_chainId',
  'eth_blockNumber',
];

ganache.on('error', (err) => { });
ganache.stdout.on('data', data => { logger += data; });
ganache.stdout.on('end', () => {
  console.log("RIP");
  // console.log(logger);
  counter = {total: 0};
  rex = /^[a-z]+_/;
  for (const line of logger.split('\n')) {
    if (rex.test(line)) {
      counter[line.trim()] = (counter[line.trim()] || 0) + 1;
      counter.total += 1;
    }
  };

  console.log(expectedKeys.join(","));
  let csvData = [];
  for(let i=0; i<expectedKeys.length; i++) {
    csvData.push(counter[expectedKeys[i]]);
  }
  console.log(csvData.join(','));
});

spawnSync('rm', ['-rf', 'build']);
const res = spawnSync('/home/amal/.nvm/versions/node/v16.14.2/bin/truffle', ['migrate', '--network', 'ganache', '--to', '1']);

// setTimeout(() => controller.abort(), 5000);
controller.abort();
