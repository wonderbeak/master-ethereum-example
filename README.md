# master-ethereum-example
Ethereum example for Master's work.
All actions performed on MacOS v10.14 in Terminal.

# Description
Following Smart Contract will be developed:
- Customer describes the task and set the amount of cryptocurrency he wants to pay
- Expert is doing received tasks and earns cryptocurrency from them
- If task was completed and Customer confirms that - Expert will receive his cryptocurrency amount automatically by Smart Contract
- If not then money will be returned back to Customer
- To perform deployment of Smart Contract - 3rd person Worker should be funded for that action

# Installation Procedure
To implement an Ethereum smart contract for a blockchain marketplace, you need the following tools:
* [Node.js](https://nodejs.org/en/) − A JavaScript runtime environment for server-side programming to perform testing the functionality of your Ethereum smart contract and ensuring its proper and secure operation.

* [Truffle](https://truffleframework.com/) − An Ethereum development framework that allows you to write and test smart contracts.
* [Ganache CLI](https://truffleframework.com/ganache) − An Ethereum remote procedure call (RPC) client within the Truffle framework.

## Compile and Deployment
In Terminal clone Smart Contract project to local directory and compile. Also 
```
git clone https://github.com/wonderbeak/master-ethereum-example.git
cd master-ethereum-example
npm install
truffle compile
```
Before deployment to local Test Network Ganachi should be configured as in [truffle.js](https://github.com/wonderbeak/master-ethereum-example/blob/master/truffle.js) - host: 127.0.0.1, port: 8545 and 3 accounts in Ganachi (in Ganachi Settings)
After that perform migration of Smart Contract to Ganachi.
```
truffle migrate
```
![Migrations](https://imgur.com/download/P5khYmP)

# Tests
Tests were performed in Javascript and shows the main logic of Smart Contract. To perform tests:
```
truffle test
```

![Tests](https://imgur.com/download/KKQWQUM)

After this tests you will find that all 3 accounts performed some transactions. For detailed transactions details press Transactions tab in Ganachi.

![Test Results in Ganachi](https://imgur.com/download/8h31QbR)


# Smart Contracts
Smart Contract for Deployment
```
pragma solidity ^0.5.0;

contract Migrations {
  address public owner;
  uint public last_completed_migration;

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  constructor() public {
    owner = msg.sender;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
```

Smart Contract for Payment
```
pragma solidity 0.5.0;

contract PayContract {
  address payable public worker;
  address payable public customer;
  address payable public expert;

  uint256 public amountToPay;

  constructor (address payable _customer, address payable _expert) public {
    worker = msg.sender;

    customer = _customer;
    expert = _expert;

    amountToPay = 0;
  }

  function () external payable {
    require(customer == msg.sender);
    amountToPay += msg.value;
  }

  function payAmountToExpert() public {
    require(worker == msg.sender);

    // transfer pay amount to expert
    expert.transfer(amountToPay);

    amountToPay = 0;
  }
}
```
