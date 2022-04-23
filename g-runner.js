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

// create new output file
fs.writeFileSync('report.csv', '', {flag: 'w'});

const writeNewHeader = (skipLines = 0, summaryText ='') => {
  const colHeadings = expectedKeys.join(',') + '\n';
  const output = '\n'.repeat(skipLines+1) + summaryText + '\n' + colHeadings;
  fs.writeFileSync('report.csv', output, {flag: 'a'});
}

const resetContractCount = () => {
  numContracts = 0;
}


const resetCounter = () => {
  counter = {
    total: 0,
    "#Contracts": ++numContracts
  }
}

const recordCount = () => {
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
      case 'header':
        writeNewHeader(3, m.summary || '"new series"');
        resetContractCount();

        process.send({cmd: 'header:ack'});
        break;

      case 'count':
        console.log('CHILD: initialize ganache');
        resetCounter();

        process.send({cmd: 'count:ack'});
        break;

      case 'save':
        console.log('CHILD: save ganache count');
        recordCount();

        process.send({cmd: 'save:ack'});
        break;
        
      case 'finish':
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
