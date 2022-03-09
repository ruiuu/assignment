
const { artifacts, network, ethers } = require("hardhat");
const hre = require("hardhat");


async function main() {

    // 合约账户, 学习下 nodejs, 这地址可以写到文本里再动态读取
    let contractAddr = "0x41d9ab2162cfb95487e0fe4d9c26067ce3c2ab4e";
    let [ owner ] = await ethers.getSigners(); // 返回当前的以太账户
    let pixel = await ethers.getContractAt("Pixel", contractAddr, owner);

    console.log("owner余额 ----->", await pixel.balanceOf(owner.address));
    
    // 转账 从 owner 转账到地址 0x401dA964174BF8c870f409103d3bD11601d851a5
    let _to = "0x401dA964174BF8c870f409103d3bD11601d851a5";
    let _amount = 1;

    await pixel.transfer(_to, _amount);

    console.log("owner转账后余额 ----->", await pixel.balanceOf(owner.address));
    console.log("_to余额 ----->", await pixel.balanceOf(_to));
    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });