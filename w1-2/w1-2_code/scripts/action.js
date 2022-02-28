
const { artifacts, network, ethers } = require("hardhat");
const hre = require("hardhat");


async function main() {
    let addr = "0x52d7270a26001e7Ca0846cc57cf0a3C1c360290C";
    let [ owner ] = await ethers.getSigners();
    let counter = await ethers.getContractAt("Counter", addr, owner);

    await counter.count();
    console.log("counter.getCounter()",await counter.getCounter());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });