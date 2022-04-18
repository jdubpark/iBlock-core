/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import heart from '../../../assets/icons/Heart.svg'

function NFTTitleArea() {
  return (
    <section className="relative w-full h-[100vh] overflow-hidden z-20">
      <section className="flex flex-col justify-between">
        <div className="flex items-center justify-between mb-[5px] max-w-full">
          <div className="flex items-center max-w-full w-48 overflow-hidden text-ellipsis whitespace-nowrap">
            <div className="flex items-center overflow-hidden text-ellipsis">
              <a className="text-[16px] overflow-hidden text-ellipsis whitespace-nowrap text-blue-500 font-semibold" href="/collection/boredapeyachtclub">Bored Ape Yacht Club</a>
            </div>
          </div>
        </div>
        <h1 className="max-w-full m-0  text-ellipsis font-bold text-4xl ">#3368</h1>
      </section>
      <section className="justify-center items-center flex flex-row">
        <div className="justify-center items-center flex-row flex">
          <div className="flex h-10 w-full items-center justify-center">
            Owned by&nbsp;
            <a className="text-m text-gray-400" href="/DDGNft"><span>DDGNft</span></a>
          </div>
        </div>
        <button aria-label="Favorited by" display="flex" className="UnstyledButtonreact__UnstyledButton-sc-ty1bh0-0 btgkrL Blockreact__Block-sc-1xf18x6-0 Countreact__Container-sc-13kp31z-0 gdHQWX iMVWtI" type="button">
          <div className="Blockreact__Block-sc-1xf18x6-0 Flexreact__Flex-sc-1twd32i-0 FlexColumnreact__FlexColumn-sc-1wwz3hp-0 VerticalAlignedreact__VerticalAligned-sc-b4hiel-0 CenterAlignedreact__CenterAligned-sc-cjf6mn-0 ePfTsZ jYqxGr ksFzlZ iXcsEj cgnEmv">
            <i value="favorite" size="24" className="Iconreact__Icon-sc-1gugx8q-0 irnoQt material-icons">favorite</i>
          </div>
          383 favorites
        </button>
      </section>
    </section>
  )
}

export default NFTTitleArea
