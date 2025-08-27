// SPDX-License-Identifier: MIT
// by 0xAA
pragma solidity ^0.8.4;

import "./base/ERC721.sol";

contract PenERC721 is ERC721{
    uint public MAX_APES = 1000; // 总量

    // 构造函数
    constructor() ERC721("pencil nft", "PEN_NFT"){
    }

    //BAYC的baseURI为ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/ 
    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/";
    }
    
    // 铸造函数
    function mint(address to, uint tokenId) external {
        require(tokenId >= 0 && tokenId < MAX_APES, "tokenId out of range");
        _mint(to, tokenId);
    }
}