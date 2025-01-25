async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const AIART721 = await ethers.getContractFactory("AIART721");
    const aiArt721 = await AIART721.deploy();
    await aiArt721.waitForDeployment();
    console.log("AIART721 deployed to:", aiArt721.target);
    
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  