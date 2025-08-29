// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./base/PenERC20V2.sol";

contract PenERC20V3 is PenERC20V2 {
    uint public reservePEN;
    uint public reserveETH;

    event MintLP(address indexed sender, uint amountPEN, uint amountETH, uint liquidity);
    event BurnLP(address indexed sender, uint amountPEN, uint amountETH, uint liquidity);
    event Swap(address indexed sender, uint amountIn, string tokenIn, uint amountOut, string tokenOut);

    mapping(address => uint) public lpBalance; // LP 份额
    uint public totalLP; // 总流动性份额


    constructor(string memory name_, string memory symbol_, address owner_) PenERC20V2(name_, symbol_, owner_) {
    }

    // constructor() ERC20("PEN Token", "PEN") {
    //     // _mint(msg.sender, 1_000_000 ether); // 初始发行
    // }

    // ---------------- 工具函数 ----------------
    function min(uint x, uint y) internal pure returns (uint z) {
        z = x < y ? x : y;
    }

    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint amountOut) {
        require(amountIn > 0, "INSUFFICIENT_INPUT");
        require(reserveIn > 0 && reserveOut > 0, "INSUFFICIENT_LIQUIDITY");
        amountOut = amountIn * reserveOut / (reserveIn + amountIn);
    }

    // ---------------- 添加/移除流动性 ----------------
    function addLiquidity(uint amountPEN) external payable returns (uint liquidity) {
        _transfer(msg.sender, address(this), amountPEN);

        if (totalLP == 0) {
            liquidity = sqrt(amountPEN * msg.value);
        } else {
            liquidity = min(
                amountPEN * totalLP / reservePEN,
                msg.value * totalLP / reserveETH
            );
        }
        require(liquidity > 0, "INSUFFICIENT_LIQUIDITY_MINTED");

        reservePEN = balanceOf[address(this)];
        reserveETH = address(this).balance;

        lpBalance[msg.sender] += liquidity;
        totalLP += liquidity;

        emit MintLP(msg.sender, amountPEN, msg.value, liquidity);
    }

    function removeLiquidity(uint liquidity) external returns (uint amountPEN, uint amountETH) {
        require(lpBalance[msg.sender] >= liquidity, "NOT_ENOUGH_LP");

        amountPEN = liquidity * reservePEN / totalLP;
        amountETH = liquidity * reserveETH / totalLP;

        require(amountPEN > 0 && amountETH > 0, "INSUFFICIENT_LIQUIDITY_BURNED");

        lpBalance[msg.sender] -= liquidity;
        totalLP -= liquidity;

        _transfer(address(this), msg.sender, amountPEN);
        payable(msg.sender).transfer(amountETH);

        reservePEN = balanceOf[address(this)];
        reserveETH = address(this).balance;

        emit BurnLP(msg.sender, amountPEN, amountETH, liquidity);
    }

    // ---------------- swap ----------------
    // ETH -> PEN
    function swapETHForPEN(uint amountOutMin) external payable returns (uint amountOut) {
        amountOut = getAmountOut(msg.value, reserveETH, reservePEN);
        require(amountOut >= amountOutMin, "INSUFFICIENT_OUTPUT");

        _transfer(address(this), msg.sender, amountOut);

        reservePEN = balanceOf[address(this)];
        reserveETH = address(this).balance;

        emit Swap(msg.sender, msg.value, "ETH", amountOut, "PEN");
    }

    // PEN -> ETH
    function swapPENForETH(uint amountIn, uint amountOutMin) external returns (uint amountOut) {
        _transfer(msg.sender, address(this), amountIn);

        amountOut = getAmountOut(amountIn, reservePEN, reserveETH);
        require(amountOut >= amountOutMin, "INSUFFICIENT_OUTPUT");

        payable(msg.sender).transfer(amountOut);

        reservePEN = balanceOf[address(this)];
        reserveETH = address(this).balance;

        emit Swap(msg.sender, amountIn, "PEN", amountOut, "ETH");
    }

    // 避免误转 ETH
    receive() external payable {
        revert("USE_SWAP_FUNCTIONS");
    }

    // ------------ look -------------
    // PEN -> ETH 的价格 (1 PEN = ? ETH)
    function getPENPriceInETH() external view returns (uint price) {
        require(reservePEN > 0 && reserveETH > 0, "NO_LIQUIDITY");
        price = reserveETH * 10 ** 18 / reservePEN; 
    }

    // ETH -> PEN 的价格 (1 ETH = ? PEN)
    function getETHPriceInPEN() external view returns (uint price) {
        require(reservePEN > 0 && reserveETH > 0, "NO_LIQUIDITY");
        price = reservePEN * 10 ** 18 / reserveETH;
    }

}
