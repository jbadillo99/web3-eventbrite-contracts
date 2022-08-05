// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Web3EventBrite {

    // The CreateEvent struct provides a struct of with specific event attributes
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

    // Use a dictionary to map event Id to an event struct
    mapping(bytes32 => CreateEvent) public idToEvent;

    /*
        The createNewEvent function uses external visibility to perform better which ends up saving on gas.

     */
    function createNewEvent(
        uint256 eventTimestamp,
        uint256 deposit,
        uint256 maxCapacity,
        string calldata eventDataCID // The calldata memory type is an immutable and temporary memory location
    ) external{

        /*
            Create an eventId by hashing using a unique hash value based on the specific parameters of the function.
            This helps avoid collisions
        */
        bytes32 eventId = keccak256(
            abi.encodePacked(
                msg.sender,
                address(this),
                eventTimestamp,
                deposit,
                maxCapacity
            )
        );

        address[] memory confirmedRSVPs;
        address[] memory claimedRSVPs;

        idToEvent[eventId] = CreateEvent(
            eventId,
            eventDataCID,
            msg.sender,
            eventTimestamp,
            deposit,
            maxCapacity,
            confirmedRSVPs,
            claimedRSVPs,
            false
        ); 
    }

    function createNewRSVP(bytes32 eventId) external payable {

        // Using storage we consume more gas but it helps to keep each execution of the smart contract
        CreateEvent storage myEvent = idToEvent[eventId];

        // Require that the user sends enough ETH to cover the deposit
        require(msg.value == myEvent.deposit, "INSUFFICIENT FUNDS");

    }

}
