const fs = require('fs');
const crypto = require('crypto');
const TronWeb = require('./tronweb');

const mnemonicFilePath = 'mnemonic.txt';
const encryptedFilePath = 'encrypted_privateKeys.txt';
const addressFilePath = 'addresses.txt'; // 新增地址文件路径

const mnemonic = fs.readFileSync(mnemonicFilePath, 'utf-8').trim();
const encryptionKeyBase64 = 'Z9ltp-9DY5A7cKGF-s4b0QYbBVN9WNVygfg-Tf-DEu4=';
const encryptionKey = Buffer.from(encryptionKeyBase64, 'base64');

const algorithm = 'aes-256-cbc';

function generatePrivateKeyAndAddress(index) {
    const path = `m/44'/195'/0'/0/${index}`;
    const privateKeyObject = TronWeb.fromMnemonic(mnemonic, path);
    const privateKey = privateKeyObject.privateKey;
    const address = privateKeyObject.address;
    console.log(address);

    return { index, address, privateKey };
}

function encryptPrivateKey(privateKey, key) {
    if (privateKey.startsWith('0x')) {
        privateKey = privateKey.substring(2);
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(privateKey, 'hex', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedPrivateKey: encrypted };
}

function saveToEncryptedFile(encryptedStream, addressStream, data) {
    const encryptedData = encryptPrivateKey(data.privateKey, encryptionKey);
    const encryptedDataString = `${data.address}\n-${encryptedData.iv}-${encryptedData.encryptedPrivateKey}\n`;
    encryptedStream.write(encryptedDataString);

    // 将地址写入地址文件
    const addressString = `${data.address}\n`;
    addressStream.write(addressString);
}

function generateAndSaveKeys() {
    const encryptedStream = fs.createWriteStream(encryptedFilePath);
    const addressStream = fs.createWriteStream(addressFilePath); // 新增地址文件流

    try {
        for (let i = 1; i <= 10000; i++) {
            const data = generatePrivateKeyAndAddress(i);
            saveToEncryptedFile(encryptedStream, addressStream, data);
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        encryptedStream.end();
        addressStream.end(); // 关闭地址文件流
        console.log('Encrypted addresses/privateKeys saved to encrypted_privateKeys.txt');
    }
}

generateAndSaveKeys();
