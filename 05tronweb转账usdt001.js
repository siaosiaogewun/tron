const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
const privateKey = "8e4ba713657f8026b31e98707464f7de0d455f324b32f906c53010e6dfed17f2";
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

const ACCOUNT = "TTzPiwbBedv7E8p4FkyPyeqq4RVoqRL3TW";
const memo = "tttttttttttttttransfer";

async function main() {

    console.log(tronWeb.defaultAddress.base58, "=>", ACCOUNT);

    const unSignedTxn = await tronWeb.transactionBuilder.sendTrx(ACCOUNT, 1000);
    const unSignedTxnWithNote = await tronWeb.transactionBuilder.addUpdateData(unSignedTxn, memo, 'utf8');
    const signedTxn = await tronWeb.trx.sign(unSignedTxnWithNote);
    console.log("signed =>", signedTxn);
    const ret = await tronWeb.trx.sendRawTransaction(signedTxn);
    console.log("broadcast =>", ret);
}

main().then(() => {
        console.log("ok");
    })
    .catch((err) => {
        console.log("error:", err);
    });