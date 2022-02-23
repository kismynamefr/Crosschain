require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

module.exports = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/a4V3Hu3w_K6Uvjfb8DVXpYfuYmbaFWHp",
      accounts: [`8c010bd222587fea251d21c1b2ed9f4fe08a94207a4e22e9aed8187d7890c64a`],
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/d5jl96uz-JVZRnR4LtYWZVsibWP4wYaz",
      accounts: [`8c010bd222587fea251d21c1b2ed9f4fe08a94207a4e22e9aed8187d7890c64a`],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: "",
  },
};
