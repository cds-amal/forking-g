const { spawnSync } = require('child_process');
const fs = require("fs");
const path = require("path");

let contracts = 0;
const buildDir =  path.join(__dirname, "build");
const RUNS = 25;

const truffleProd = '/home/amal/.nvm/versions/node/v16.14.2/bin/truffle';
const truffleDev = '/home/amal/work/truffle/packages/core/cli.js';

const cmds = [truffleProd, truffleDev];

const cleanBuildArtifacts = () => {
  if (fs.existsSync(buildDir)){
    fs.rmdirSync(path.join(__dirname, "build"), { recursive: true});
  }
}

const runTruffle = (cmd) => {
  cleanBuildArtifacts();
  spawnSync(cmd, ['migrate', '--network', 'ganache', '--to', `${++contracts}`], { cwd: path.resolve(__dirname, "..", "dapp")})
}

let cmdIndex = 0;

const main = async () => {
  const cp = require('child_process');
  const n = cp.fork(`${__dirname}/ganache-runner.js`);

  n.on('message', (m) => {
    console.log('PARENT got message:', m);
    switch (m.cmd) {
      case 'header:ack':
        n.send({ cmd: "count" });
        break;

      case 'count:ack':
        const runTime = runTruffle(cmds[cmdIndex]);
        n.send({ cmd: "save" });
        break;

      case 'save:ack':
        if (contracts === RUNS) {
          if (++cmdIndex === cmds.length) {
            n.send({ cmd: "finish" });
          } else {
            n.send({ cmd: 'header', summary: `${cmds[cmdIndex]}` });
            contracts=0
          }
        } else {
          n.send({ cmd: "count" });
        }
        break;

      default:
        console.log("unknown message", m.cmd);
    }
  });
  n.send({ cmd: 'header', summary: `${cmds[cmdIndex]}` });
}

main().then(() => console.log('done'))
