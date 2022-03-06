const { artifacts, network, ethers } = require("hardhat");
const hre = require("hardhat");


async function main() {
    let addr = "0x52d7270a26001e7Ca0846cc57cf0a3C1c360290C";
    let [ owner ] = await ethers.getSigners();
    let score = await ethers.getContractAt("Score", addr, owner);
    let teacher = await ethers.getContractAt("Teacher", addr, owner);
 

    await teacher.callScoreForUpdateStudentScore("0x5FbDB2315678afecb367f032d93F642f64180aa3", "0x91bFf9378FEf62FbF22f02322b6DA5CAc87BB786", 80);

    console.log("teacher.callScoreForUpdateStudentScore() success", await score.students["0x91bFf9378FEf62FbF22f02322b6DA5CAc87BB786"]);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });