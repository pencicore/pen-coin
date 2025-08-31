// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Ownable (OpenZeppelin Contracts v4.9.x)
abstract contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /// @dev In v4, deployer becomes the initial owner.
    constructor() {
        _transferOwnership(msg.sender);
    }

    /// @notice Returns the current owner.
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /// @notice Restricts a function so it can only be called by the owner.
    modifier onlyOwner() {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    /// @notice Leaves the contract without an owner (disables `onlyOwner`).
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /// @notice Transfers ownership to `newOwner` (must not be zero).
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /// @dev Internal ownership transfer logic with event.
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
