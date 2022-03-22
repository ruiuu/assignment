const { artifacts, network, ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
	// 合约账户
	let contractAddr = "0x6B79E714504E5d3E02FdEaa6eE9c2442aBB871A9";
	let [owner, account1, account2, account3, account4, account5, account6, account6, account6, account6] =
		await ethers.getSigners();
	let pixelNFT = await ethers.getContractAt("PixelNFT", contractAddr, owner);

	// console.log("拥有者 ==> ", await pixelNFT.owner());

	await pixelNFT.safeMint(account1.address);
	await pixelNFT.safeMint(account2.address);
	await pixelNFT.safeMint(account3.address);
	await pixelNFT.safeMint(account4.address);
	await pixelNFT.safeMint(account5.address);

	//pixelNFT.transferFrom(address_2, address_6, 1);

	console.log(account1.address + "的 nft 为 =====> ", await pixelNFT.balanceOf(account1.address));
	//console.log("address_1 的 nft 为 =====> ", await pixelNFT.ownerOf(1));
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
