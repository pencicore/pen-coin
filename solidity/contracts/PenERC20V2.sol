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

    // Checkin related
    mapping(address => uint256) public checkinDate;     // last checkin day number
    mapping(address => uint256) public checkinStreak;   // continuous checkin days
    uint256 public checkinBase = 100;                   // reward base

    event Checkin(address indexed user, uint256 reward, uint256 streak);

    constructor(string memory name_, string memory symbol_, address owner_) {
        name = name_;
        symbol = symbol_;
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

    // ✅ Checkin function
    function checkin() external returns (uint256 reward) {
        // ✅ 使用北京时间
        uint256 today = (block.timestamp + 8 hours) / 1 days;
        uint256 oldCheckinStreak = checkinStreak[msg.sender];

        require(checkinDate[msg.sender] < today, "Already checked in today");

        if (checkinDate[msg.sender] == today - 1) {
            // 连续签到
            checkinStreak[msg.sender] += 1;
        } else {
            // 断签，重置为1
            checkinStreak[msg.sender] = 1;
        }

        // 更新最后签到日期
        checkinDate[msg.sender] = today;

        // 奖励规则：基础奖励 * 连续天数
        reward = getCheckinReward(oldCheckinStreak);
        mint(msg.sender, reward);

        emit Checkin(msg.sender, reward, checkinStreak[msg.sender]);
    }

    function getCheckinReward(uint256 oldCheckinStreak) public view returns (uint256) {
        uint256 res = 1;
        if (oldCheckinStreak == 0) {
            res += 9;
        }
        if (checkinStreak[msg.sender]%5 == 0) {
            res += 1;
        }
        uint256 today = (block.timestamp + 8 hours) / 1 days;
        uint256 weekday = (today + 4) % 7;
        if (weekday == 0 && oldCheckinStreak != 0) {
            res += 1;
        }
        res *= checkinBase * 10 ** uint256(decimals);
        return res;
    }

    function random(uint seed) public view returns (uint) {
        return uint(keccak256(
            abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, seed)
        ));
    }

    function LuckyDraw()

}
