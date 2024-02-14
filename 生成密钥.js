const fs = require('fs');
const TronWeb = require('tronweb');

// 助记词
const mnemonic = 'diary steak forest resist pumpkin grass outer punch bone saddle method umbrella';

// 创建两个可写流，分别指定输出文件为output_json_format.txt和output_plain_format.txt
const outputStreamJsonFormat = fs.createWriteStream('output_json_format.txt');
const outputStreamPlainFormat = fs.createWriteStream('output_plain_format.txt');

// 循环生成私钥并保存
for (let i = 0; i <= 100; i++) {
    const path = `m/44'/195'/0'/0/${i}`;
    const privateKeyObject = TronWeb.fromMnemonic(mnemonic, path);
    const privateKeyWithPrefix = privateKeyObject.privateKey;
    const privateKeyWithoutPrefix = privateKeyWithPrefix.slice(2); // 移除私钥开头的 "0x"

    // 将带有前缀的私钥以JSON格式写入文件
    const outputStringJsonFormat = `{"PrivateKey": "${privateKeyWithPrefix}"},\n`;
    outputStreamJsonFormat.write(outputStringJsonFormat);

    // 将不带前缀的私钥写入文件
    const outputStringPlainFormat = `${privateKeyWithoutPrefix}\n`;
    outputStreamPlainFormat.write(outputStringPlainFormat);

    // 同时在控制台输出
    console.log(outputStringJsonFormat);
}

// 关闭文件流
outputStreamJsonFormat.end();
outputStreamPlainFormat.end();

console.log('Output with JSON format saved to output_json_format.txt');
console.log('Output with plain format saved to output_plain_format.txt');
