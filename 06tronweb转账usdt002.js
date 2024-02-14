const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
// const fullNode = new HttpProvider("http://192.168.1.162:8090");
const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
const privateKey = "8e4ba713657f8026b31e98707464f7de0d455f324b32f906c53010e6dfed17f2";
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);


const CONTRACT = "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs"; // USDT
const ACCOUNT = "TEQH6py1Pi8YHNgi9cPMHCKLboBTUZrsYT";

async function main() {
    let {
        transaction,
        result
    } = await tronWeb.transactionBuilder.triggerSmartContract(
        CONTRACT, 'transfer(address,uint256)', {
            feeLimit: 1_000_000,
            callValue: 0
        },
        [{
            type: 'address',
            value: ACCOUNT
        }, {
            type: 'uint256',
            value: 1000000
        }]
    );
    if (!result.result) {
        console.error("error:", result);
        return;
    }
    console.log("transaction =>", JSON.stringify(transaction, null, 2));

    const signature = await tronWeb.trx.sign(transaction.raw_data_hex);
    console.log("Signature:", signature);
    transaction["signature"] = [signature];

    const broadcast = await tronWeb.trx.sendRawTransaction(transaction);
    console.log("result:", broadcast);

    const {
        message
    } = broadcast;
    if (message) {
        console.log("Error:", Buffer.from(message, 'hex').toString());
    }
}

main().then(() => {
        console.log("ok");
    })
    .catch((err) => {
        console.trace(err);
    });

    //这个版本的代码报错没修。