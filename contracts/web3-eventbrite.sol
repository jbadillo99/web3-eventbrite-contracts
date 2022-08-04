// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Web3EventBrite {

    struct CreateEvent {
        bytes32 eventId;
        string eventDataCID;    //Hash to store in IPFS to avoid storing more data on chain
        address eventOwner;
        uint256 eventTimestamp;
        uint256 deposit;
        uint256 maxCapacity;
        address[] confirmedRSVPs;
        address[] claimedRSVPs;
        bool paidOut;
    }
}
