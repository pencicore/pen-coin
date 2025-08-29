// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./base/ERC20.sol";

contract PenERC20V2 is ERC20 {

    // ======================= 签到部分 ===========================1

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

        require(checkinDate[msg.sender] < today, "Already checked in today");

        if (checkinDate[msg.sender] == today - 1) {
            // 连续签到
            checkinStreak[msg.sender] += 1;
        } else {
            // 断签，重置为1
            checkinStreak[msg.sender] = 1;
        }

        // 奖励规则：基础奖励 * 连续天数
        reward = getCheckinReward();

        // 更新最后签到日期
        checkinDate[msg.sender] = today;
        mint(msg.sender, reward);

        emit Checkin(msg.sender, reward, checkinStreak[msg.sender]);
    }

    function getCheckinReward() public view returns (uint256) {
        uint256 res = 1;
        if (checkinDate[msg.sender] == 0) {
            res += 9;
        }
        if (checkinStreak[msg.sender]%5 == 0 && checkinDate[msg.sender] != 0) {
            res += 1;
        }
        uint256 today = (block.timestamp + 8 hours) / 1 days;
        uint256 weekday = (today + 4) % 7;
        if (weekday == 0) {
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
    
    function getLuckyDrawCount(address user) public view returns (uint256 count) { 
        count = 3 - luckyDrawCount[user]; 
        uint256 today = (block.timestamp + 8 hours) / 1 days; 
        if (today != luckyDrawDate[user]) { count = 3; } 
    }

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
            cost = 100 * 10 ** uint256(decimals);
            require(balanceOf[msg.sender] >= cost, "Not enough PEN");
            balanceOf[msg.sender] -= cost;
            totalSupply -= cost; // 销毁
            emit Transfer(msg.sender, address(0), cost);
        } else if (luckyDrawCount[msg.sender] == 2) {
            cost = 200 * 10 ** uint256(decimals);
            require(balanceOf[msg.sender] >= cost, "Not enough PEN");
            balanceOf[msg.sender] -= cost;
            totalSupply -= cost; // 销毁
            emit Transfer(msg.sender, address(0), cost);
        }
        luckyDrawCount[msg.sender] += 1;

        // 奖励规则
        uint code = (random(seed) % 100 + 1);    
        if (code <= 1) {
            reward = "token";
        } else if (code <= 5) {
            reward = "reset";
            luckyDrawCount[msg.sender] = 0;
        } else if (code <= 10) {
            reward = "888 PEN";
            mint(msg.sender, 888 * 10 ** uint256(decimals));
        } else if (code <= 20) {
            reward = "nothing";
        } else if (code <= 50) {
            reward = "200 PEN";
            mint(msg.sender, 200 * 10 ** uint256(decimals));
        } else {
            reward = "100 PEN"; // 51~100
            mint(msg.sender, 100 * 10 ** uint256(decimals));
        }

        emit LuckyDraw(msg.sender, reward, cost);
    }

    function random(uint seed) public view returns (uint) {
        return uint(keccak256(
            abi.encodePacked(block.timestamp, block.difficulty, msg.sender, seed)
        ));
    }

}
