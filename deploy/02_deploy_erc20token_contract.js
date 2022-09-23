const hre = require("hardhat");
const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const erc20Token = await hre.ethers.getContractFactory("ERC20Token");
  const erc20TokenDeploy = await erc20Token.deploy();
  await erc20TokenDeploy.deployTransaction.wait(5);
  await erc20TokenDeploy.deployed(deployer.address);

  console.log(
    `ERC20Token contract was deployed at: ${erc20TokenDeploy.address}`
  );
  await hre.run("verify:verify", {
    address: erc20TokenDeploy.address,
    constructorArguments: [],
    contract: "contracts/ERC20Token.sol:ERC20Token",
  });
};
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
