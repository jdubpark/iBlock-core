from eth_account import account
from web3 import Web3
import web3.contract as sc

import json

from flask import Flask
from flask import request

# hardcoded values that need to be changed
account_address = "0x5371c1D0008dBed929fc684771367691Fb0919a2" # needs to be changed when we run on actual chain, and even when we plug in auth
# note - we should eventually use w3.eth.default_account = ....  to set it to the account of the person when logged in to their session
adminContractAddress = "0x403DE818D65e8162383a13CaD098F035216D100e"
mplaceContractAddress = "0xbB46E5c86E6d78a4192A9Af1f73367B7b18273A5"
api_port = 80

## EXAMPLE CALL PSUEDO - using createItemOrder as an example
# post request to "http:141.142.218.58:80/marketplace/createItemOrder" and pass in json {_item_id:0, _item_quantities_ordered_by_size:[1,2,3,1,2]}


################################   NOTES #########################
# accessing query parameters - https://stackoverflow.com/questions/10434599/get-the-data-received-in-a-flask-request
# .call() is being used for read-only functions, and .transact() for functions that update blockchain state


app = Flask(__name__)

w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:10000'))

# pulling in the JSON of the compiled artifacts - starting only with Marketplace
truffleMarketplace = json.load(open('../truffle/build/contracts/Marketplace.json'))
truffleAdmin = json.load(open('../truffle/build/contracts/Admin.json'))

# pulling out abi and bytecode of the contracts
abiMPlace=truffleMarketplace['abi']
bytecodeMPlace = truffleMarketplace['bytecode']

abiAdmin = truffleAdmin['abi']
bytecodeAdmin = truffleAdmin['bytecode']


# creating a contract object - hardcoded addresses should constantly be updated
mplaceContract = w3.eth.contract(address=mplaceContractAddress,abi=abiMPlace)
adminContract = w3.eth.contract(address=adminContractAddress,abi=abiAdmin)



################################ ADMIN ########################################
# pairStudentIdAddress
@app.route("/admin/pairStudentIdAddress", methods = ['GET','POST'])
def pairStudentIdAddress():
    response = request.args
    print(response)

    _studentId = response["_studentId"].encode('utf-8')

    tx_hash = adminContract.functions.pairStudentIdAddress(_studentId).transact({"from":account_address})
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return str(receipt)

# studentIdToAddress
@app.route("/admin/studentIdToAddress", methods = ['GET','POST'])
def studentIdToAddress():
    response = request.args
    print(response)
    mp = adminContract.functions.studentIdToAddress(response["_studentId"].encode('utf-8')).call()
    return str(mp)


################################ MARKETPLACE ###################################

@app.route("/")
def low_inventory_check():
    print("mplaceContract.functions.low_inventory_limit in local scope is",mplaceContract.functions.low_inventory_limit)
    mp = mplaceContract.functions.low_inventory_limit().call()
    return "TEST - lowinventorylimit is "+str(mp)


# netIdToBigOrderIds
@app.route("/marketplace/netIdToBigOrderIds", methods = ['GET','POST'])
def netIdToBigOrderIds():
    response = request.args
    print(response)
    mp = mplaceContract.functions.netIdToBigOrderIds(response["_netId"]).call()
    return str(mp)


# BigOrderIdToBigOrder
@app.route("/marketplace/BigOrderIdToBigOrder", methods = ['GET','POST'])
def BigOrderIdToBigOrder():
    response = request.args
    print(response)
    mp = mplaceContract.functions.BigOrderIdToBigOrder(response["_big_order_id"]).call()
    return str(mp)

# itemOrderIdToItemOrder
@app.route("/marketplace/itemOrderIdToItemOrder", methods = ['GET','POST'])
def itemOrderIdToItemOrder():
    response = request.args
    print(response)
    mp = mplaceContract.functions.itemOrderIdToItemOrder(response["_itemOrderId"]).call()
    return str(mp)

# testing encoding for writing data to the chain
@app.route("/marketplace/testSimpleWrite", methods = ['GET','POST'])
def testSimpleWrite():
    response = request.args
    print(response)

    _newInt = int(response["_newInt"])
    _newBytes32 = response["_newBytes32"].encode('utf-8')
    _newStringArray = json.loads(response["_newStringArray"])
    _newNestedArray = json.loads(response["_newNestedArray"])

    print(_newInt, _newBytes32, _newStringArray, _newNestedArray)

    tx_hash = mplaceContract.functions.testSimpleWrite(_newInt, _newBytes32, _newStringArray, _newNestedArray).transact({"from":account_address})
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return str(receipt)

# createItem
@app.route("/marketplace/createItem", methods = ['GET','POST'])
def createItem():
    response = request.args
    print(response)

    _name = response["_name"].encode('utf-8')
    _price = int(response["_price"])
    _urls = json.loads(response["_urls"])
    _stock_by_size_and_location = json.loads(response["_stock_by_size_and_location"])

    tx_hash = mplaceContract.functions.createItem(_name, _price, _urls, _stock_by_size_and_location).transact({"from":account_address})
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return str(receipt)



# createItemOrder
@app.route("/marketplace/createItemOrder", methods = ['GET','POST'])
def createItemOrder():
    response = request.args
    print(response)

    _item_id = int(response["_item_id"])
    _item_quantities_ordered_by_size = json.loads(response["_item_quantities_ordered_by_size"])

    tx_hash = mplaceContract.functions.createItemOrder(_item_id, _item_quantities_ordered_by_size).transact({"from":account_address})
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return str(receipt)

# createBigOrder
@app.route("/marketplace/createBigOrder", methods = ['GET','POST'])
def createBigOrder():
    response = request.args
    print(response)

    _picking_up_in_person = bool(response["_picking_up_in_person"])
    _shipping_address = response["_shipping_address"]

    tx_hash = mplaceContract.functions.createBigOrder(_picking_up_in_person, _shipping_address).transact({"from":account_address})
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return str(receipt)

# orderSubmitted
@app.route("/marketplace/orderSubmitted", methods = ['GET','POST'])
def orderSubmitted():
    response = request.args
    print(response)

    _big_order_id = int(response["_big_order_id"])
    _quantity_by_itemOrder_size_and_location = json.loads(response["_quantity_by_itemOrder_size_and_location"])

    tx_hash = mplaceContract.functions.orderSubmitted(_big_order_id, _quantity_by_itemOrder_size_and_location).transact({"from":account_address})
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return str(receipt)



if __name__ == "__main__":
    app.run(port=api_port,debug=True)
