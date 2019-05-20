const PayContract = artifacts.require('PayContract')

const Web3 = require('web3')

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    'http://127.0.0.1:8545'
  )
)

const getRandomItem = array => (
  array[Math.floor(Math.random() * array.length)]
)

contract('PayContract', accounts => {
  const worker = accounts[0]
  const customer   = accounts[1]
  const expert   = accounts[2]

  const unknownAccount = getRandomItem(accounts.slice(3))

  describe('worker property', () => {
    it('is initialized after deployment', async () => {
      const deployedContract = await PayContract.deployed()
      expect(await deployedContract.worker()).to.equal(worker)
    })
  })

  describe('customer property', () => {
    it('is initialized after deployment', async () => {
      const deployedContract = await PayContract.deployed()
      expect(await deployedContract.customer()).to.equal(customer)
    })
  })

  describe('expert property', () => {
    it('is initialized after deployment', async () => {
      const deployedContract = await PayContract.deployed()
      expect(await deployedContract.expert()).to.equal(expert)
    })
  })

  describe('payAmount property', () => {
    it('equals 0 after deployment', async () => {
      const deployedContract = await PayContract.deployed()
      const payAmount = await deployedContract.amountToPay()
      expect(payAmount.toNumber()).to.equal(0)
    })
  })

  describe('payable fallback', () => {
    describe('message sender validation', () => {
      it('worker cannot change the amount to pay', done => {
        (async () => {
          const deployedContract = await PayContract.deployed()

          deployedContract.sendTransaction({
            from: worker, value: web3.utils.toWei('5', 'ether')
          }).then(() => done('e')).catch(() => done())
        })()
      })

      it('expert cannot change the amount to pay', done => {
        (async () => {
          const deployedContract = await PayContract.deployed()

          deployedContract.sendTransaction({
            from: expert, value: web3.utils.toWei('5', 'ether')
          }).then(() => done('e')).catch(() => done())
        })()
      })

      it('unknown account cannot change the amount to pay', done => {
        (async () => {
          const deployedContract = await PayContract.deployed()

          deployedContract.sendTransaction({
            from: unknownAccount, value: web3.utils.toWei('5', 'ether')
          }).then(() => done('e')).catch(() => done())
        })()
      })

      it('only customer can change the amount to pay', done => {
        (async () => {
          const deployedContract = await PayContract.deployed()

          deployedContract.sendTransaction({
            from: customer, value: web3.utils.toWei('5', 'ether')
          }).then(() => done()).catch(() => done('e'))
        })()
      })
    })

    it('change the amount to pay', async () => {
      const deployedContract = await PayContract.deployed()

      const payAmountWeiBefore = await deployedContract.amountToPay()
      const payAmountBefore = web3.utils.fromWei(payAmountWeiBefore, 'ether')

      await deployedContract.sendTransaction({
        from: customer, value: web3.utils.toWei('5', 'ether')
      })

      const payAmountWeiAfter = await deployedContract.amountToPay()
      const payAmountAfter = web3.utils.fromWei(payAmountWeiAfter, 'ether')

      expect(payAmountAfter - payAmountBefore).to.equal(5)
    })
  })

  describe('action payAmountToExpert', () => {
    describe('message sender validation', () => {
      it('can be changed only by worker', done => {
        (async () => {
          const deployedContract = await PayContract.deployed()

          deployedContract.payAmountToExpert({ from: worker })
            .then(() => done())
            .catch(() => done('e'))
        })()
      })

      it('cannot be changed by customer', done => {
        (async () => {
          const deployedContract = await PayContract.deployed()

          deployedContract.payAmountToExpert({ from: customer })
            .then(() => done('e'))
            .catch(() => done())
        })()
      })

      it('cannot be changed by expert', done => {
        (async () => {
          const deployedContract = await PayContract.deployed()

          deployedContract.payAmountToExpert({ from: expert })
            .then(() => done('e'))
            .catch(() => done())
        })()
      })

      it('cannot be changed by unknown account', done => {
        (async () => {
          const deployedContract = await PayContract.deployed()

          deployedContract.payAmountToExpert({ from: unknownAccount })
            .then(() => done('e'))
            .catch(() => done())
        })()
      })
    })

    it('nil the amount to pay', async () => {
      const deployedContract = await PayContract.new(
        customer, expert, { from: worker }
      )

      await deployedContract.sendTransaction({
        from: customer, value: web3.utils.toWei('5', 'ether')
      })

      const payAmountWeiBefore = await deployedContract.amountToPay()
      const payAmountBefore = web3.utils.fromWei(payAmountWeiBefore, 'ether')

      await deployedContract.payAmountToExpert({ from: worker })

      const payAmountWeiAfter = await deployedContract.amountToPay()
      const payAmountAfter = web3.utils.fromWei(payAmountWeiAfter, 'ether')

      expect(payAmountAfter - payAmountBefore).to.equal(-5)
      expect(payAmountAfter).to.equal('0')
    })
  })
})
