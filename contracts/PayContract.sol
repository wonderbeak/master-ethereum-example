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
