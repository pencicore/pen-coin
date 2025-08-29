// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../interface/IERC20.sol";

contract ERC20 is IERC20 {

    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) public override allowance;
    uint256 public override totalSupply;

    string public name;
    string public symbol;
    uint8 public decimals = 18;

    constructor(string memory name_, string memory symbol_, address owner_) {
        name = name_;
        symbol = symbol_;
        // Use unchecked to avoid overflow checks in constructor
        unchecked {
            mint(owner_, 200000 * 10 ** uint256(decimals));
        }
    }

    function transfer(address recipient, uint amount) public override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint amount) public override returns (bool) {
        require(allowance[sender][msg.sender] >= amount, "ERC20: allowance too low");
        allowance[sender][msg.sender] -= amount;
        _transfer(sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) public override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function mint(address recipient, uint256 amount) internal {
        balanceOf[recipient] += amount;
        totalSupply += amount;
        emit Transfer(address(0), recipient, amount);
    }
    
    function burn(uint256 amount) external {
        require(balanceOf[msg.sender] >= amount, "ERC20: insufficient balance to burn");
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

    function _transfer(address from, address to, uint256 value) internal {
        require(from != address(0), "ERC20: transfer from zero address");
        require(to != address(0), "ERC20: transfer to zero address");
        require(balanceOf[from] >= value, "ERC20: insufficient balance");

        unchecked {
            balanceOf[from] -= value;
            balanceOf[to] += value;
        }
        emit Transfer(from, to, value);
    }
}
