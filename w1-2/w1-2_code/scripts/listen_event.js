const { ethers } = require("hardhat");
const { insertEventData, deleteEventData, selectAll } = require("./sql/event_sql");

async function main() {
  let contractAddr = "0x6B79E714504E5d3E02FdEaa6eE9c2442aBB871A9";
  let [owner, account1, account2] = await ethers.getSigners();
  let pixelNFT = await ethers.getContractAt("PixelNFT", contractAddr, owner);

  let filter = pixelNFT.filters.Transfer();

  // filter 另一种写法
  // let filter = {
  //   address: "0x2F555d0484953C7ED9E7367BAeB4a512F5b9cee2",
  //   topics: [ethers.utils.id("Transfer(address,address,uint256)")],
  // };

  // 获取历史事件
  // filter.fromBlock = 1;
  // filter.fromBlock = 10;
  // // 获取日志
  // let logs = await ethers.provider.getLogs(filter);
  // console.log(logs);

  // 监听事件
  ethers.provider.on(filter, (event) => {
    let { from, to, tokenId } = parseEvent(event);
    // 保存到 SQL数据库
    insertEventData(from, to, tokenId );
  });

  function parseEvent(event) {
    const transferEvent = new ethers.utils.Interface([
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    ]);
    return transferEvent.parseLog(event).args;
  }
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    // process.exit(1);
  });
