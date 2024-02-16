const crypto = require('crypto');

const encryptedData = {
    iv: '20d0e4963c1d6e60293f61bdf7131793',
    encryptedPrivateKey: '2d4c5ba84704a61a384862d9027daf5494d27b7abb57298f95165c66195ed1e06a2eb7cbd51650f36069bb0cf8835a3a'
};

const encryptionKeyBase64 = 'an4dlV9ju1ZM04R_o-2RDwl7fxX-nGZQRHYc5N5OchM=';
const encryptionKey = Buffer.from(encryptionKeyBase64, 'base64');

const algorithm = 'aes-256-cbc';

function decryptPrivateKey(encryptedData, key) {
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData.encryptedPrivateKey, 'hex', 'hex');
    decrypted += decipher.final('hex');
    return decrypted;
}

const decryptedPrivateKey = decryptPrivateKey(encryptedData, encryptionKey);
console.log('Decrypted Private Key:', decryptedPrivateKey);
