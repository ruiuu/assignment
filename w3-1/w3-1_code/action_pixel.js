
const { artifacts, network, ethers } = require("hardhat");
const hre = require("hardhat");


async function main() {

    // 合约账户
    let contractAddr = "0x2F555d0484953C7ED9E7367BAeB4a512F5b9cee2";
    let [ owner, account1, account2 ] = await ethers.getSigners(); 
    let pixel = await ethers.getContractAt("PixelCoin", contractAddr, account1);
    
    // 由于初始发行量为0, 所以要预挖币10000
    //await pixel.mint(owner.address, 10000);
    console.log("owner余额 ----->", await pixel.balanceOf(owner.address));
    console.log("account1 余额 ----->", await pixel.balanceOf(account1.address));
    
    // account1 授权合约 使用自己的 1000 币
    await pixel.approve(account1.address, 1000);

    console.log("account1 授权余额 ----->", await pixel.allowance(account1.address, account1.address));

    // account1 转账给 account2
    await pixel.transferFrom(account1.address, account2.address, 500);
    
    //直接转账给
    //await pixel.transfer(_to, _amount);

    console.log("account1 转账后余额 ----->", await pixel.balanceOf(account2.address));
    console.log("account2 余额 ----->", await pixel.balanceOf(account2.address));
    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });