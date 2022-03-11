const { artifacts, network } = require("hardhat");
const hre = require("hardhat");
const ethers = require("ethers");
const web3 = require("ethers");

async function main() {
  // provider 实例化, 链接 ganache 测试网络
  let url = "http://127.0.0.1:7545";
  let customHttpProvider = new ethers.providers.JsonRpcProvider(url);

  let address = "0xF86D13196DDC344C4b8b25AE21a1F394274419B0";
  customHttpProvider.getBalance(address).then((balance) => {
    // 余额是 BigNumber (in wei); 格式化为 ether 字符串
    let etherString = ethers.utils.formatEther(balance);

    console.log("Balance: " + etherString);
  });

  // 通过私钥实例化一个钱包
//   const wallet = new ethers.Wallet(
//     "a45c8326af663b38275b050dce47830d0831239d6e6a1bbf4c4edb1a979f7a5c"
//   );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
