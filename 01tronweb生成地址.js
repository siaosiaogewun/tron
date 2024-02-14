const fs = require('fs');
const TronWeb = require('tronweb');

// 助记词
const mnemonic = 'diary steak forest resist pumpkin grass outer punch bone saddle method umbrella';

// 创建一个可写流，指定输出文件为output.txt
const outputStream = fs.createWriteStream('output.txt');
const addressesStream = fs.createWriteStream('addresses.txt'); // Added this line

// 循环生成私钥和地址并打印
for (let i = 0; i <= 100; i++) {
    const path = `m/44'/195'/0'/0/${i}`;
    const privateKeyObject = TronWeb.fromMnemonic(mnemonic, path);
    const privateKey = privateKeyObject.privateKey;
    const address = privateKeyObject.address;

    // 将结果写入output.txt文件
    const outputString = `Index: ${i},  Address: ${address}, Private Key: ${privateKey}\n`;
    outputStream.write(outputString);

    // 同时在控制台输出
    console.log(outputString);

    // 将地址写入addresses.txt文件
    addressesStream.write(`${address}\n`);
}

// 关闭文件流
outputStream.end();
addressesStream.end(); // Added this line
console.log('Output saved to output.txt and addresses saved to addresses.txt');
