import { ethers } from "hardhat";

async function main() {
    // 首先部署 mytoken 合约
    // const MyToken = await ethers.getContractFactory("MyToken");
    // const myToken = await MyToken.deploy();
    // await myToken.deployed();

    // // myToken contract address: 0x66492BDa2D42df8e319dF9a950DC86BDD3314C35
    // console.log("myToken deployed to:", myToken.address);

    // 部署 WETH9 合约
    // const WETH9 = await ethers.getContractFactory("WETH9");
    // const weth9 = await WETH9.deploy();
    // await weth9.deployed();

    // // myToken contract address: 0x66492BDa2D42df8e319dF9a950DC86BDD3314C35
    // console.log("weth deployed to:", weth9.address);

    // 部署 factory 合约
    // const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory01");
    // const router = await UniswapV2Factory.deploy("0x88Cece37468106ab0f4c9060959788367f14d0cd");
    // await router.deployed();
    // 地址:
    // console.log("router deployed to:", router.address);

    const routerAddr = "0x28AEaebCAf78cE60a0B8AC3f495Ef34C3A74b535";
    const factoryAddr = "0x7deBE627C5D55430E5880e719038c456c31304C9";
    const wethAddr = "0x8f2fcfff52087dE0224fD1bE8BfEC9F6ac480984";
    const myTokenAddr = "0x66492BDa2D42df8e319dF9a950DC86BDD3314C35";

    // 部署 router 合约
    // const Router = await ethers.getContractFactory("Router");
    // const router = await Router.deploy(factoryAddr, wethAddr);
    // await router.deployed();
    // // 地址:
    // console.log("router deployed to:", router.address);

    // 部署 myTokenMarket 合约

    // const MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
    // const tokenMarket = await MyTokenMarket.deploy(myTokenAddr,routerAddr,wethAddr);
    // await tokenMarket.deployed();

    const marketAddr = "0xa59EFD36AD897b133dAbFc975a5c8F155255BF8F";
    let [owner, account1] = await ethers.getSigners();
    let myToken = await ethers.getContractAt("MyToken", myTokenAddr, owner);
    let market = await ethers.getContractAt("MyTokenMarket", marketAddr, owner);

    let aAmount = ethers.utils.parseUnits("100000", 18);

    await myToken.approve(market.address, ethers.constants.MaxUint256);

    let ethAmount = ethers.utils.parseUnits("100", 18);
    await market.addLiquidity(aAmount, { value: ethAmount })
    console.log("添加流动性");

    let balance01 = await myToken.balanceOf(owner.address);
    console.log("持有token:" + ethers.utils.formatUnits(balance01, 18));

    let buyEthAmount = ethers.utils.parseUnits("10", 18);
    let out = await market.buyToken("0", { value: buyEthAmount })

    let balance02 = await myToken.balanceOf(owner.address);
    console.log("购买到:" + ethers.utils.formatUnits(balance02, 18));

    console.log("tokenMarket deployed to:", market.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
