// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract AIART721 is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;
    uint256 public mintPrice = 0.01 ether;

    struct AIArtwork {
        address creator;
        string prompt;
        string aiModelUsed;
        bytes32 aiModelSignature;
        uint256 timestamp;
        string imageCID;
    }

    mapping(uint256 => AIArtwork) public artworkDetails;
    
    constructor() ERC721("AI Generated Art", "AIART") Ownable(msg.sender) {}

    function mint(
        address to, 
        string memory prompt, 
        string memory aiModelUsed,
        bytes32 aiModelSignature,
        string memory imageCID
    ) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Insufficient Ether sent");
        uint256 newTokenId = _nextTokenId++;
        
        _safeMint(to, newTokenId);

        artworkDetails[newTokenId] = AIArtwork({
            creator: msg.sender,
            prompt: prompt,
            aiModelUsed: aiModelUsed,
            aiModelSignature: aiModelSignature,
            timestamp: block.timestamp,
            imageCID: imageCID
        });

        return newTokenId;
    }

    function tokenURI(uint256 tokenId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        AIArtwork memory artwork = artworkDetails[tokenId];
        
        string memory json = Base64.encode(bytes(string(abi.encodePacked(
            '{"name":"AI Art #', _toString(tokenId), 
            '", "attributes": [',
                '{"trait_type": "Creator", "value": "', _toAsciiString(artwork.creator), '"},',
                '{"trait_type": "Model", "value": "', artwork.aiModelUsed, '"},',
                '{"trait_type": "Prompt", "value": "', artwork.prompt, '"}'
            '], ',
            '"description": "AI-generated artwork created using ', artwork.aiModelUsed, '", ',
            '"image": "https://ipfs.io/ipfs/', artwork.imageCID, '"}'
        ))));
        
        return string(abi.encodePacked('data:application/json;base64,', json));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function _toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = _char(hi);
            s[2*i+1] = _char(lo);            
        }
        return string(s);
    }

    function _char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    // Override functions for multiple inheritance
    function _baseURI() internal pure override returns (string memory) {
        return "";
    }

    function _increaseBalance(address account, uint128 value) 
        internal 
        override(ERC721, ERC721Enumerable) 
    {
        ERC721Enumerable._increaseBalance(account, value);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return ERC721Enumerable._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return 
            ERC721.supportsInterface(interfaceId) ||
            ERC721Enumerable.supportsInterface(interfaceId) ||
            ERC721URIStorage.supportsInterface(interfaceId);
    }
}