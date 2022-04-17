const { spawnSync } = require('child_process');
const fs = require("fs");
const path = require("path");

let contracts = 0;
const buildDir =  path.join(__dirname, "build");

// const truffleCmd = '/home/amal/.nvm/versions/node/v16.14.2/bin/truffle';
const truffleCmd = '/home/amal/work/truffle/packages/core/cli.js';

const cleanBuildArtifacts = () => {
  if (fs.existsSync(buildDir)){
    fs.rmdirSync(path.join(__dirname, "build"), { recursive: true});
  }
}

const runTruffle = () => {
  cleanBuildArtifacts();
  spawnSync(truffleCmd, ['migrate', '--network', 'ganache', '--to', `${++contracts}`]);
}

const main = async () => {
  const cp = require('child_process');
  const n = cp.fork(`${__dirname}/g-runner.js`);

  n.on('message', (m) => {
    console.log('PARENT got message:', m);
    switch (m.cmd) {
      case 'start_ack':
        runTruffle();
        n.send({ cmd: "report" });
        break;

      case 'report_ack':
        if (contracts === 25) {
          n.send({ cmd: "shutdown" });
        } else {
          n.send({ cmd: "start" });
        }
        break;

      default:
        console.log("unknown message");
    }
  });
  n.send({ cmd: 'start' });
}

main().then(() => console.log('done'))
