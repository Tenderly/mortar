import 'hardhat-deploy';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.5.2',
  namedAccounts: {
    deployer: {
      default: 0,
    }
  },
  networks: {
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ['local'],
    }
  }
};
