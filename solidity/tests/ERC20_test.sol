// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "remix_tests.sol"; // ⬅️ 必须引入
import "hardhat/console.sol";
import "../contracts/ERC20.sol"; 

contract ERC20Test {
    ERC20 token;
    address deployer = address(this); // test contract is the deployer
    address owner = address(0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199); 
    address userA = address(0x001);
    address userB = address(0x002);

    /// Runs once before all tests
    function beforeAll() public {
        token = new ERC20("MyCoin", "PEN", deployer);
        console.log(address(token));
    }

    function testTransfer() public {
        uint256 beforeA = token.balanceOf(deployer);
        uint256 beforeB = token.balanceOf(owner);
        uint256 amount = beforeA / 2;
        token.transfer(owner, amount);
        uint256 afterA = token.balanceOf(deployer);
        uint256 afterB = token.balanceOf(owner);
        console.log(beforeA, afterA);
        Assert.equal(beforeA+beforeB, afterA+afterB, unicode"转账前后总余额不相等");
    }
}
