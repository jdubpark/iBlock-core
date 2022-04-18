// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

import "../SampleToken.sol";

contract Faucet is Ownable {
    SampleToken token;
    uint mintAmount;
    address _trustedForwarder;

    uint timeout = 30 minutes;
    mapping (address => uint) timeouts;

    event Drip(address indexed to);

    constructor(address _tokenAddress, uint _mintAmount) {
        token = SampleToken(_tokenAddress);
        mintAmount = _mintAmount * 10 ** token.decimals(); // add with decimals (arg is passed without decimals)
    }

    // Drip to msg.sender
    function drip() external {
        require(timeouts[msg.sender] <= block.timestamp - timeout, "DRIP_COOLDOWN");

        console.log("Faucet sender: %s", msg.sender);
        console.log("Faucet mint amount: %s", mintAmount);
        token.mint(msg.sender, mintAmount);
        timeouts[msg.sender] = block.timestamp;

        emit Drip(msg.sender);
    }

    function canDrip() private view returns (bool) {
        return timeouts[msg.sender] <= block.timestamp - timeout;
    }

    // @param {address} owner - address to check on SampleToken
    function _balanceOf(address _owner) private view returns (uint) {
        return token.balanceOf(_owner);
    }

    /*
    function destroy() private {
        require(msg.sender == owner, "Only the owner of this faucet can destroy it.");
        selfdestruct(msg.sender);
    }
    */
}
