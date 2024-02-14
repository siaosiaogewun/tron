const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    solidityNode: 'https://api.trongrid.io',
    eventServer: 'https://api.trongrid.io',
});

tronWeb.setAddress('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t');

const tokenContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const accountAddress = 'TJGkKUuvdpPKjUf3AqTr9jKfoNkj7iD1ms';

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

(async () => {
    const balance = await getTRC20TokenBalance(tokenContractAddress, accountAddress);
    console.log(balance / 1000000);
})();