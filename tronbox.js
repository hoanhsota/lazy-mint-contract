module.exports = {
  networks: {
    mainnet: {
      // Don't put your private key here:
      privateKey: process.env.PRIVATE_KEY_TRON,
      /*
                                                                        Create a .env file (it must be gitignored) containing something like
                                                
                                                                          export PRIVATE_KEY_TRON=4E7FECCB71207B867C495B51A9758B104B1D4422088A87F4978BE64636656243
                                                
                                                                        Then, run the migration with:
                                                
                                                                          source .env && tronbox migrate --network mainnet
                                                
                                                                        */
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: "https://api.trongrid.io",
      network_id: "1",
    },
    shasta: {
      privateKey: process.env.PRIVATE_KEY_TRON,
      userFeePercentage: 100,
      feeLimit: 2000 * 1e6,
      fullHost: "https://api.shasta.trongrid.io",
      network_id: "2",
    },
    nile: {
      privateKey: process.env.PRIVATE_KEY_TRON_NILE,
      userFeePercentage: 30,
      feeLimit: 3000 * 1e6,
      fullHost: "https://api.nileex.io",
      network_id: "3",
    },
    compilers: {
      solc: {
        version: "0.8.4",
      },
    },
  },
  // solc compiler optimize
  solc: {
    //   optimizer: {
    //     enabled: true,
    //     runs: 200
    //   },
    //   evmVersion: 'istanbul'
  },
};
