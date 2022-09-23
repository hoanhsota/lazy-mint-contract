const hre = require("hardhat");
const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const payment = await hre.ethers.getContractFactory("Payment");
  const paymentDeploy = await payment.deploy();
  await paymentDeploy.deployTransaction.wait(5);
  await paymentDeploy.deployed(deployer.address);

  console.log(`Payment contract was deployed at: ${paymentDeploy.address}`);
  await hre.run("verify:verify", {
    address: paymentDeploy.address,
    constructorArguments: [],
    contract: "contracts/Payment.sol:Payment",
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
