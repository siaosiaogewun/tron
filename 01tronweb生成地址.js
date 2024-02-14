const fs = require('fs');
const util = require('util');
const TronWeb = require('tronweb');

const mnemonic = 'diary steak forest resist pumpkin grass outer punch bone saddle method umbrella';

// Promisify the fs.writeFile function
const writeFileAsync = util.promisify(fs.writeFile);

async function generateAndSaveKeys() {
    const outputStream = fs.createWriteStream('output.txt');
    const combinedStream = fs.createWriteStream('combined.txt');

    try {
        for (let i = 0; i <= 100; i++) {
            const path = `m/44'/195'/0'/0/${i}`;
            const privateKeyObject = TronWeb.fromMnemonic(mnemonic, path);
            const privateKey = privateKeyObject.privateKey;
            const address = privateKeyObject.address;

            const outputString = `Index: ${i},  Address: ${address}, Private Key: ${privateKey}\n`;

            outputStream.write(outputString);
            console.log(outputString);

            const modifiedPrivateKey = (i % 2 === 0) ? privateKey.slice(2) : privateKey;
            combinedStream.write(`${address}\n${modifiedPrivateKey}\n`);
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        outputStream.end();
        combinedStream.end();
        console.log('Output saved to output.txt and addresses/privateKeys saved to combined.txt');
    }
}

generateAndSaveKeys();
