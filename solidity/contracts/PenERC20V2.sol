// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./base/ERC20.sol";

contract PenERC20V2 is ERC20 {

    // ======================= 签到部分 ===========================

    // Checkin related
    mapping(address => uint256) public checkinDate;     // last checkin day number
    mapping(address => uint256) public checkinStreak;   // continuous checkin days
    uint256 public checkinBase = 100;                   // reward base

    event Checkin(address indexed user, uint256 reward, uint256 streak);

    constructor(string memory name_, string memory symbol_, address owner_) ERC20(name_, symbol_, owner_) {
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

    // ======================= 抽奖部分 ===========================

    // Lucky draw related
    mapping(address => uint256) public luckyDrawDate;   // 上次抽奖日期
    mapping(address => uint256) public luckyDrawCount;  // 当日已抽次数

    event LuckyDraw(address indexed user, string reward, uint256 cost);

    // ✅ Lucky Draw function
    function luckyDraw(uint seed) external returns (string memory reward) {
        uint256 today = (block.timestamp + 8 hours) / 1 days;
        uint256 cost = 0;

        // 如果是新的一天，重置抽奖次数
        if (luckyDrawDate[msg.sender] < today) {
            luckyDrawDate[msg.sender] = today;
            luckyDrawCount[msg.sender] = 0;
        }

        require(luckyDrawCount[msg.sender] < 3, "Max 3 draws per day");

        // 按照抽奖次数扣费
        if (luckyDrawCount[msg.sender] == 1) {
            require(balanceOf[msg.sender] >= 100 * 10 ** uint256(decimals), "Not enough PEN");
            balanceOf[msg.sender] -= 100 * 10 ** uint256(decimals);
            totalSupply -= 100 * 10 ** uint256(decimals); // 销毁
            cost = 100;
            emit Transfer(msg.sender, address(0), 100 * 10 ** uint256(decimals));
        } else if (luckyDrawCount[msg.sender] == 2) {
            require(balanceOf[msg.sender] >= 200 * 10 ** uint256(decimals), "Not enough PEN");
            balanceOf[msg.sender] -= 200 * 10 ** uint256(decimals);
            totalSupply -= 200 * 10 ** uint256(decimals); // 销毁
            cost = 200;
            emit Transfer(msg.sender, address(0), 200 * 10 ** uint256(decimals));
        }
        luckyDrawCount[msg.sender] += 1;

        // 奖励规则
        uint code = (random(seed) % 100 + 1);
        if (0 <= code && code <= 1) {
            reward = "token";
        }
        if (2 <= code && code <= 5) {
            reward = "reset";
            luckyDrawCount[msg.sender] = 0;
        }
        if (6 <= code && code <= 10) {
            reward = "888 PEN";
            mint(msg.sender, 888 * 10 ** uint256(decimals));
        }
        if (11 <= code && code <= 20) {
            reward = "nothing";
        }
        if (21 <= code && code <= 50) {
            reward = "200 PEN";
            mint(msg.sender, 200 * 10 ** uint256(decimals));
        }
        if (51 <= code && code <= 100) {
            reward = "100 PEN";
            mint(msg.sender, 100 * 10 ** uint256(decimals));
        }

        emit LuckyDraw(msg.sender, reward, cost);
    }

    function random(uint seed) public view returns (uint) {
        return uint(keccak256(
            abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, seed)
        ));
    }

}
