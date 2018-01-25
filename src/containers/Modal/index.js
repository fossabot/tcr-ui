import React, { Component } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import UDapp from '../UDapp'

import { colors } from '../../components/Colors'
import H2 from '../../components/H2'
import Button from '../../components/Button'

const Wrapper = styled.div`
  padding: 1em;
`
const ModalMessage = styled.div`
  padding: 0 2em 2em;
`

const modalStyles = {
  overlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(150, 150, 150, 0.7)',
    border: '1px solid black',
    boxShadow: '6px 6px 6px rgba(0, 0, 0, .2)',
    zIndex: '2',
  },
  content: {
    position: 'absolute',
    top: '10vh',
    left: '10vw',
    right: '10vw',
    border: `1px solid ${colors.prism}`,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    zIndex: '5',
    borderRadius: '6px',
  },
}

class Modal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: props.isOpen || false,
    }
  }

  handleOpenModal = () => {
    console.log('open modal event')
    this.setState({
      modalIsOpen: true,
    })
  }

  handleCloseModal = () => {
    console.log('close modal event')
    this.setState({
      modalIsOpen: false,
    })
  }

  handleAfterOpen = () => {
    console.log('open', this)
  }

  handleRequestClose = () => {
    console.log('close', this)
    this.setState({
      modalIsOpen: false,
    })
  }

  render() {
    return (
      <Wrapper>
        <ReactModal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.handleAfterOpen}
          onRequestClose={this.handleRequestClose}
          style={modalStyles}
          contentLabel="Notification Modal"
          portalClassName="NotificationModalPortal"
          overlayClassName="NotificationModal__Overlay"
          className="NotificationModal__Content"
          bodyOpenClassName="NotificationModal__Body--open"
          ariaHideApp={false}
          shouldFocusAfterRender={true}
          shouldCloseOnEsc={true}
          shouldReturnFocusAfterClose={true}
          role="dialog"
        >
          <H2>{this.props.messages.heading}</H2>
          <ModalMessage>{this.props.messages.default}</ModalMessage>

          <UDapp networkId={this.props.networkId} actions={this.props.actions} account={this.props.account} />

        </ReactModal>

        <Button onClick={this.handleOpenModal}>{'U D A P P'}</Button>
      </Wrapper>
    )
  }
}

export default Modal
