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
const PRIVATE_KEY1 = "a45c8326af663b38275b050dce47830d0831239d6e6a1bbf4c4edb1a979f7a5c";
const PRIVATE_KEY2 = "d4ebfa85e18d2f34c84cd509f37ca7a82c0707d0439ee10ec19ba38420d0989a";
const PRIVATE_KEY3 = "7754c44aa412dcacbd30d1752f9b5d4dd13c93da341cb629faaa17e3856cf1b7";
const PRIVATE_KEY4 = "2047fc8b8d4f3050d2633b4a862c183cfcbdba6e6a26b8d68a6d8c746fa4e092";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: 'ganache',
  networks: {
    hardhat: {},
    ganache: {
      url: "http://127.0.0.1:7545",
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
