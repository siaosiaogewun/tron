const fs = require('fs');
const TronWeb = require('./tronweb');

// 从 mnemonic.txt 文件中读取助记词
const mnemonicFilePath = 'mnemonic.txt';
const mnemonic = fs.readFileSync(mnemonicFilePath, 'utf-8').trim();

function generatePrivateKeyAndAddress(index) {
    const path = `m/44'/195'/0'/0/${index}`;
    const privateKeyObject = TronWeb.fromMnemonic(mnemonic, path);
    const privateKey = privateKeyObject.privateKey;
    const address = privateKeyObject.address;

    return { index, address, privateKey };
}

function saveToCombinedFile(combinedStream, data) {
    const modifiedPrivateKey = (data.index % 2 === 0) ? data.privateKey.slice(2) : data.privateKey;
    const privateKeyWithout0x = modifiedPrivateKey.startsWith('0x') ? modifiedPrivateKey.slice(2) : modifiedPrivateKey;

    combinedStream.write(`${data.address}\n${privateKeyWithout0x}\n`);
}

function generateAndSaveKeys() {
    const combinedStream = fs.createWriteStream('privatekey.txt');

    try {
        for (let i = 0; i <= 100; i++) {
            const data = generatePrivateKeyAndAddress(i);
            saveToCombinedFile(combinedStream, data);
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        combinedStream.end();
        console.log('Addresses/privateKeys saved to privatekey.txt');
    }
}

generateAndSaveKeys();
