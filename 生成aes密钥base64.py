from base64 import urlsafe_b64encode
import os

def generate_aes_256_cbc_key():
    # 直接生成32字节的随机数据作为AES密钥
    aes_key = os.urandom(32)
    return aes_key

# 生成AES-256-CBC密钥
aes_256_cbc_key = generate_aes_256_cbc_key()

# 将二进制密钥进行Base64编码，以便于保存和传输
encoded_aes_key = urlsafe_b64encode(aes_256_cbc_key).decode('utf-8')

print("AES-256-CBC 密钥 (Base64编码):", encoded_aes_key)
