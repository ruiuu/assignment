// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MyTokenMarket {
    using SafeERC20 for IERC20;

    address public myToken;
    address public router;
    address public weth;

    constructor(
        address _token,
        address _router,
        address _weth
    ) {
        myToken = _token;
        router = _router;
        weth = _weth;
    }

    // 需要转入 token 和 eth 交易对
    // 接受 eth 需要定义 payable, 用 receive 也可以
    function addLiquidity(uint256 tokenAmount) external payable {
        IERC20(myToken).safeTransferFrom(msg.sender, address(this), tokenAmount);

        IERC20(myToken).safeApprove(router, tokenAmount);

        IUniswapV2Router01(router).addLiquidityETH{value: msg.value}(myToken, tokenAmount, 0, 0, msg.sender, block.timestamp);
    }

    function buyToken(uint256 minTokenAmount) external payable {
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = myToken;

        IUniswapV2Router01(router).swapExactETHForTokens(minTokenAmount, path, msg.sender, block.timestamp);
    }
}
