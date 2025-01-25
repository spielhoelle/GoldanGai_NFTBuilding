// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AIART721 is ERC721Enumerable, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 public mintPrice = 0.01 ether;

    struct AIArtwork {
        address creator;
        string prompt;
        string aiModelUsed;
        bytes32 aiModelSignature;
        uint256 timestamp;
    }

    mapping(uint256 => AIArtwork) public artworkDetails;
    
    constructor() ERC721("AI Generated Art", "AIART") Ownable(msg.sender) {}

    function mint(
        address to, 
        string memory prompt, 
        string memory aiModelUsed,
        bytes32 aiModelSignature,
        string memory tokenURI
    ) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Insufficient Ether sent");
        uint256 newTokenId = _nextTokenId++;
        
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        artworkDetails[newTokenId] = AIArtwork({
            creator: msg.sender,
            prompt: prompt,
            aiModelUsed: aiModelUsed,
            aiModelSignature: aiModelSignature,
            timestamp: block.timestamp,
            tokenURI: tokenURI
        });

        return newTokenId;
    }
    function getArtworkDetails(uint256 tokenId) public view returns (AIArtwork memory) {
        require(tokenId < _nextTokenId, "Token does not exist");
        return artworkDetails[tokenId];
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
    }

    // Required overrides for multiple inheritance
    function _baseURI() internal pure override(ERC721, ERC721URIStorage) returns (string memory) {
        return "";
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return ERC721Enumerable.supportsInterface(interfaceId) || 
               ERC721URIStorage.supportsInterface(interfaceId);
    }

    // Override tokenURI to resolve inheritance conflict
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }
}