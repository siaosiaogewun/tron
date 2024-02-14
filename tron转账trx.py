from pprint import pprint
import hashlib

# !pip install requests
import requests

# !pip install base58
import base58

# !pip install ecdsa
import ecdsa

# !pip install pycryptodome
from Crypto.Hash import keccak


API_BASE_URL = 'https://api.shasta.trongrid.io'

MY_PRIV_KEY = 'd705fc17c.......????...d12ad881bdc0e1327031976'

TO_ADDR = "TEiMQZpHs4N4HuTKP3xcCKZ68XSQSfEbMW"

AMOUNT = 1000


def keccak256(data):
    hasher = keccak.new(digest_bits=256)
    hasher.update(data)
    return hasher.digest()


def verifying_key_to_addr(key):
    pub_key = key.to_string()
    primitive_addr = b'\x41' + keccak256(pub_key)[-20:]
    addr = base58.b58encode_check(primitive_addr)
    return addr


print("=> my addr key")
raw_priv_key = bytes.fromhex(MY_PRIV_KEY)

priv_key = ecdsa.SigningKey.from_string(raw_priv_key, curve=ecdsa.SECP256k1)
pub_key = priv_key.get_verifying_key().to_string()
print('Pub Key:', pub_key.hex())

primitive_addr = b'\x41' + keccak256(pub_key)[-20:]
addr = base58.b58encode_check(primitive_addr)
print('My Addr:', addr)

print('=> createtransaction')
transaction = {
    "to_address": base58.b58decode_check(TO_ADDR).hex(),
    "owner_address": primitive_addr.hex(),
    "amount": AMOUNT,
}

resp = requests.post(API_BASE_URL + '/wallet/createtransaction', json=transaction)
payload = resp.json()

raw_data = bytes.fromhex(payload['raw_data_hex'])
signature = priv_key.sign_deterministic(raw_data, hashfunc=hashlib.sha256)

# recover address to get rec_id
pub_keys = ecdsa.VerifyingKey.from_public_key_recovery(
    signature[:64], raw_data, curve=ecdsa.SECP256k1, hashfunc=hashlib.sha256
)
for v, pk in enumerate(pub_keys):
    if verifying_key_to_addr(pk) == addr:
        break

signature += bytes([v])

print('signature =', signature.hex())
payload['signature'] = [signature.hex()]

pprint(payload)

print('=> broadcasttransaction')
resp = requests.post(API_BASE_URL + '/wallet/broadcasttransaction', json=payload)

result = resp.json()

pprint(result)
if 'message' in result:
    print('Message:', bytes.fromhex(result['message']))
