import {
  SET_CURRENT_NFT
} from '../../constants/ActionTypes'

const initialState = {
  currentNft: {},
}

const nfts = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_NFT:
      return { ...state, currentNft: action.payload }
    default:
      return state
  }
}

export default nfts
