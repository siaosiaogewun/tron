const fs = require('fs');
const crypto = require('crypto');
const TronWeb = require('./tronweb');

const mnemonicFilePath = 'mnemonic.txt';
const encryptedFilePath = 'encrypted_privateKeys.txt';

const mnemonic = fs.readFileSync(mnemonicFilePath, 'utf-8').trim();
const encryptionKeyBase64 = 'an4dlV9ju1ZM04R_o-2RDwl7fxX-nGZQRHYc5N5OchM=';
const encryptionKey = Buffer.from(encryptionKeyBase64, 'base64'); // Decode base64

const algorithm = 'aes-256-cbc';

function generatePrivateKeyAndAddress(index) {
    const path = `m/44'/195'/0'/0/${index}`;
    const privateKeyObject = TronWeb.fromMnemonic(mnemonic, path);
    const privateKey = privateKeyObject.privateKey;
    const address = privateKeyObject.address;

    return { index, address, privateKey };
}

function encryptPrivateKey(privateKey, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(privateKey, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedPrivateKey: encrypted };
}

function saveToEncryptedFile(encryptedStream, data) {
    const encryptedData = encryptPrivateKey(data.privateKey, encryptionKey);
    const encryptedDataString = `${data.address}\n-${encryptedData.iv}-${encryptedData.encryptedPrivateKey}\n`;
    encryptedStream.write(encryptedDataString);
}



function generateAndSaveKeys() {
    const encryptedStream = fs.createWriteStream(encryptedFilePath);

    try {
        for (let i = 0; i <= 100; i++) {
            const data = generatePrivateKeyAndAddress(i);
            saveToEncryptedFile(encryptedStream, data);
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        encryptedStream.end();
        console.log('Encrypted addresses/privateKeys saved to encrypted_privateKeys.txt');
    }
}

generateAndSaveKeys();
