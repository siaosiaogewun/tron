const fs = require('fs').promises;
const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;



const tronWeb = new TronWeb({
    fullHost: 'https://api.shasta.trongrid.io',
    solidityNode: 'https://api.shasta.trongrid.io',
    eventServer: 'https://api.shasta.trongrid.io',
    headers: { "TRON-PRO-API-KEY": '01ba2bd6-0b41-46c8-8bc7-b8274bf67849' }
});


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

const getTRC20TokenBalance = async (contractAddress, account) => {
    try {
        const accountHex = tronWeb.address.toHex(account);
        const contract = await tronWeb.contract().at(contractAddress);
        const balance = await contract.balanceOf(accountHex).call();
        return tronWeb.toDecimal(balance._hex);
    } catch (error) {
        console.error('Error al obtener el balance de USDT:', error);
        throw error;
    }
};
 
//转账usdt





// 主函数
async function main() {
    const filePath = 'C:\\Users\\siaos\\Documents\\GitHub\\tron\\combined.txt'; // 替换为实际文件路径
    const addressesAndKeys = await readAddressesAndKeysFromFile(filePath);




    for (const { address, privateKey } of addressesAndKeys) {
        tronWeb.setAddress('TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs');
    
        const tokenContractAddress = 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs';
        const accountAddress = address;
    
    
    
        const balance = await getTRC20TokenBalance(tokenContractAddress, accountAddress);
        console.log(balance / 1000000);


    
        // trc20的合约 usdt的合约
        const CONTRACT = "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs";
            

        // 替换为实际转账金额
        const transferAmount = balance;  


        //收款地址
        const ACCOUNT = "TEQH6py1Pi8YHNgi9cPMHCKLboBTUZrsYT";

        const {

            abi
        } = await tronWeb.trx.getContract(CONTRACT);
        // console.log(JSON.stringify(abi));
        
        
        const contract = tronWeb.contract(abi.entrys, CONTRACT);

        await contract.methods.transfer(ACCOUNT, 1000).send();

        console.log("transfer:", resp);



        await new Promise(resolve => setTimeout(resolve, 1000));



        

        




           

    }







}



// 运行主函数
main().then(() => {


   // console.log('Script executed successfully.');


}).catch((error) => {


 //   console.error('Error during script execution:', error.message || error);


});

