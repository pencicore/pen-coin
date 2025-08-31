// SPDX-License-Identifier: MIT
// by 0xAA
pragma solidity ^0.8.4;

import "./base/ERC721.sol";
import "./lib/Ownable.sol";
import "./base/ERC20.sol";

contract PenERC721 is ERC721, Ownable {
    uint public MAX_APES = 1000; // 总量

    // 构造函数
    constructor() ERC721("pencil nft", "PEN_NFT") {
        for (uint i = 1; i <= 480; i++) {
            _mint(address(msg.sender), i);
        }
    }

    // BAYC的baseURI为ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/ 
    function _baseURI() internal pure override returns (string memory) {
        return "https://pen-coin.oss-cn-chengdu.aliyuncs.com/nft/metadata/";
    }

    // 铸造函数
    function mint(address to, uint tokenId) external {
        require(tokenId > 0 && tokenId <= MAX_APES, "tokenId out of range");
        _mint(to, tokenId);
    }

    // =================== 荷兰拍卖部分 ===================
    
    struct Auction {
        uint tokenId;
        uint startPrice;
        uint endPrice;
        uint duration;
        uint startTime;
        address erc20Token;  // 支付使用的ERC20代币
        bool active;
    }

    Auction public auction;

    // 开启拍卖
    function startAuction(
        uint tokenId,
        uint startPrice,
        uint endPrice,
        uint duration,
        address erc20Token
    ) external onlyOwner {
        require(ownerOf(tokenId) == msg.sender, "not token owner");
        require(!auction.active, "auction already active");
        require(startPrice > endPrice, "start must > end");

        auction = Auction({
            tokenId: tokenId,
            startPrice: startPrice,
            endPrice: endPrice,
            duration: duration,
            startTime: block.timestamp,
            erc20Token: erc20Token,
            active: true
        });
    }

    // 计算当前价格
    function getCurrentPrice() public view returns (uint) {
        require(auction.active, "no active auction");
        uint elapsed = block.timestamp - auction.startTime;
        if (elapsed >= auction.duration) {
            return auction.endPrice;
        } else {
            uint priceDiff = auction.startPrice - auction.endPrice;
            uint currentDrop = (priceDiff * elapsed) / auction.duration;
            return auction.startPrice - currentDrop;
        }
    }

    // 买下 NFT
    function buy() external {
        require(auction.active, "no active auction");

        uint price = getCurrentPrice();
        IERC20 payToken = IERC20(auction.erc20Token);

        // 买家付钱给合约拥有者
        require(
            payToken.transferFrom(msg.sender, owner(), price),
            "ERC20 payment failed"
        );

        // NFT 转移（卖家 -> 买家）
        address seller = ownerOf(auction.tokenId);
        _transfer(seller, seller, msg.sender, auction.tokenId);

        // 结束拍卖
        auction.active = false;
    }
}
