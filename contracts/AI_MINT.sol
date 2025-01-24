pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC7007 is IERC165, IERC721 {
    event AigcData(
        uint256 indexed tokenId,
        bytes indexed prompt,
        bytes indexed aigcData,
        bytes proof
    );

    function addAigcData(
        uint256 tokenId,
        bytes calldata prompt,
        bytes calldata aigcData,
        bytes calldata proof
    ) external;

    function verify(
        bytes calldata prompt,
        bytes calldata aigcData,
        bytes calldata proof
    ) external view returns (bool success);
}

contract AIGC_NFT is ERC721, IERC7007, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct AigcContent {
        bytes prompt;
        bytes aigcData;
        bytes proof;
    }

    mapping(uint256 => AigcContent) private _aigcContents;

    constructor() ERC721("AIGC_NFT", "AIGC") {}

    function addAigcData(
        uint256 tokenId,
        bytes calldata prompt,
        bytes calldata aigcData,
        bytes calldata proof
    ) external override onlyOwner {
        require(_exists(tokenId), "ERC7007: Token does not exist");
        _aigcContents[tokenId] = AigcContent(prompt, aigcData, proof);
        emit AigcData(tokenId, prompt, aigcData, proof);
    }

    function verify(
        bytes calldata prompt,
        bytes calldata aigcData,
        bytes calldata proof
    ) external view override returns (bool success) {
        // Implement your verification logic here
        return true;
    }

    function safeMint(address to, bytes calldata prompt) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        // Optionally, add AIGC data here
    }
}
