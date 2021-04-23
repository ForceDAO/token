import { task, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import { Contract, ethers } from "ethers";

require("dotenv").config();

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const MAINNET_PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy", "Deploys new token contract")
  .setAction(async (args, hre) => {
    // We get the contract to deploy
    const ForceToken = await hre.ethers.getContractFactory("ForceToken");
    const forceToken = await ForceToken.deploy("Force DAO", "FORCE");

    console.log("Force DAO Token deployed to:", forceToken.address);
  });

task("movetomultisig", "Send Control and Tokens to Multisig")
  .addParam("contractaddress", "The token public address")
  .addParam("multisig", "The account to take over control")
  .setAction(async (args, hre) => {
    const { utils, constants } = hre.ethers;

    // Get signer address.
    const [mainSigner] = await hre.ethers.getSigners();
    
    // Get contract
    const forceToken = await hre.ethers.getContractAt(
      "ForceToken",
      args.contractaddress
    );

    // Give Multisig Control
    await forceToken.grantRole(
      utils.id("SNAPSHOT_ROLE"),
      args.multisig,
      { gasLimit: 100000 }
    );

    await forceToken.grantRole(constants.HashZero, args.multisig, {
      gasLimit: 100000,
    });


    // Renounce Control from Deployer
    await forceToken.renounceRole(
      utils.id("SNAPSHOT_ROLE"),
      mainSigner.address,
      {
        gasLimit: 100000,
      }
    );
    await forceToken.renounceRole(
      constants.HashZero,
      mainSigner.address,
      {
        gasLimit: 100000,
      }
    );

    // Transfer Tokens
    await forceToken.transfer(args.multisig, utils.parseEther("100000000"), {
      gasLimit: 100000,
    }); 

    console.log("Controlling account set to:", args.multisig);
  });


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${RINKEBY_PRIVATE_KEY}`],
      gasPrice: ethers.utils.parseUnits("200", "gwei").toNumber(),
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${MAINNET_PRIVATE_KEY}`],
      gasPrice: ethers.utils.parseUnits("150", "gwei").toNumber(),
    },
    ganache: {
      url: "http://127.0.0.1:8555",
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  solidity: "0.7.6",
};

export default config;
