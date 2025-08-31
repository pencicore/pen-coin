// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./interface/IERC20.sol";
import "./PenERC721.sol";

contract PenERC721V2 is PenERC721 {
    struct Listing {
        address seller;
        uint256 price;
        IERC20 payToken;
    }

    // tokenId => Listing
    mapping(uint256 => Listing) public listings;

    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price, address payToken);
    event NFTSold(uint256 indexed tokenId, address indexed buyer, uint256 price, address payToken);
    event NFTDelisted(uint256 indexed tokenId);

    /// @notice 卖家上架 NFT（NFT 会托管到合约本身）
    function listNFT(uint256 tokenId, uint256 price, IERC20 payToken) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Price must be > 0");

        // 把 NFT 从卖家转入合约
        transferFrom(msg.sender, address(this), tokenId);

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            payToken: payToken
        });

        emit NFTListed(tokenId, msg.sender, price, address(payToken));
    }

    /// @notice 卖家下架 NFT
    function delistNFT(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];
        require(listing.seller == msg.sender, "Not seller");

        // 把 NFT 退还给卖家
        _transfer(address(this), address(this), msg.sender, tokenId);

        delete listings[tokenId];
        emit NFTDelisted(tokenId);
    }

    /// @notice 买家购买 NFT
    function buyNFT(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];
        require(listing.price > 0, "Not listed");

        // 买家直接支付 ERC20 给卖家
        require(listing.payToken.transferFrom(msg.sender, listing.seller, listing.price), "Payment failed");

        // NFT 从合约转给买家
        _transfer(address(this), address(this), msg.sender, tokenId);

        delete listings[tokenId];
        emit NFTSold(tokenId, msg.sender, listing.price, address(listing.payToken));
    }
}
