//require('@nomiclabs/hardhat-waffle'); // import the waffle plugin
//require("@nomiclabs/hardhat-ganache");
//import { HardhatUserConfig } from "hardhat/config";
require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  paths: {
    artifacts: './src/artifcats',
    sources: './src/contracts',
  },
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // URL of the Ganache local network
      chainId: 5777,
      accounts: ["0xbcafd3c458f8b42b067c606555de7912b5b6cc8d9e618b7739008192677ae3be"], // Replace with your Ganache account private key
    }
  }
};
