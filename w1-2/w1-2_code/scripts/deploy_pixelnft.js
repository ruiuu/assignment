const { artifacts, network } = require("hardhat");
const hre = require("hardhat");

async function main() {

  const PixelNFT = await hre.ethers.getContractFactory("PixelNFT");
  const pixelNFT = await PixelNFT.deploy();

  await pixelNFT.deployed();

  console.log("pixelNFT deployed to:", pixelNFT.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
