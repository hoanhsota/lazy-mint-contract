const hre = require("hardhat");
const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const lazyMint = await hre.ethers.getContractFactory("LazyMint");
    const lazyMintDeploy = await lazyMint.deploy(deployer.address)
    await lazyMintDeploy.deployTransaction.wait(5)
    await lazyMintDeploy.deployed(deployer.address)

    console.log(`Lazy mint contract was deployed at: ${lazyMintDeploy.address}`)
    await hre.run("verify:verify", {
        address: lazyMintDeploy.address,
        constructorArguments: [deployer.address],
        contract: "contracts/LazyMint.sol:LazyMint",
    });
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
