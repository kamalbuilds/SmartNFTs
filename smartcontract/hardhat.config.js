require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers : [
      {
        version: "0.7.6",
      },
      {
        version: "0.8.10",
      },
      {
        version: "0.7.5"
      },
      {
        version: "0.8.11"
      },
      {
        version: "0.8.20"
      }
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
      viaIR: true,
    },
  },
};
