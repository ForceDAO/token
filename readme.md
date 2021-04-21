# Force DAO Token

FORCE Token Contract. Uses OpenZeppelin's ERC20Snapshot with Force DAO multisig owning the `SNAPSHOT_ROLE`.

## Addresses

  - [Deployer](https://rinkeby.etherscan.io/address/0xd573e16ab39d2a8a8fb190d47799a748b591af5a)
  - [Rinkeby](https://rinkeby.etherscan.io/address/0x2C31b10ca416b82Cec4c5E93c615ca851213d48D)
  - [Mainnet](https://etherscan.io/address/0x2C31b10ca416b82Cec4c5E93c615ca851213d48D)

## Env

Copy .example_env to .env and populate with secrets.

## Setup

```{sh}
npm install
npm run build
```

## Deploy

```{sh}
npm run deploy:rinkeby  // Testnet deploy
npm run deploy:mainnet  // Mainnet deploy
```

## Verify

```{sh}
// Caution address is hardcoded in npm script as we know the deployer address. (Modify npm script if this is not the case)
npm run deploy:mainnet:verify  
```

# Social

[forcedao.com](https://forcedao.com/)
[Discord](https://discord.gg/VURZsauKkm)
[Twitter](https://twitter.com/force_dao)
[Medium](https://forcedao.medium.com/)