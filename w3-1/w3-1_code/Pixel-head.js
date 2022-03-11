import { Component } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  Card,
  Avatar,
  Space,
  InputNumber,
} from "antd";
const { Meta } = Card;
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { ethers } from "ethers";

let desiredNetwork = "3";

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const initEthersProvider = (_this) => {
  // provider 实例化, 链接 ganache 测试网络
  const ropstenProvider = new ethers.providers.Web3Provider(window.ethereum);
  //const ropstenProvider = new web3.providers.HttpProvider('http://localhost:8545');
  const signer = ropstenProvider.getSigner();

  // 更新 ropstenProvider
  _this.data.ropstenProvider = new ethers.providers.Web3Provider(
    window.ethereum
  );
  _this.data.signer = signer;
  // 地址余额查询
  ropstenProvider.getBalance(_this.data.currentAddress).then((balance) => {
    // 余额是 BigNumber (in wei); 格式化为 ether 字符串
    let ethBalance = ethers.utils.formatEther(balance);
    _this.setState({
      ethBalance,
    });
  });
};

const initContract = ({ data }) => {
  // 使用Provider 连接合约，将只有对合约的可读权限
  let contract = new ethers.Contract(
    data.contractAddress,
    data.abi,
    data.ropstenProvider
  );
  // 使用签名器创建一个新的合约实例，它允许使用可更新状态的方法
  let contractWithSigner = contract.connect(data.signer);
  //赋值到组件内
  data.contract = contract;
  data.contractWithSigner = contractWithSigner;
};

// const mint = async (_this) => {
//   let { contractWithSigner, currentAddress, contract } = _this.data;
//   let startMint = await contractWithSigner.transfer(
//     currentAddress,
//     1
//   );
//   await startMint.wait();
//   let tokenBalanceOf = await contract.balanceOf(currentAddress);
//   _this.setState({ tokenBalanceOf });
// };

const getContractInfo = async (_this) => {
  let {
    contract,
    currentAddress,
    contractVaultAddr,
    vaultAbi,
    ropstenProvider,
  } = _this.data;
  let tokenName = await contract.name();
  let tokenSymbol = await contract.symbol();
  let tokenDecimals = await contract.decimals();
  let tokenTotalSupply = await contract.totalSupply();
  let tokenBalanceOf = await contract.balanceOf(currentAddress);
  let allowance = await contract.allowance(currentAddress, contractVaultAddr);

  let contractOfVault = new ethers.Contract(
    contractVaultAddr,
    vaultAbi,
    ropstenProvider
  );
  let balanceOfVault = await contractOfVault.balanceOf(currentAddress);

  console.log("balance", balanceOfVault);
  console.log("allowance", ethers.utils.formatEther(allowance));
  _this.setState({
    tokenName,
    tokenSymbol,
    tokenDecimals,
    tokenTotalSupply: ethers.utils.formatEther(tokenTotalSupply),
    tokenBalanceOf: ethers.utils.formatEther(tokenBalanceOf),
    isApproved: ethers.utils.formatEther(allowance) > 0,
    balanceOfVault: ethers.utils.formatEther(balanceOfVault),
  });
};

class PixelHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      ethBalance: 0,
      tokenName: "",
      tokenSymbol: "",
      tokenDecimals: 0,
      tokenTotalSupply: 0,
      tokenBalanceOf: 0,
      // vault
      isApproved: false,
      balanceOfVault: 0,
      depositeLoading: false,
      withdrawLoading: false,
    };
    this.data = {
      amount: null,
      ropstenProvider: null,
      contract: null,
      signer: null,
      contractWithSigner: null,
      //当前metamask 对象地址
      currentAddress: "",
      contractAddress: "0x67ae686ffc256c8dfbe8ad5457244c15cedc147e",
      contractVaultAddr: "0x4cfad9b94bc76e4d3e2a747d2b6afb97c2d89042",
      abi: [
        "function name() public view returns (string memory)",
        "function symbol() public view returns (string memory)",
        "function decimals() public view returns (uint8)",
        "function totalSupply() public view returns (uint256) ",
        "function balanceOf(address account) public view returns (uint256)",
        "function allowance(address owner, address spender) public view returns (uint256)",
        "function approve(address spender, uint256 amount) public returns (bool)",
        "function transferFrom(address from,address to,uint256 amount) public returns (bool)",
        "function transfer(address to, uint256 amount) public returns (bool) ",
      ],
      vaultAbi: [
        "function balanceOf(address account) public view returns (uint256)",
        "function deposite(uint256 _amount) public ",
        "function withdraw(uint256 _amount) public",
      ],
    };
  }

  handleClick() {
    let _this = this;

    if (typeof window.ethereum === "undefined") {
      Modal.warning({
        title: "看起来你需要一个Dapp浏览器来开始",
        content: "请安装 MetaMask!",
      });
      return;
    }
    ethereum
      .request({ method: "eth_requestAccounts" })
      .catch()
      .then(function (accounts) {
        console.log("accounts", accounts);
        if (ethereum.networkVersion !== desiredNetwork) {
          Modal.warning({
            title: "",
            content: "APP 当前仅支持 Ropsten 测试网络 ,请选择Ropsten进行测试",
          });
          return;
        }
        let account = accounts[0];
        _this.data.currentAddress = account;
        initEthersProvider(_this);
        initContract(_this);
        getContractInfo(_this);
        // 截断地址, 更新到 state
        _this.setState({
          account: `${account.substr(0, 6)}...${account.substr(
            account.length - 4
          )}`,
        });
      });
  }
  async handleTransfer(values) {
    let _this = this;
    const { toAddress, amount, onlineDeposit } = values;
    const { contractWithSigner, contractAddress } = this.data;

    // 获取授权
    if (_this.state.isApproved) {
      let approve = await contractWithSigner.approve(contractAddress, 1000);
      let bools = await approve.wait();
      _this.setState({ isApproved: true });
    } else {
      let contract = new ethers.Contract(
        _this.data.contractVaultAddr,
        _this.data.vaultAbi,
        _this.data.ropstenProvider
      );
      // 使用签名器创建一个新的合约实例，它允许使用可更新状态的方法
      let contractWithSigner = contract.connect(_this.data.signer);
      let transaction = await contractWithSigner.deposite(
        currentAddress,
        contractVaultAddr
      );
      let transactionResult = await transaction.wait();
      if (transactionResult) {
        Modal.success({
          title: "恭喜您",
          content: "转账成功",
        });
      }
    }
  }
  async handleDeposite() {
    let _this = this;
    const {
      contractWithSigner,
      contractAddress,
      currentAddress,
      contractVaultAddr,
      vaultAbi,
      ropstenProvider,
      signer,
    } = this.data;

    if (!currentAddress) {
      Modal.warning({
        title: "看起来你还没有连接钱包",
        content: "请连接 metaMask 钱包",
      });
      return;
    }

    // loading
    this.setState({ depositeLoading: true });

    // 如果没授权, 进行授权
    if (!_this.state.isApproved) {
      let approve = await contractWithSigner.approve(contractVaultAddr, 1000);
      let result = await approve.wait();
      if (result) {
        _this.setState({ isApproved: true, depositeLoading: false });
      }
    } else {
      // 开始转账, 实例化contract
      let contract = new ethers.Contract(
        contractVaultAddr,
        vaultAbi,
        ropstenProvider
      );
      // contract 连接签名者
      let contractWithSigner = contract.connect(signer);
      // 执行 deposite
      let transaction = await contractWithSigner.deposite(this.state.amount);
      let balanceOfVault = await contract.balanceOf(currentAddress);
      let result = await transaction.wait();
      if (result) {
        _this.setState({
          depositeLoading: false,
          balanceOfVault: ethers.utils.formatEther(balanceOfVault),
        });
      }
      console.log(result);
    }
  }
  async handleWithdraw() {
    const { currentAddress, contractVaultAddr, vaultAbi, ropstenProvider } =
      this.data;
    if (!currentAddress) {
      Modal.warning({
        title: "看起来你还没有连接钱包",
        content: "请连接 metaMask 钱包",
      });
      return;
    }

    this.setState({ withdrawLoading: true });

    // 开始转账, 实例化contract
    let contract = new ethers.Contract(
      contractVaultAddr,
      vaultAbi,
      ropstenProvider
    );
    // contract 连接签名者
    let contractWithSigner = contract.connect(signer);
    // 执行 deposite
    let transaction = await contractWithSigner.withdraw(this.state.amount);
    let balanceOfVault = await contract.balanceOf(currentAddress);
    let result = await transaction.wait();
    if (result) {
      _this.setState({
        depositeLoading: false,
        balanceOfVault: ethers.utils.formatEther(balanceOfVault),
      });
    }
    console.log(result);
  }
  componentDidMount() {}
  // handleMint() {
  //   let _this = this;
  //   if (!_this.data.currentAddress) {
  //     Modal.warning({
  //       title: "看起来你还没有连接钱包",
  //       content: "请连接 metaMask 钱包",
  //     });
  //     return;
  //   }
  //   mint(_this);
  // }
  render() {
    return (
      <>
        <Row>
          <Col span={8}>
            <h1>Pixel</h1>
          </Col>
          <Col
            span={8}
            offset={8}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              type="primary"
              shape="round"
              onClick={() => this.handleClick()}
            >
              {this.state.account.startsWith("0x")
                ? this.state.account
                : "连接钱包"}
            </Button>
          </Col>
        </Row>
        <Row style={{ display: "flex", justifyContent: "center" }}>
          <Col style={{ margin: "20px" }}>
            <Card
              style={{ width: 300 }}
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={this.state.account || "未连接钱包"}
                description={this.state.account ? "已连接" : "未连接"}
              />
              <div style={{ marginTop: "25px" }}>
                <p>Token名称: {this.state.tokenName}</p>
                <p>Token符号: {this.state.tokenSymbol}</p>
                <p>Token精度: {this.state.tokenDecimals}</p>
                <p>Token发行量: {this.state.tokenTotalSupply}</p>
                <p>我的 ETH 余额: {this.state.ethBalance}</p>
                <p>我的 PXL 余额: {this.state.tokenBalanceOf}</p>
              </div>
              {/* <Button
                type="primary"
                htmlType="submit"
                onClick={() => this.handleMint()}
              >
                挖矿
              </Button> */}
            </Card>
          </Col>
          <Col style={{ margin: "20px" }}>
            <Card style={{ width: 380 }} title="Vault合约">
              <div>
                <div>当前余额 : {this.state.balanceOfVault}</div>
                <div>
                  <label>存入金额 : </label>
                  <InputNumber onChange={(v) => this.setState({ amount: v })} />
                </div>
                <div>
                  <Space style={{ width: "100%", marginTop: "20px" }}>
                    <Button
                      type="primary"
                      loading={this.state.depositeLoading}
                      onClick={() => this.handleDeposite()}
                    >
                      {this.state.isApproved ? "Deposite" : "Approve"}
                    </Button>
                    <Button
                      type="primary"
                      loading={this.state.withdrawLoading}
                      onClick={() => this.handleWithdraw()}
                    >
                      Withdraw
                    </Button>
                  </Space>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default PixelHead;
