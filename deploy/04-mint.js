const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts }) {
    const { deployer } = await getNamedAccounts()

    // BasicNft
    const basicNft = await ethers.getContract("BasicNft", deployer)
    const basicNftMintTx = await basicNft.mintNft()
    await basicNftMintTx.wait(1)
    console.log(`BasicNFT index: 0 has tokenURI: ${await basicNft.tokenURI(0)}`)

    // RandomIpfsNft
    const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
    const mintFee = await randomIpfsNft.getMintFee()
    const randomIpfsNftMintTx = await randomIpfsNft.requestNft({ value: mintFee.toString() })
    const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1)

    await new Promise(async (resolve, reject) => {
        setTimeout(() => reject("Timeout: 'NFTMinted' event did not fire"), 300000) // 5 minute timeout time
        randomIpfsNft.once("NftMinted", async function () {
            resolve()
        })

        if (developmentChains.includes(network.name)) {
            const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address)
        }
    })

    console.log(`RandomIpfsNft index: 0 has tokenURI: ${await randomIpfsNft.tokenURI(0)}`)

    // DynamicSvgNft
    const highValue = ethers.utils.parseEther("1500") // $1500/eth
    const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer)
    const dynamicSvgNftTx = await dynamicSvgNft.mintNft(highValue.toString())
    await dynamicSvgNftTx.wait(1)
    console.log(`DynamicSvgNft index: 0 has tokenURI: ${await dynamicSvgNft.tokenURI(0)}`)
}
