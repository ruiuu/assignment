require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const fs = require("fs");
const mnemonic = fs.readFileSync(".secret").toString().trim();

// ganache
const PRIVATE_KEY1 = "877b9b753b84a8ca9e5c7064a7865c8dd15a74d720b2e6e847588cc36ba0cf7f";
const PRIVATE_KEY2 = "84188fed521afc16bc1b5d481c3e6fee13f6dff9d238561a84405e7764637ef0";
const PRIVATE_KEY3 = "06b2fcf0a4e71673c16c79dd12158492d5ed58d71c578305bf7c6ecc6470c668";
const PRIVATE_KEY4 = "4ad9036807340d40a81eab50af736084df090bd8c1974231673d2bf577a92c77";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: 'ganache',
  networks: {
    hardhat: {
    },
    ganache: {
      url: "http://127.0.0.1:8545",
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2, PRIVATE_KEY3, PRIVATE_KEY4]
    },
    goerli: {
      url: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      chainId: 5,
      gas: "auto",
      gasPrice: "auto",
      accounts: {
        mnemonic,
      },
    },
  },
};
