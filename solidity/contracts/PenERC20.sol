// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./interface/IERC20.sol";

contract PenERC20 is IERC20 {

    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) public override allowance;
    uint256 public override totalSupply;

    string public name;
    string public symbol;
    uint8 public decimals = 18;

    mapping(address => uint16) public checkinDate;
    uint256 public checkinBase = 100;

    constructor(string memory name_, string memory symbol_, address owner_) {
        name = name_;
        symbol = symbol_;
        // Use unchecked to avoid overflow checks in constructor
        unchecked {
            mint(owner_, 200000 * 10 ** uint256(decimals));
        }
    }

    function transfer(address recipient, uint amount) public override returns (bool) {
        require(balanceOf[msg.sender] >= amount, "ERC20: insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) public override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) public override returns (bool) {
        require(balanceOf[sender] >= amount, "ERC20: insufficient balance");
        require(allowance[sender][msg.sender] >= amount, "ERC20: allowance too low");
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function mint(address recipient, uint256 amount) private {
        balanceOf[recipient] += amount;
        totalSupply += amount;
        emit Transfer(address(0), recipient, amount);
    }

    function checkin() external returns (uint256) {

    }
}
