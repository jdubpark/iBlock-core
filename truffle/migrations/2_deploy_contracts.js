var Admin = artifacts.require("./Admin.sol");
var GiesCoin = artifacts.require("./GiesCoin.sol");
var MerchCoin = artifacts.require("./MerchCoin.sol");
var UtilFunctions = artifacts.require("UtilFunctions");
var Accessibility = artifacts.require("Accessibility");
var Ownership = artifacts.require("Ownable");
var NFT = artifacts.require("./NFT.sol")
var NFTMarket = artifacts.require('./NFTMarket.sol')
var fs = require('fs');

const doDeploy = async function doDeploy (deployer,accounts) { 


    
    const first_admin = accounts[0];
    const DLab_index = accounts.length - 1 ; 
    const DLab_address = accounts[DLab_index];
    // should be read from config file
    await deployer.deploy(UtilFunctions);
    await deployer.deploy(Accessibility);
    await deployer.deploy(Ownership);
    await deployer.link(Ownership,[Admin]);
    await deployer.link(UtilFunctions,[Admin, GiesCoin,MerchCoin]);
    await deployer.link(Accessibility,[Admin, GiesCoin,MerchCoin]);
    await deployer.deploy(Admin, first_admin);
    const admin = await Admin.deployed();
    await deployer.deploy(GiesCoin,10000, admin.address);
    const gcotoken = await GiesCoin.deployed();
    await deployer.deploy(MerchCoin, 10000, admin.address);
    const mcotoken = await MerchCoin.deployed();
    await deployer.deploy(NFTMarket, mcotoken.address,gcotoken.address);
    const market = await NFTMarket.deployed();
    await deployer.deploy(NFT,market.address);
    //await deployer.deploy(Marketplace, MerchCoin.address, Admin.address, DLab_address);

    console.log("Admin.address",Admin.address);
    console.log("GiesCoin.address",GiesCoin.address);
    console.log("MerchCoin.address",MerchCoin.address);
    console.log("NFT.address",NFT.address);
    console.log("NFTMarket.address",NFTMarket.address);

    const _addressBook = {
        "Admin" : Admin.address,
        "GiesCoin" : GiesCoin.address,
        "MerchCoin" : MerchCoin.address,
        "NFT" : NFT.address,
        "NFTMarket" : NFTMarket.address
    };
    const addressBook = JSON.stringify(_addressBook);
    fs.writeFile( __dirname + '/../build/contractAddress.json', addressBook, function(err, result) {
        if(err) console.log('error', err);
    });
};


module.exports = function(deployer,network, accounts) {
    deployer.then( async() => await doDeploy(deployer,accounts));
};
    



 
// module.exports = function(deployer) {
// //   deployer.deploy(Ownership);
// //   deployer.deploy(UtilFunctions);
// //   deployer.deploy(Accessibility);
//   deployer.deploy(Admin, first_admin).then(function () {
//       deployer.deploy(GiesCoin,200, "Gies Coin", "GCO", Admin.address).then(function () {
//           deployer.deploy(MerchCoin,200, "Merch Coin", "MCO", Admin.address).then(function () {
//               deployer.deploy(Marketplace,MerchCoin.address, Admin.address, DLab_address)
//           })
//       })
//   });
// };



// module.exports = function(deployer) {
//       deployer.deploy(Ownership);
//       deployer.deploy(UtilFunctions);
//       deployer.deploy(Accessibility);
// };