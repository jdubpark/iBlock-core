import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import web3 from './web3'
import Header from '../../layouts/marketplace/Header'
import Modal from '../../components/Modal'
import { loadUserNFTs } from './nftFunctions'
import PersonalItem from '../../components/PersonalItem'
import NFTTitleArea from './NFTComponents/NFTTitleArea'
import NFTImageContainer from './NFTComponents/NFTImageContainer'
import DetailBox from './NFTComponents/DetailBox'
import NFTSaleArea from './NFTComponents/NFTSaleArea'
import NFTListings from './NFTComponents/NFTListings'
import NFTOffers from './NFTComponents/NFTOffers'
import NFTPriceHistory from './NFTComponents/NFTPriceHistory'
import ItemActivity from './NFTComponents/ItemActivity'
// import Modal from '../../components/Modal'

export default function NFTDetails() {
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [web3Accounts, setWeb3Accounts] = useState([])
  const nft = useSelector((state) => state.marketplace.currentNft)

  return (
    <section className="relative w-full h-[100vh] overflow-hidden z-20">
      <div className="grid grid-rows-[90%_10%] h-full">
        <div className="grid grid-cols-[40%_60%]">
          <div className="flex flex-col justify-center items-center">
            <NFTImageContainer image={nft.image} />
            <div />
          </div>

          <section className="flex h-[10vh]">
            <NFTTitleArea />
          </section>
        </div>
      </div>
    </section>
  )
}
