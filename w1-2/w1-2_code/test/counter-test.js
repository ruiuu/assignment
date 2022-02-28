const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  it("Should return the new count number", async function () {

    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy(10);
  
    await counter.count();

    assert.equal(await counter.getCounter(), 11);
    expect(await counter.getCounter()).to.equal(11);
  });
});