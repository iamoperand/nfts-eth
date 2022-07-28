const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const PINATA_API_KEY = process.env.PINATA_API_KEY
const PINATA_API_SECRET = process.env.PINATA_API_SECRET

const pinata = pinataSDK(PINATA_API_KEY, PINATA_API_SECRET)

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)

    let responses = []
    console.log("Storing images on Pinata...")
    for (fileIndex in files) {
        console.log(`Working on ${fileIndex}...`)
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile)
            responses.push(response)
        } catch (error) {
            console.error(error)
        }
    }
    console.log("Images Uploaded!")

    return { responses, files }
}

async function storeTokenUriMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.error(error)
    }
    return null
}

module.exports = { storeImages, storeTokenUriMetadata }
