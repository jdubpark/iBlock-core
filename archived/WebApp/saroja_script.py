
from web3 import Web3

#import web3 as Web3 

import json

import web3.contract as sc


 

w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:10000'))

b = w3.isConnected()

print(b)


 

truffleAdmin = json.load(open('/home/admin/iBlock/truffle/build/contracts/Admin.json'))

truffleMarketplace = json.load(open('/home/admin/iBlock/truffle/build/contracts/Marketplace.json'))

truffleOwnable = json.load(open('/home/admin/iBlock/truffle/build/contracts/Ownable.json'))

truffleMigrations = json.load(open('/home/admin/iBlock/truffle/build/contracts/Migrations.json'))


 

abiAdmin = truffleAdmin['abi']

print(abiAdmin)


 

abiMPlace=truffleMarketplace['abi']

#print(abiMPlace)


 

bytecodeAdmin = truffleAdmin['bytecode']

print(bytecodeAdmin)


 

bytecodeMPlace = truffleMarketplace['bytecode']

#print(bytecode)


 

block=w3.eth.getBlock('latest')

#print(block)


 

#NameContract = w3.eth.contract(abi=abi, bytecode=bytecode)


 

#Con = w3.eth.contract("HelloWorld")


 

#tx_hash=NameContract.constructor().transact()

#tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

#adminAddress = "0x00000000000000000000000000000000000000000"

adminAddress = "0xcb288702cddb60d6a589a5befd2967863bd956d8";

#adminAddress = "0xcb288702cddb60d6a589a5befd2967863bd956d9" #wrong address

adminAddress = w3.toChecksumAddress(adminAddress)

adminContract = w3.eth.contract(address="0x4578c9173E385CE5aE2630aBD91f0A127325F780",abi=abiAdmin)

mplaceContract = w3.eth.contract(address="0x6607c63C4B01e26A898607AE865902Fe40Da7Da8",abi=abiMPlace)

mp = mplaceContract.functions.low_inventory_limit.call()

print(mp)

v = adminContract.functions.isAdmin(adminAddress).call()