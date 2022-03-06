// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Teacher {

    address private owner;

    constructor() {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    function changeOwner(address newOwner) public isOwner {
        owner = newOwner;
    }

    function getMsg() external view returns (address) {
        return msg.sender;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function callScoreForAddStudent(address _address, address _studentAdress, string memory _name, uint _score) public isOwner{
        (bool res,) = _address.delegatecall(abi.encodeWithSignature("addStudent(address,string,uint256)", _studentAdress, _name, _score));
        if (!res) revert();
    }

    function callScoreForDeleteStudent(address _address, address _studentAdress) public isOwner{
        (bool res,) = _address.delegatecall(abi.encodeWithSignature("deleteStudent(address)", _studentAdress));
        if (!res) revert();
    }

    function callScoreForUpdateStudentScore(address _scoreAddress, address _address, uint _score) public isOwner{
        (bool res,) = _scoreAddress.delegatecall(abi.encodeWithSignature("updateStudentScore(address,uint256)",_address,_score));
        if (!res) revert();
    }

}