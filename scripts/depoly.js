async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const AIGC_NFT = await ethers.getContractFactory("AIGC_NFT");
    const aigcNFT = await AIGC_NFT.deploy();
    console.log("AIGC_NFT contract deployed to:", aigcNFT.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  