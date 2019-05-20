const PayContract = artifacts.require('PayContract')

module.exports = (worker, _, accounts) => {
  worker.deploy(PayContract, accounts[1], accounts[2], { from: accounts[0] })
}
