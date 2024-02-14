const fs = require('fs');
const TronWeb = require('tronweb');

// 助记词
const mnemonic = 'diary steak forest resist pumpkin grass outer punch bone saddle method umbrella';

// 创建两个可写流，分别指定输出文件为output_json_format_without_prefix.txt和output_plain_format.txt
const outputStreamJsonFormatWithoutPrefix = fs.createWriteStream('output_json_format_without_prefix.txt');
const outputStreamPlainFormat = fs.createWriteStream('output_plain_format.txt');

// 循环生成私钥并保存
for (let i = 0; i <= 100; i++) {
    const path = `m/44'/195'/0'/0/${i}`;
    const privateKeyObject = TronWeb.fromMnemonic(mnemonic, path);
    const privateKeyWithPrefix = privateKeyObject.privateKey;
    const privateKeyWithoutPrefix = privateKeyWithPrefix.slice(2); // 移除私钥开头的 "0x"

    // 生成 JSON 格式的私钥字符串（去掉 "0x" 前缀）
    const outputStringJsonFormatWithoutPrefix = `{"PrivateKey": "${privateKeyWithoutPrefix}"},\n`;
    outputStreamJsonFormatWithoutPrefix.write(outputStringJsonFormatWithoutPrefix);

    // 生成纯私钥字符串（不带 "0x" 前缀）
    const outputStringPlainFormat = `${privateKeyWithoutPrefix}\n`;
    outputStreamPlainFormat.write(outputStringPlainFormat);

    // 同时在控制台输出
    console.log(outputStringJsonFormatWithoutPrefix);
}

// 关闭文件流
outputStreamJsonFormatWithoutPrefix.end();
outputStreamPlainFormat.end();

console.log('Output with JSON format (without "0x" prefix) saved to output_json_format_without_prefix.txt');
console.log('Output with plain format saved to output_plain_format.txt');
