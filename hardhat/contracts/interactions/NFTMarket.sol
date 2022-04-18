// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "../GiesCoin.sol";

/**
 * @title NFTMarket
 * @dev NFT Marketplace Smart Contract for ownership
 * TODO Make Reselling Functionality
 */

contract NFTMarket is ReentrancyGuard{
    // ERC 20 Transfer
    GiesCoin private gcoToken;

    event TransferSent(address _senderAddress, address _destAddress, uint256 _amount);

    // Marketplace Code
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address owner;
    uint256 listingPrice = 0.025 ether;

    constructor(address _gcoTokenAddress) {
        owner = address(msg.sender); // Tentatively change to beneficiary
        gcoToken = GiesCoin(_gcoTokenAddress);
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address seller;
        address owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /* Places an item for sale on the marketplace */
    function createMarketItem(address nftContract, uint256 tokenId, uint256 price) public nonReentrant {
        require(price > 0, "Price must be at least 1 wei");

        //Creator transfers listing price in merchcoin and ownership to the smart contract
        gcoToken.transferFrom(address(msg.sender),address(this),listingPrice);

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] =  MarketItem(itemId, nftContract, tokenId, address(msg.sender), address(0), price, false);

        //Transfer nft ownership to marketplace contract
        IERC721(nftContract).transferFrom(address(msg.sender), address(this), tokenId);
        //Log creation of Market Item
        emit MarketItemCreated(itemId,nftContract,tokenId,msg.sender,address(0),price,false);
    }

    function createMarketSale(address nftContract, uint256 itemId) public nonReentrant {
        uint256 price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        uint256 erc20balance = gcoToken.balanceOf(address(msg.sender));
        require(erc20balance >= price, "Insufficient GiesCoin funds to complete the purchase");

        gcoToken.transferFrom(address(msg.sender),address(idToMarketItem[itemId].seller),price);
        IERC721(nftContract).transferFrom(address(this), address(msg.sender), tokenId);
        idToMarketItem[itemId].owner = address(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();
        gcoToken.approve(address(this),listingPrice);
        gcoToken.transferFrom(address(this),owner,listingPrice);
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns onlyl items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items a user has created */
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
