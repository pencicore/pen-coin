// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract HelloWeb3 {
    string private _string = "Hello Web3!";

    function setString(string memory _name) public {
        _string = _name;
    }

    function getString() public view returns (string memory) {
        return _string;
    }
}
