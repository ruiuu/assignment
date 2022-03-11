// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault {

    address public immutable token;

    mapping(address => uint256) private _balances;

    constructor(address _token) payable{
        token = _token;
    }

    receive() external payable {}

    fallback() external {}

    function getValue() public view returns(uint256) {
        return address(this).balance;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function deposite(uint256 _amount) public {
        address _address = msg.sender;
        require(ERC20(token).transferFrom(_address, address(this), _amount), "transation failed");
        _balances[_address] += _amount;
    }

    function withdraw(uint256 _amount) public {
        address _address = msg.sender;
        require(_balances[_address] >= _amount, "Vault: amount exceeds balance");
        require(ERC20(token).approve(address(this), _amount), "approve failed");
        require(ERC20(token).transferFrom(address(this), _address, _amount), "transation failed");
        _balances[_address] -= _amount;
    }

}
