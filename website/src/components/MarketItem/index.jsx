/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { loadMarketNFTs, buyNft } from '../../pages/marketplace/nftFunctions'
import heart from '../../assets/icons/Heart.svg'
import { SET_CURRENT_NFT } from '../../constants/ActionTypes'
/*
  Need to make redux store for current nft that was pressed
  dispatch({type:SET_CURRENT_NFT,payload:nft});
 */
function MarketItem({
  nft, setNfts, setLoadingState,
}) {
  const [hovered, toggleHover] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()
  return (
    <motion.div
      className="border shadow-sm rounded-xl overflow-hidden h-[22rem] w-64 grid grid-rows-[78%_15%_7%] place-items-center"
      whileHover={{
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        scale: 1.01,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => { toggleHover(true) }}
      onHoverEnd={() => toggleHover(false)}
      onClick={() => {
        dispatch({ type: SET_CURRENT_NFT, payload: nft })
        history.push(`/marketplace/item/${nft.nftContract}/${nft.tokenId}`)
      }}
    >
      <div className="flex h-full w-full max-h-full max-w-full justify-center align-center">
        <img src={nft.image} alt="nftImage" />
      </div>
      <div className="grid grid-cols-[50%_50%] h-full w-11/12 max-h-full max-w-full justify-center items-center drop-shadow">
        <div className="flex flex-col h-full w-full max-h-full max-w-full justify-center items-start">
          <div>
            <p className="text-xs font-medium text-gray-500">{`#${nft.tokenId}`}</p>
          </div>
          <div>
            <p className="text-base font-semibold">{nft.name}</p>
          </div>
        </div>
        <div className="flex flex-col h-full w-full max-h-full max-w-full justify-center items-end">
          <div>
            <p className="text-xs font-medium text-gray-500">Price</p>
          </div>
          <div>
            <p className="text-base font-semibold">{`${nft.price} GCO`}</p>
          </div>
        </div>
      </div>
      <footer
        className="flex h-full w-full max-h-full max-w-full justify-center items-center"
        style={{
          background: 'linear-gradient(rgba(229, 232, 235, 0.392) 0%, rgb(255, 255, 255) 20%)',
        }}
      >
        <div className="grid grid-cols-[50%_50%] h-full w-11/12 max-h-full max-w-full justify-center">
          <div className="flex flex-col h-full w-full max-h-full max-w-full justify-center items-start">
            { hovered ? <p className=" cursor-default text-xs font-medium text-blue-500">Buy Now</p> : <div className="flex flex-col h-full w-full" /> }
          </div>
          <div className="flex h-4/5 w-full max-h-full max-w-full justify-end items-center">
            <img src={heart} alt="Like Btn" />
          </div>
        </div>
      </footer>
    </motion.div>

  )
}

export default MarketItem
