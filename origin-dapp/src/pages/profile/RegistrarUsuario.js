import React, { Component } from 'react'
import { Route, Redirect } from 'react-router'
import { Prompt } from 'react-router-dom'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import moment from 'moment'
import $ from 'jquery'

import { storeWeb3Intent } from 'actions/App'
import {
  deployProfile,
  deployProfileReset,
  updateProfile,
  addAttestation
} from 'actions/Profile'

import Avatar from 'components/avatar'
import Modal from 'components/modal'
import UnnamedUser from 'components/unnamed-user'
import WalletCard from 'components/wallet-card'
import ImageCropper from 'components/modals/image-cropper'
import { ProviderModal, ProcessingModal } from 'components/modals/wait-modals'

import Guidance from './_Guidance'
import Services from './_ServicesRegister'
import Strength from './_Strength'

import EditProfileRegister from './EditProfileRegister'
import VerifyPhone from './VerifyPhone'
import VerifyEmail from './VerifyEmail'
import ConfirmPublish from './ConfirmPublish'
import ConfirmUnload from './ConfirmUnload'
import AttestationSuccess from './AttestationSuccess'

class RegistrarUsuario extends Component {
  constructor(props) {
    super(props)

    this.handleToggle = this.handleToggle.bind(this)
    this.handleUnload = this.handleUnload.bind(this)
    this.setProgress = this.setProgress.bind(this)
    this.setLastPublishTime = this.setLastPublishTime.bind(this)
    this.startLastPublishTimeInterval = this.startLastPublishTimeInterval.bind(
      this
    )
    this.profileDeploymentComplete = this.profileDeploymentComplete.bind(this)

    const { firstName, lastName, description, roleName, username, password, nif, postalCode } = this.props.provisional

    this.state = {
      lastPublish: null,
      userForm: { firstName, lastName, description, roleName, username, password, nif, postalCode },
      lastPublishTime: null,
      modalsOpen: {
        attestationSuccess: false,
        email: false,
        phone: false,
        profile: false,
        publish: false,
        unload: false,
        imageCropper: false
      },
      // percentage widths for two progress bars
      progress: {
        provisional: 0,
        published: 0
      },
      provisional: props.provisional,
      successMessage: '',
      wallet: null,
      imageToCrop: null,
      numAttestations: 0,
      formComplete: false,
      toHome: false
    }

    this.intlMessages = defineMessages({
      manageYourProfile: {
        id: 'Profile.manageYourProfileRegistro',
        defaultMessage: 'manage your profile'
      },
      profileUpdated: {
        id: 'Profile.profileUpdatedRegistro',
        defaultMessage: '¡Campos guardados!'
      },
      unsavedChangesWarn: {
        id: 'Profile.unsavedChangesWarnRegistro',
        defaultMessage:
          "If you exit without publishing, you'll lose all your changes."
      },
      noDescriptionUser: {
        id: 'Profile.noDescriptionUserRegistro',
        defaultMessage: 'An Origin user without a description'
      },
      phoneVerified: {
        id: 'Profile.phoneVerifiedRegistro',
        defaultMessage: 'Phone number verified!'
      },
      emailVerified: {
        id: 'Profile.emailVerifiedRegistro',
        defaultMessage: 'Email address verified!'
      },
      facebookVerified: {
        id: 'Profile.facebookVerifiedRegistro',
        defaultMessage: 'Facebook account verified!'
      },
      twitterVerified: {
        id: 'Profile.twitterVerifiedRegistro',
        defaultMessage: 'Twitter account verified!'
      },
      airbnbVerified: {
        id: 'Profile.airbnbVerifiedRegistro',
        defaultMessage: 'Airbnb account verified!'
      }
    })
  }

  componentDidMount() {
    this.setProgress({
      provisional: this.props.provisionalProgress,
      published: this.props.publishedProgress
    })

    if ($('.identity.dropdown').hasClass('show')) {
      $('#identityDropdown').dropdown('toggle')
    }
  }

  componentDidUpdate(prevProps) {
    // prompt user if tab/window is closing before changes have been published
    if (this.props.changes.length) {
      $('.profile-wrapper [data-toggle="tooltip"]').tooltip()

      window.addEventListener('beforeunload', this.handleUnload)
    } else {
      window.removeEventListener('beforeunload', this.handleUnload)
    }

    if (
      prevProps.provisionalProgress !== this.props.provisionalProgress ||
      prevProps.publishedProgress !== this.props.publishedProgress
    ) {
      this.setProgress({
        provisional: this.props.provisionalProgress,
        published: this.props.publishedProgress
      })
    }
  }

  // conditionally close modal identified by data attribute
  handleToggle(e) {
    e.preventDefault()

    this.props.storeWeb3Intent(
      this.props.intl.formatMessage(this.intlMessages.manageYourProfile)
    )

    if ((web3.givenProvider && this.props.wallet.address) || origin.contractService.walletLinker) {
      const { modal } = e.currentTarget.dataset

      /*
        We currently ignore the click if the identity has been verified.
        TODO: Allow provisional validations to be reviewed and/or
        undone individually before publishing to the blockchain.
      */
      if (this.props.published[modal] || this.props.provisional[modal]) {
        return
      }

      const modalsOpen = Object.assign({}, this.state.modalsOpen)

      for (const k in modalsOpen) {
        if (modalsOpen.hasOwnProperty(k)) {
          modalsOpen[k] = k === modal ? !modalsOpen[k] : false
        }
      }

      this.setState({ modalsOpen })
    }
  }

  // warning message will be ignored by the native dialog in Chrome and Firefox
  handleUnload(e) {
    const message = this.props.intl.formatMessage(
      this.intlMessages.unsavedChangesWarn
    )
    const modalsOpen = Object.assign({}, this.state.modalsOpen, {
      unload: true
    })

    // modal will only render if user cancels unload using native dialog
    this.setState({ modalsOpen })

    e.returnValue = message

    return message
  }

  // cause profile strength counter to increment (gradually) and progress bar to widen
  setProgress(progress) {
    const strength = progress.provisional + progress.published
    let i = this.props.strength

    // lots of state changes here, there may be a better way to increment counter
    this.int = setInterval(() => {
      i += 1

      if (i > strength) {
        return clearInterval(this.int)
      }

      this.setState({ strength: i })
    }, 1000 / (strength - i))

    this.setState({ progress })
  }

  setLastPublishTime() {
    this.setState({
      lastPublishTime: moment(this.props.lastPublish).fromNow()
    })
  }

  startLastPublishTimeInterval() {
    this.createdAtInterval = setInterval(() => {
      this.setLastPublishTime()
    }, 60000)
  }

  profileDeploymentComplete() {
    this.props.deployProfileReset()
    this.setLastPublishTime()
    this.startLastPublishTimeInterval()
    this.setState({
      toHome: true
    })
  }

  componentWillUnmount() {
    $('.profile-wrapper [data-toggle="tooltip"]').tooltip('dispose')

    window.removeEventListener('beforeunload', this.handleUnload)

    clearInterval(this.createdAtInterval)
  }

  render() {
    const { modalsOpen, progress, successMessage, imageToCrop, numAttestations } = this.state

    const {
      changes,
      lastPublish,
      profile,
      provisional,
      published,
      wallet,
      intl,
      mobileDevice
    } = this.props
    const hasChanges = !!changes.length

    const statusClassMap = {
      unpublished: 'not-published'
    }
    const statusTextMap = {
      unpublished: 'Not Published'
    }

    let publishStatus,
      hasPublishedAllChanges = false
    if (hasChanges) {
      publishStatus = 'unpublished'
    } else if (lastPublish) {
      publishStatus = 'published'
      hasPublishedAllChanges = true
    }
    const statusClass = statusClassMap[publishStatus]
    const statusText = statusTextMap[publishStatus]

    if(this.state.toHome) {
      return <Redirect to="/publicar-vivienda" />
    }

    return (
      <div className="current-user profile-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-12">
              <EditProfileRegister
                handleToggle={this.handleToggle}
                handleSubmit={data => {
                  this.props.updateProfile(data)
                  this.setState({
                    successMessage: this.props.intl.formatMessage(
                      this.intlMessages.profileUpdated
                    ),
                    modalsOpen: {
                      ...modalsOpen,
                      profile: false,
                      attestationSuccess: true
                    },
                    formComplete: true
                  })
                }}
                handleCropImage={(imageToCrop) => {
                  this.setState({
                    imageToCrop,
                    modalsOpen: {
                      ...modalsOpen,
                      profile: false,
                      cropModal: true
                    }
                  })
                }}
                data={this.state.userForm}
              />

              <ImageCropper
                isOpen={modalsOpen.cropModal}
                imageFileObj={imageToCrop}
                aspect={1} // force square aspect ratio
                onCropComplete={(croppedImageUri) => {
                  this.props.updateProfile({
                    data: {
                      pic: croppedImageUri
                    }
                  })
                  this.setState({
                    imageToCrop: null,
                    modalsOpen: {
                      ...modalsOpen,
                      profile: true,
                      cropModal: false
                    }
                  })
                  document.getElementById('edit-profile-image').value = null
                }}
                onCropCancel={() => {
                  this.setState({
                    modalsOpen: {
                      ...modalsOpen,
                      profile: true,
                      cropModal: false
                    }
                  })
                }}
              />
              
              <h2>
                <FormattedMessage
                  id={'Profile.verifyYourselfHeadingRegistro'}
                  defaultMessage={'Verifícate en CheKin'}
                />
              </h2>
              <Services
                published={published}
                provisional={provisional}
                handleToggle={this.handleToggle}
              />

              <div className="col-12">
                {(!this.state.formComplete || this.state.formComplete) && (numAttestations < 2) && (
                  <button
                    className="publish btn btn-sm btn-primary d-block"
                    disabled
                  >
                    <FormattedMessage
                      id={'Profile.publishNowRegistro'}
                      defaultMessage={'Darse de alta'}
                    />
                  </button>
                )}
                { console.log("DATA:" + JSON.stringify(this.state.formComplete)) }
                { console.log("NUM:" + JSON.stringify(numAttestations)) }
                {this.state.formComplete && (numAttestations === 2) && (
                  <button
                    className="publish btn btn-sm btn-primary d-block"
                    onClick={() => {
                      this.setState({
                        modalsOpen: { ...modalsOpen, publish: true, phone: true, email: true }
                      })
                    }}
                  >
                    <FormattedMessage
                      id={'Profile.publishNowRegistro'}
                      defaultMessage={'Darse de alta'}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>



        <VerifyPhone
          open={modalsOpen.phone}
          handleToggle={this.handleToggle}
          onSuccess={data => {
            this.props.addAttestation(data)
            this.setState({
              successMessage: this.props.intl.formatMessage(
                this.intlMessages.phoneVerified
              ),
              modalsOpen: {
                ...modalsOpen,
                phone: false,
                attestationSuccess: true
              },
              numAttestations: numAttestations + 1
            })
          }}
        />

        <VerifyEmail
          open={modalsOpen.email}
          wallet={wallet.address}
          handleToggle={this.handleToggle}
          onSuccess={data => {
            this.props.addAttestation(data)
            this.setState({
              successMessage: this.props.intl.formatMessage(
                this.intlMessages.emailVerified
              ),
              modalsOpen: {
                ...modalsOpen,
                email: false,
                attestationSuccess: true
              },
              numAttestations: numAttestations + 1
            })
          }}
        />

        <ConfirmPublish
          open={modalsOpen.publish}
          changes={changes}
          handleToggle={this.handleToggle}
          onConfirm={() => {
            this.setState({
              modalsOpen: { ...modalsOpen, phone: false, email: false, publish: false },
              step: 'metamask'
            })
            this.props.deployProfile({
              user: this.state.userForm
            })
          }}
          mobileDevice={mobileDevice}
        />

        <ConfirmUnload
          open={modalsOpen.unload}
          changes={changes}
          handleToggle={this.handleToggle}
          onConfirm={() => {
            this.setState({
              modalsOpen: { ...modalsOpen, phone: false, email: false, unload: false },
              step: 'metamask'
            })
            this.props.deployProfile({
              user: this.state.userForm
            })
          }}
        />

        <AttestationSuccess
          open={modalsOpen.attestationSuccess}
          message={successMessage}
          handleToggle={this.handleToggle}
        />

        {this.props.profile.status === 'confirming' && <ProviderModal />}

        {this.props.profile.status === 'processing' && <ProcessingModal />}

        {this.props.profile.status === 'error' && (
          <Modal backdrop="static" isOpen={true}>
            <div className="image-container">
              <img src="images/flat_cross_icon.svg" role="presentation" />
            </div>
            <h2>
              <FormattedMessage id={'Profile.errorRegistro'} defaultMessage={'Error'} />
            </h2>
            <div>
              <FormattedMessage
                id={'Profile.seeConsoleRegistro'}
                defaultMessage={'See the console for more details'}
              />
            </div>
            <div className="button-container">
              <button
                className="btn btn-clear"
                onClick={this.profileDeploymentComplete}
              >
                <FormattedMessage id={'Profile.okRegistro'} defaultMessage={'OK'} />
              </button>
            </div>
          </Modal>
        )}

        {this.props.profile.status === 'inProgress' && ( 
          <Modal backdrop="static" isOpen={true}>
            <div className="image-container">
              <img src="images/circular-check-button.svg" role="presentation" />
            </div>
            <h2>
              <FormattedMessage
                id={'Profile.inProgressRegistro'}
                defaultMessage={'In Progress'}
              />
            </h2>
            <div>
              <FormattedMessage
                id={'Profile.transactionBeingProcessedRegistro'}
                defaultMessage={`Profile changes can be seen once the transaction is processed.`}
              />
            </div>
            <div className="explanation">
              <FormattedMessage
                id={'Profile.transactionProgressDropdownRegistro'}
                defaultMessage={`See transaction progress from the dropdown in navigation bar.`}
              />
            </div>
            {/*
              // in case we want to show transaction in etherscan at any time
              <div>
              <a
                href={`https://${etherscanNetworkUrls[this.props.networkId]}etherscan.io/tx/${this.props.profile.lastDeployProfileHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage
                  id={'Profile.viewTransaction'}
                  defaultMessage={'View Transaction'}
                />
              </a>
            </div>
            */}
            <div className="button-container">
              <button
                className="btn btn-clear"
                onClick={this.profileDeploymentComplete}
              >
                <FormattedMessage
                  id={'Profile.continueRegistro'}
                  defaultMessage={'Continuar'}
                />
              </button>
            </div>
          </Modal>
        )}
        <Prompt
          when={!!this.props.changes.length}
          message={intl.formatMessage(this.intlMessages.unsavedChangesWarn)}
        />
      </div>
    )
  }
}

RegistrarUsuario.getDerivedStateFromProps = (nextProps, prevState) => {
  let newState = {}
  if (
    (nextProps.wallet && !prevState.wallet) ||
    (nextProps.wallet.address && !prevState.wallet.address)
  ) {
    newState = {
      ...newState,
      provisional: nextProps.published,
      userForm: {
        firstName: nextProps.published.firstName,
        lastName: nextProps.published.lastName,
        description: nextProps.published.description,
        username: nextProps.published.username,
        password: nextProps.published.password,
        repeatPassword: nextProps.published.repeatPassword,
        nif: nextProps.published.nif,
        postalCode: nextProps.published.postalCode,
        roleName: nextProps.published.roleName
      },
      wallet: nextProps.wallet
    }
  }
  return newState
}

const mapStateToProps = state => {
  return {
    deployResponse: state.profile.deployResponse,
    issuer: state.profile.issuer,
    published: state.profile.published,
    provisional: state.profile.provisional,
    strength: state.profile.strength,
    changes: state.profile.changes,
    lastPublish: state.profile.lastPublish,
    provisionalProgress: state.profile.provisionalProgress,
    publishedProgress: state.profile.publishedProgress,
    profile: state.profile,
    identityAddress: state.profile.user.identityAddress,
    wallet: state.wallet,
    web3Intent: state.app.web3.intent,
    networkId: state.app.web3.networkId,
    mobileDevice: state.app.mobileDevice
  }
}

const mapDispatchToProps = dispatch => ({
  addAttestation: data => dispatch(addAttestation(data)),
  deployProfile: opts => dispatch(deployProfile(opts)),
  deployProfileReset: () => dispatch(deployProfileReset()),
  storeWeb3Intent: intent => dispatch(storeWeb3Intent(intent)),
  updateProfile: data => dispatch(updateProfile(data))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(RegistrarUsuario))
