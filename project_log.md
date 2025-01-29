# Base setup site 
```
npx sv create
./ 
tailwind css
npm
```


```
npx svelte-add@latest tailwindcss
npm install
npm install flowbite flowbite-svelte classnames @popperjs/core
svelte-preprocess @sveltejs/adapter-auto @sveltejs/kit
```

NFT shit 
Set up meta mask 
https://www.youtube.com/watch?v=FgdtRehl-Eg&t=65s
Sort out mint page 
https://www.youtube.com/watch?v=NigFFcK3WnI


Step 1 ai image to ipfs 
```
npm install ipfs-http-client
```
Set up https://www.infura.io/
sAaSDad213sd%

create ipfs.ts file 

# Set up nfts contract deploy side 
npm install -g truffle 
Tuffle did not work 
https://www.youtube.com/watch?v=UwP4EMVLViA
https://github.com/matiasfha/getting-started-fullstack-ethereum-development/blob/lesson01/README.md

```
npm install ethers@5.7.2
npm install --save-dev hardhat @nomiclabs/hardhat-waffle ethereum-waffle
```
create empty hardhat.config file. a new "hardhat.config.cjs" should appear 
- added in Ganache info for the network settings 
- created test erc7007 contract 
sorted out geting hardhat workinfg
```
 npx hardhat run scripts/depoly.js --network ganache
 ```
issue #contract deployed to: undefined"

Code update ad waitForDeployment
```
const AIART721 = await ethers.getContractFactory("AIART721");
const aiArt721 = await AIART721.deploy();
await aiArt721.waitForDeployment();
console.log("AIART721 deployed to:", aiArt721.target);
```

ts/depoly.js --network ganache
Deploying contracts with the account: 0xf853742aFA6c5f87F1B89E151d35fE8aB4459296
AIART721 deployed to: 0x5115b548a8a834bd291BB2E16F1e74c234AE2e1A

keep arsking for somthjing called an ABI  ? 

# MintNFT compents 

## S1 upload image url to PINATA 

NFT can create and deploy nfts on 
https://docs.openzeppelin.com/contracts/5.x/wizard



Issues package version errors 


# To check 
https://whatpwacando.today/

Service workes to make it floor , live info, socket.io 