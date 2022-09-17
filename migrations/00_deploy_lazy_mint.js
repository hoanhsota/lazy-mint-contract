const LazyMint = artifacts.require("LazyMint");

module.exports = function (deployer) {
  const signer = "TEEyi3iUKYcEBU6eedhMdbvNBWRcfW3CzM";
  deployer.deploy(LazyMint, signer);
};
