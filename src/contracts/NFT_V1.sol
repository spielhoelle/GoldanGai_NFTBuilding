// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AIART721 is ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;

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
        bytes32 aiModelSignature
    ) public returns (uint256) {
        uint256 newTokenId = _nextTokenId++;

        _safeMint(to, newTokenId);

        artworkDetails[newTokenId] = AIArtwork({
            creator: msg.sender,
            prompt: prompt,
            aiModelUsed: aiModelUsed,
            aiModelSignature: aiModelSignature,
            timestamp: block.timestamp
        });

        return newTokenId;
    }

    function getArtworkDetails(uint256 tokenId) public view returns (AIArtwork memory) {
        require(tokenId < _nextTokenId, "Token does not exist");
        return artworkDetails[tokenId];
    }
}