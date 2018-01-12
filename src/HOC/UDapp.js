import React, { Component } from 'react'
import Ethjs from "ethjs"
import EthAbi from "ethjs-abi"

import { commonUtils } from '../sagas/utils'
import registryContract from '../contracts/Registry.json'
import votingContract from '../contracts/PLCRVoting.json'
import tokenContract from '../contracts/EIP20.json'
import paramContract from '../contracts/Parameterizer.json'
import { padLeftEven } from '../libs/values'

const contracts = {
  registry: registryContract,
  voting: votingContract,
  token: tokenContract,
  parameterizer: paramContract,
}

const UDapp = (WrappedComponent, selectVFilter) => {
  return class UDapp extends Component {
    constructor(props) {
      super(props)
      console.log('props', props)
      this.state = {
        registry: {
          abi: contracts.registry.abi,
          address: contracts.registry.networks['420'].address,
        },
        eventStream: [],
        fromAddress: false,
        voting: {
          abi: contracts.voting.abi,
          address: contracts.voting.networks['420'].address,
        },
        parameterizer: {
          abi: contracts.parameterizer.abi,
          address: contracts.parameterizer.networks['420'].address,
        },
        token: {
          abi: contracts.token.abi,
          address: contracts.token.networks['420'].address,
        },
        INITIAL_POLL_NONCE: '',
        approve: '',
        decodedValues: [],
        pollExists: ''
      }
    }

    componentDidMount() {
      setTimeout(this.initUDapp, 1000)
    }

    initUDapp = async () => {
      console.log('HOC props:', this.props)
      console.log('this.state', this.state)

      this.eth = new Ethjs(new Ethjs.HttpProvider('http://localhost:7545'))
      const fromAddress = (await this.eth.accounts())[0]

      this.setState({
        fromAddress,
      })
    }

    handleInputChange = (method, e, index, input) => {
      let value = e.target.value
      if (input.type === 'bytes32') {
        value = commonUtils.getListingHash(value)
      }
      console.log('method', method)
      console.log('value', value)
      console.log('input', input)
      const rawOutput = this.state[method.name]
      
      // const result = EthAbi.decodeMethod(method, `0x${value}`)
      // result.length = method.outputs.length
      // const resultArray = [].slice.call(result)
      
      this.setState(prevState => ({
        ...prevState,
        [method.name]: {
          ...prevState[method.name],
          [input.name]: value,
        },
        // decodedValues: resultArray
      }))

      console.log('this.state', this.state)
    }

    handleCall = (e, method, contract) => {
      e.preventDefault()
      const args = Object.values(this.state[method.name])
      const txData = EthAbi.encodeMethod(method, args)
      console.log('method', method)
      console.log('txData', txData)
      const payload = {
        method: 'eth_call',
        params: [{
          from: this.state.fromAddress,
          to: this.state[contract].address,
          data: txData,
        }]
      }
      console.log('exec:', method.name, args, payload)
      return this.eth.currentProvider.sendAsync(payload, console.log)
    }

    handleExecute = (e, method, contract) => {
      e.preventDefault()
      const args = Object.values(this.state[method.name])
      const txData = EthAbi.encodeMethod(method, args)
      console.log('method, args, txData', method, args, txData)
      const payload = {
        from: this.state.fromAddress,
        gas: '0x44aa20',
        gasPrice: '0x5d21dba00',
        to: this.state[contract].address,
        data: txData,
      }
      console.log('exec:', method.name, args, payload)
      return this.eth.sendTransaction(payload)
    }

    render() {
      return (
        <WrappedComponent
          hocInputChange={this.handleInputChange}
          hocCall={this.handleCall}
          hocSendTransaction={this.handleExecute}
          registry={this.state.registry}
          voting={this.state.voting}
          token={this.state.token}
          decodedValues={this.state.decodedValues}
          {...this.props}
        />
      )
    }
  }
}

export default UDapp