const fs = require('fs');
const TronWeb = require('tronweb');

const mnemonic = 'diary steak forest resist pumpkin grass outer punch bone saddle method umbrella';

function generatePrivateKeyAndAddress(index) {
    const path = `m/44'/195'/0'/0/${index}`;
    const privateKeyObject = TronWeb.fromMnemonic(mnemonic, path);
    const privateKey = privateKeyObject.privateKey;
    const address = privateKeyObject.address;

    return { index, address, privateKey };
}

function saveToFile(outputStream, combinedStream, data) {
    const outputString = `Index: ${data.index}, Address: ${data.address}, Private Key: ${data.privateKey}\n`;

    outputStream.write(outputString);
    console.log(outputString);

    const modifiedPrivateKey = (data.index % 2 === 0) ? data.privateKey.slice(2) : data.privateKey;
    const privateKeyWithout0x = modifiedPrivateKey.startsWith('0x') ? modifiedPrivateKey.slice(2) : modifiedPrivateKey;

    combinedStream.write(`${data.address}\n${privateKeyWithout0x}\n`);
}

function generateAndSaveKeys() {
    const outputStream = fs.createWriteStream('output.txt');
    const combinedStream = fs.createWriteStream('combined.txt');

    try {
        for (let i = 0; i <= 100; i++) {
            const data = generatePrivateKeyAndAddress(i);
            saveToFile(outputStream, combinedStream, data);
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
