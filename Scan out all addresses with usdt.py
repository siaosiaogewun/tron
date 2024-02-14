import requests
from typing import Tuple
import shutil
import os

def get_balance_by_address_online(address: str) -> Tuple[float, float]:
    tuple_result = (0.0, 0.0)

    url = f"https://api.trongrid.io/v1/accounts/{address}"
    headers = {"TRON-PRO-API-KEY": "80a8b20f-a917-43a9-a2f1-809fe6eec0d6"}
    
    response = requests.get(url, headers=headers)
    if not response.ok:
        return tuple_result

    response_json = response.json()
    if not response_json.get("success", False) or not response_json.get("data"):
        return tuple_result

    data = response_json["data"][0]
    if not data:
        return tuple_result

    trxBalance = float(data.get("balance", 0)) / 1000000.0
    etherBalance = 0.0

    trc20Tokens = data.get("trc20", [])
    for trc20Token in trc20Tokens:
        tokenBalance = float(trc20Token.get("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", 0))
        etherBalance = tokenBalance / 1000000.0

    return trxBalance, etherBalance

# HttpClientHelper class in Python
class HttpClientHelper:
    @staticmethod
    def post(url: str, request_body: str, encoding='utf-8', timeout=12000) -> str:
        headers = {"Content-Type": "application/json", "TRON-PRO-API-KEY": "80a8b20f-a917-43a9-a2f1-809fe6eec0d6"}
        response = requests.post(url, data=request_body.encode(encoding), headers=headers, timeout=timeout)
        response.raise_for_status()  # Raise HTTPError for bad responses
        return response.text

def get_addresses_from_file(file_path: str) -> list:
    with open(file_path, 'r') as file:
        addresses = [line.strip() for line in file if line.strip()]
    return addresses

def append_addresses_with_positive_balance(output_file_path: str, addresses_with_balance: list):
    with open(output_file_path, 'a') as outfile:
        for address in addresses_with_balance:
            outfile.write(f"{address}\n")

# Example usage
file_path = "input_addresses.txt"
addresses = get_addresses_from_file(file_path)

output_file_path = "addresses_with_positive_balance.txt"
addresses_with_balance = []  # Initialize the list

for address in addresses:
    balance_result = get_balance_by_address_online(address)
    print(f"Address: {address}, TRX Balance: {balance_result[0]}, Token (USDT) Balance: {balance_result[1]}")

    # Check if USDT balance is greater than 0
    if balance_result[1] > 0:
        addresses_with_balance.append(address)

# Append addresses with positive balance to the output file
append_addresses_with_positive_balance(output_file_path, addresses_with_balance)

# 获取桌面路径
desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")

# 定义输入文件和输出文件路径
output_file_path = "addresses_with_positive_balance.txt"
output_file_dest_path = os.path.join(desktop_path, output_file_path)

# 拷贝文件
shutil.copy(output_file_path, output_file_dest_path)

print(f"File copied to desktop: {output_file_dest_path}")