// FROM: https://github.com/Uniswap/v3-periphery/blob/main/contracts/test/TestMulticall.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;
pragma abicoder v2;

import '../library/MultiCall.sol';

contract TestMultiCall is MultiCall {
    uint256 public paid;

    struct Tuple {
        uint256 a;
        uint256 b;
    }

    function pays() external payable {
        paid += msg.value;
    }

    function functionThatRevertsWithError(string memory error) external pure {
        revert(error);
    }

    function functionThatReturnsTuple(uint256 a, uint256 b) external pure returns (Tuple memory tuple) {
        tuple = Tuple({b: a, a: b});
    }

    function returnSender() external view returns (address) {
        return msg.sender;
    }
}
