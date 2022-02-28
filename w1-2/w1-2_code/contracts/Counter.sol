// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract  Counter {
    uint public counter;
    
    constructor(uint num) {
        counter = num;
    }

    function count() public {
        counter = counter + 1;
        console.log("current counter", counter);
    }
    function getCounter() public view returns (uint) {
        return counter;
    }

}