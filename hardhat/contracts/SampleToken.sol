// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

import "hardhat/console.sol";

/**
 * Functions should be grouped according to their visibility and ordered:
 * constructor
 * receive function (if exists)
 * fallback function (if exists)
 * external
 * public
 * internal
 * private
 * (Within a grouping, place the view and pure functions last.)
 */
/**
 * state variables are always in storage
 * function arguments are always in memory
 * local variables of struct, array or mapping type reference storage by default
 * local variables of value type (i.e. neither array, nor struct nor mapping) are stored in the stack
 */

contract SampleToken is ERC20PresetMinterPauser, ERC20Permit, Ownable {
    uint constant MINT_AMOUNT = 10 ** 3 * 10 ** 2; // 2 is decimals

    mapping(address => string) private _associatedAddresses;
    mapping(string => address[]) private _associatedAddressesById;
    mapping(string => bool) private _associatedIds;
    mapping(string => bool) private _previouslyAssociatedIds;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply
    ) ERC20PresetMinterPauser(_name, _symbol) ERC20Permit(_name) {
        _mint(_msgSender(), _initialSupply * 10 ** decimals());
        console.log("Contract constructor caller: ", _msgSender());
    }

    function versionRecipient() external pure returns (string memory) { return "1"; }

    // automatically only allows accounts with DEFAULT_ADMIN_ROLE
    function setAsMinter(address _addr) public {
        grantRole(MINTER_ROLE, _addr);
    }

    /**
     * Only the owner can associate the address. This would be done by the owner address calling the function on backend.
     * The overall flow:
     * (1) User submits transaction with msg `[netId] I am the owner of this calling address`
     * (2) User posts to the backend the tx receipt acquired after (1) (include in the post is Microsoft JWT)
     * (3a) Backend parses `Bearer token` to get User's netId (via Microsoft)
     * (3b) Backend checks for transaction using the provided tx receipt. If pending, listen on txs until mined
     * (4) Backend checks the msg submitted in (1) against its parsed netId
     * (5) If valid, backend calls this function using the owner address & key
     *
     * This requires a lot of steps because we can't trust that the user is providing their netId. By involving backend,
     *  we can guarantee that by matching `what user has posted on blockchain`
     *  and `what we can verify with JWT token via Microsoft,` we can validate the netId posted on blockchain
     */
    function associateAddress(string memory _id) public onlyOwner {
        require(bytes(_id).length != 0, "ID can't be empty");
        _associatedAddresses[_msgSender()] = _id;
        _associatedAddressesById[_id].push(_msgSender());
        _associatedIds[_id] = true;

        // Mint only if ID was never associated before
        if (!_previouslyAssociatedIds[_id]) {
            _mint(_msgSender(), MINT_AMOUNT);
        }

        _previouslyAssociatedIds[_id] = true;
    }

//    function dissociateAddress() public onlyOwner {
//        string memory associatedId = _associatedAddresses[_msgSender()];
//
//        // Address is associated to some id
//        if (bytes(associatedId).length != 0) {
//            _associatedAddresses[_msgSender()] = "";
//
//            // Search for the index of the address (to be deleted)
//            uint i = 0;
//            uint oldLength = _associatedAddressesById[associatedId].length;
//            while (_associatedAddressesById[associatedId][i] != _msgSender() && i < oldLength) {
//                i++;
//            }
//
//            // Delete the address from the array of associated address
//            if (i < oldLength) {
//                // Replace the to-be-deleted address with the last address,
//                //  and pop the last element (thus a substitution, not preserving order)
//                _associatedAddressesById[associatedId][i] = _associatedAddressesById[associatedId][oldLength - 1];
//                _associatedAddressesById[associatedId].pop();
//
//                // _associatedAddressesById[associatedId].length--; but since it's memory, we need to use inline Assembly
//                // - make sure array is not empty
//                // - make sure array is resizable
//                if (_associatedAddressesById[associatedId].length > 0) {
//                    assembly { mstore(_associatedAddressesById[associatedId], sub(mload(_associatedAddressesById[associatedId]), 1)) }
//                }
//            }
//
//            // If the new array has no address associated, set associated id to `false`
//            if (_associatedAddressesById[associatedId].length == 0) {
//                _associatedIds[associatedId] = false;
//            }
//        }
//    }

    function isAddressAssociated(address _addr) public view returns (bool) {
        return bytes(_associatedAddresses[_addr]).length != 0; // zero data is "" ==> bytes("").length == 0
    }

    function isIdAssociated(string memory _id) public view returns (bool) {
        return _associatedIds[_id];
    }

    function getAssociatedId(address _addr) public view returns (string memory) {
        return _associatedAddresses[_addr];
    }

    function getAssociatedById(string memory _id) public view returns (address[] memory) {
        return _associatedAddressesById[_id];
    }

    function version() public pure virtual returns (string memory) { return "1"; }

    /**
     * Override decimals to 2 (akin to cents)
     */
    function decimals() public override pure returns (uint8) {
        return 2;
    }

    /**
     * Needed to override ERC20 (imported by ERC20Permit) & ERC20PresetMinterPauser
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20, ERC20PresetMinterPauser) {
        super._beforeTokenTransfer(from, to, amount);
    }

    function unsetAsMinter(address _addr) private {
        revokeRole(MINTER_ROLE, _addr);
    }
}
