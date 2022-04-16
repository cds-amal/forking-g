const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "window twenty cat alone physical foam smoke annual collect pluck educate course";

module.exports = {
  networks: {
    ganache: {
      provider: () => {
        console.log(new Error("Ganache thunked provider").stack);
        return new HDWalletProvider( mnemonic, "http://127.0.0.1:8545");
      },
      network_id: "*",
      confirmations: 0,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};
