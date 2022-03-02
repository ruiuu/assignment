// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title 银行
 * @dev 作业: 接受ETH & 记录转账金额 & withdraw 提取所有的ETH
 *      附加功能: token发行 & 账户管理 & 转账
 */

contract math {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(a >= b);
        return a - b;
    }
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a && c >= b, "warn");
        return c;
    }
}

contract Bank is math{

    // 初始化所有 storage 变量
    string public name; // token 名称
    string public symbol; // token 图标   
    uint256 public totalSupply; // token 总供应量
    address public owner; // 所有者

    // 创建一个包含token余额的数组
    mapping(address => uint256) public balanceOf;
    // 创建一个包含所有 ETH 转账记录的数组
    mapping(address => uint256) public trasferOfEth;

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 initialSupple
    ) {
        name = tokenName;
        symbol = tokenSymbol;
        totalSupply = initialSupple;
        owner = msg.sender;
        balanceOf[msg.sender] = totalSupply;
    }

    // 可以接受以太币
    receive() external payable {
        // 地址有值累加, 无值就赋值
        if (trasferOfEth[msg.sender] > 0) {
            trasferOfEth[msg.sender] += msg.value;
        }else {
            trasferOfEth[msg.sender] = msg.value;
        }
    }

    // 回退函数
    fallback() external {}

    // token 转账
    function transfer(address payable _to, uint256 _value) external {
        require(_value > 0);
        require(balanceOf[msg.sender] > _value);
        require(balanceOf[_to] + _value > balanceOf[_to]);
        balanceOf[msg.sender] = math.sub(balanceOf[msg.sender], _value);
        balanceOf[_to] = math.add(balanceOf[_to], _value);
    }

    // ETH 相关
    // 提取合约所有 ETH
    function withdraw(address payable _to) external {
        require(owner == _to, "you are not owner");
        _to.transfer(address(this).balance);
    }
    // 获取地址的 ETH 余额
    function getBalance(address _from) external view returns(uint) {
        return address(_from).balance;
    }
    // 获取合约的 ETH 余额
    function getContractBalance() external view returns(uint) {
        return address(this).balance;
    }   
   
    // 公共函数(public)
    
    // 内部(internal)

    // 私有(private)
   
}

