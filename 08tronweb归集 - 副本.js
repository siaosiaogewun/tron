const fs = require('fs').promises;


// 读取文件中的地址和私钥
async function readAddressesAndKeysFromFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const lines = data.trim().split('\n');
        const addressesAndKeys = [];

        for (let i = 0; i < lines.length; i += 2) {
            const address = lines[i].trim();
            const privateKey = lines[i + 1].trim();
            addressesAndKeys.push({ address, privateKey });
        }

        return addressesAndKeys;
    } catch (error) {
        console.error('Error reading file:', error.message || error);
        throw error;
    }
}

// 获取USDT余额






// 主函数
async function main() {
    const filePath = 'C:\\Users\\siaos\\Documents\\GitHub\\tron\\combined.txt'; // 替换为实际文件路径
    const addressesAndKeys = await readAddressesAndKeysFromFile(filePath);
    
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (const { address, privateKey } of addressesAndKeys) {
        console.log("开始迭代地址:", address);
        console.log("开始迭代私钥:", privateKey);
    
        const TronWeb = require('tronweb');
        const HttpProvider = TronWeb.providers.HttpProvider;
        const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
        const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
        const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
        const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
    
        const CONTRACT = "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs";
        const transferAmount = 1000;
        const ACCOUNT = "TL1R6YacZuY2dVqNyreWexzb77Ct2QCick";
    
        try {
            const { abi } = await tronWeb.trx.getContract(CONTRACT);
            const contract = tronWeb.contract(abi.entrys, CONTRACT);
    
            const balance = await contract.methods.balanceOf(ACCOUNT).call();
            console.log("balance:", balance.toString());
    
            const resp = await contract.methods.transfer(ACCOUNT, transferAmount).send();
            console.log("transfer:", resp);
    
            console.log("完成迭代地址:", address);
    
            await delay(10000);
        } catch (error) {
            console.error("转账失败:", error);
            // Handle the error as needed, you may want to log the error or perform some other action.
            // The loop will continue to the next iteration even if an error occurs.
        }
    }
    






}



// 运行主函数
main().then(() => {


   // console.log('Script executed successfully.');


}).catch((error) => {


 //   console.error('Error during script execution:', error.message || error);


});


//更新即使中途有发送失败的循环也不会终止。