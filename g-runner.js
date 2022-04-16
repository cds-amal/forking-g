const fs = require("fs");
const Ganache = require("ganache");
const mnemonic = "window twenty cat alone physical foam smoke annual collect pluck educate course";

let counter;
let numContracts = 0;
const expectedKeys = [
  '#Contracts',
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

fs.writeFileSync(`report.csv`, expectedKeys.join(',') + '\n', {flag: 'w'});

const initializeCounter = () => {
  counter = {
    total: 0,
    "#Contracts": ++numContracts
  }
}

const dumpCount = () => {
  const csv = expectedKeys.map(k => counter[k]).join(',');
  console.log(csv);
  fs.writeFileSync(`report.csv`, csv + '\n', {flag: 'a'});
}

const startGanache = async () => {
  const gOptions = {
    mnemonic,
    logging: {
      quiet: false,
    },
    logger: {
      log: e => {
        counter[e] = (counter[e] || 0) + 1;
        counter.total += 1;
      }
    }
  };
  const g = Ganache.server(gOptions);
  await g.listen(8545);
  return g;
}

const main = async () => {
  const ganache = await startGanache();

  process.on('message', async (m) => {
    switch (m.cmd) {
      case 'start':
        console.log('CHILD: initialize ganache');
        initializeCounter();
        process.send({cmd: 'start_ack'});
        break;

      case 'report':
        console.log('CHILD: report ganache count');
        dumpCount();
        process.send({cmd: 'report_ack'});
        break;
        
      case 'shutdown':
        console.log('CHILD: got shutdown');
        await ganache.close();
        process.exit(0);
        break;

      default:
        console.log('CHILD got message:', m);
    }
  });
}

main().then(() => console.log('done'))
