import axios from 'axios'
import { ethers } from 'ethers'
import {
  nftaddress, nftmarketaddress,
} from '../../configs/contracts/contract_config'

import { NFTMarket, NFT, GiesCoin } from '../../contracts'

export async function loadMarketNFTs() {
  const data = await NFTMarket.methods.fetchMarketItems().call()

  const items = await Promise.all(data.map(async (i) => {
    const tokenUri = await NFT.methods.tokenURI(i.tokenId).call()
    const meta = await axios.get(tokenUri)
    const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    const item = {
      price,
      itemId: Number(i.itemId),
      tokenId: Number(i.tokenId),
      category: Number(i.category),
      creator: i.creator,
      currentOwner: i.currentOwner,
      listed: i.listed,
      saleIndex: i.saleIndex,
      nftContract: i.nftContract,
      image: meta.data.image,
      name: meta.data.name,
      description: meta.data.description,
    }
    return item
  }))
  return items
}

export async function loadCreatedNFTs() {
  const data = await NFTMarket.methods.fetchItemsCreated().call()

  const items = await Promise.all(data.map(async (i) => {
    const tokenUri = await NFT.methods.tokenURI(i.tokenId).call()
    const meta = await axios.get(tokenUri)
    const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    const item = {
      price,
      itemId: Number(i.itemId),
      tokenId: Number(i.tokenId),
      category: Number(i.category),
      creator: i.creator,
      currentOwner: i.currentOwner,
      listed: i.listed,
      saleIndex: i.saleIndex,
      nftContract: i.nftContract,
      image: meta.data.image,
      name: meta.data.name,
      description: meta.data.description,
    }
    return item
  }))
  return items
}

export async function buyNft(nft, web3Accounts) {
  console.log(web3Accounts)
  const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
  let transaction = await GiesCoin.methods.approve(nftmarketaddress, price).send({ from: web3Accounts[0] })
  transaction = await NFTMarket.methods.createMarketSale(nftaddress, nft.itemId).send({ from: web3Accounts[0] })
  const items = await loadMarketNFTs()
  return (items)
}

export async function loadUserNFTs(account) {
  const data = await NFTMarket.methods.fetchMyNFTs().call({ from: account })
  console.log(data)
  const items = await Promise.all(data.map(async (i) => {
    const tokenUri = await NFT.methods.tokenURI(i.tokenId).call()
    console.log(tokenUri)
    console.log(i.seller)
    const meta = await axios.get(tokenUri)
    const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    const item = {
      price,
      tokenId: Number(i.tokenId),
      seller: i.seller,
      owner: i.owner,
      sold: i.sold,
      image: meta.data.image,
      name: meta.data.name,
    }
    return item
  }))
  return items
}

export async function sellNft(nft, lister, price) {
  let listingPrice = await NFTMarket.methods.getListingPrice().call()
  listingPrice = listingPrice.toString()
  const sellPrice = ethers.utils.parseUnits(price.toString(), 'ether')
  let transaction = await GiesCoin.methods.approve(nftmarketaddress, listingPrice).send({ from: lister })
  transaction = await NFTMarket.methods.createMarketItem(nftaddress, nft.tokenId, sellPrice).send({ from: lister })
  const items = await loadUserNFTs(lister)
  return (items)
}
