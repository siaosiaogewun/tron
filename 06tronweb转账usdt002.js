const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
// const fullNode = new HttpProvider("http://192.168.1.162:8090");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "3481E79956D4BD95F3..........78A847906DE588C145";
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);


const CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // USDT
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