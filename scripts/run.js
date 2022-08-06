const hre = require("hardhat");

const main = async () => {

    // Deploy contract locally
    const rsvpContractFactory = await hre.ethers.getContractFactory("Web3EventBrite");
    const rsvpContract = await rsvpContractFactory.deploy();
    await rsvpContract.deployed();
    
    console.log("Contract deployed to:", rsvpContract.address);

    // Get deployer wallet address and two test addresses
    const [deployer, address1, address2] = await hre.ethers.getSigners();

    // Define event data
    let deposit = hre.ethers.utils.parseEther("1");
    let maxCapacity = 3;
    let timestamp = 1718926200;
    let eventDataCID = "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";

    // Creat a transaction event using the mock data
    let txn = await rsvpContract.createNewEvent(
        timestamp,
        deposit,
        maxCapacity,
        eventDataCID
    );

    // Wait for the event and assign an array of the emmitted variables
    let wait = await txn.wait();
    console.log("NEW EVENT CREATED: ", wait.events[0].event, wait.events[0].args);

    let eventId = wait.events[0].args.eventID;
    console.log("EVENT ID: ", eventId);

    // By default hardhat calls contracts from the deployer wallet address
    // To call contract functions from another wallet use the .connect(address) modifier
    txn = await rsvpContract.createNewRSVP(eventId, {value: deposit});
    wait = await txn.wait();
    console.log("NEW RSVP: ", wait.events[0].event, wait.events[0].args);

    txn = await rsvpContract
        .connect(address1)
        .createNewRSVP(eventId, {value:deposit});
    wait = await txn.wait();
    console.log("NEW RSVP: ", wait.events[0].event, wait.events[0].args);

    txn = await rsvpContract
        .connect(address2)
        .createNewRSVP(eventId, {value:deposit});
    wait = await txn.wait();
    console.log("NEW RSVP: ", wait.events[0].event, wait.events[0].args);

    // Since we created the event from the deployer address
    // We also have to call the function from the deployer address
    txn = await rsvpContract.confirmAllAttendees(eventId);
    wait = await txn.wait();
    wait.events.forEach((event) => 
        console.log("CONFIRMED", event.args.attendeeAddress)
    );
    
    // Wait 10 years
    // Hard hat allows us to simulate time passing
    await hre.network.provider.send("evm_increaseTime", [15778800000000]);
    txn = await rsvpContract.withdrawUnclaimedDeposits(eventId);
    wait = await txn.wait();
    console.log("WITHDRAWN: ", wait.events[0].event, wait.events[0].args);
};


const runMain = async () => {
    try {
        await main();
        process.exit(0)
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();