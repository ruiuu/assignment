// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Score {

    address private owner;

    struct Student {
        string name;
        uint score;
    }

    struct Teach {
        string name;
        bool isValid;
    }

    mapping(address => Student) public students;

    mapping(address => Teach) public teachers;

    constructor() {
        owner = msg.sender;
        teachers[msg.sender].name = "wang laoshi";
        teachers[msg.sender].isValid = true;

        // students[0x91bFf9378FEf62FbF22f02322b6DA5CAc87BB786].name = "xiaoming";
        // students[0x91bFf9378FEf62FbF22f02322b6DA5CAc87BB786].score = 100;
    }

    modifier onlyTeacher{
        require(teachers[tx.origin].isValid, "is not teacher");
        _;
    }

    modifier scoreLimit(uint _score){
        require(_score <= 100 && _score >= 0, "score cannot be 100+");
        _;
    }

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function changeOwner(address newOwner) public isOwner {
        owner = newOwner;
    }

    function addTeacher(address _address, string memory _name) public isOwner {
        Teach memory _teacher;
        _teacher.name = _name;
        _teacher.isValid = true;
        teachers[_address] = _teacher;
    }

    function deleteTeacher(address _address) public isOwner {
        delete teachers[_address];
    }

    function addStudent(address _address, string memory _name, uint _score) public onlyTeacher scoreLimit(_score) {
        Student memory student;
        student.name = _name;
        student.score = _score;
        students[_address] = student;
    }

    function deleteStudent(address _address) public onlyTeacher {
        delete students[_address];
    }

    function updateStudentScore(address _address, uint _score) public onlyTeacher scoreLimit(_score){
        students[_address].score = _score;
    }

}