const { artifacts, network } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const Pixel = await hre.ethers.getContractFactory("PixelCoin");
  const pixel = await Pixel.deploy();

  await pixel.deployed();

  console.log("pixel deployed to:", pixel.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
