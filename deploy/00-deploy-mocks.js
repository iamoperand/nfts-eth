const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 is the premium. It costs 0.25 LINK per request.
const GAS_PRICE_LINK = 1e9 // link per gas

module.exports = async (hre) => {
    const { deployments, getNamedAccounts, network, ethers } = hre

    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const args = [BASE_FEE, GAS_PRICE_LINK]

    // If we are on a development network, we need to deploy mocks!
    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args,
        })

        log("Mocks Deployed!")
        log("----------------------------------------------------")
    }
}
module.exports.tags = ["all", "mocks", "main"]
