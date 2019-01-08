import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'
import { connect } from 'react-redux'

import { storeWeb3Intent } from 'actions/App'
import {
  deployProfile,
  deployProfileReset,
  updateProfile,
  addAttestation
} from 'actions/Profile'


class LoginUsuario extends Component {
  constructor(props) {
    super(props)
    this.nameRef = React.createRef()

    this.state = {
      usernameForm: '',
      passwordForm: '',
      toHome: false
    }

    this.intlMessages = defineMessages({

      usernamePlaceholder: {
        id: 'LoginUsuario.userNamePlaceholder',
        defaultMessage: 'Usuario'
      },
      passwordPlaceholder: {
        id: 'LoginUsuario.passwordPlaceholder',
        defaultMessage: 'Contraseña'
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      setTimeout(() => {
        this.nameRef.current.focus()
      }, 500)
    }
  }

  comprobarDatos() {
    var comprobar = false;

    const { username, password } = this.props.provisional

    var user = (username === this.state.usernameForm) ? true : false;
    var pass = (password === this.state.passwordForm) ? true: false;

    if (user && pass) {
      comprobar = true;
      this.setState({ toHome: true })
    }

    return comprobar;
  }

  render() {
    const { intl } = this.props

    if (this.state.toHome) {
      return <Redirect to="/home" />
    }

    return (
      <div className="current-user profile-wrapper">
        <div className="container" style={{marginTop: "50px"}}>
          <div className="row">
            <div className="col-12 col-lg-12">
              <h2 style={{textAlign: "center"}}>
                <FormattedMessage
                  id={'LoginUsuario.editProfileHeadingRegister'}
                  defaultMessage={'Accede a CleanersDApp'}
                />
              </h2>
              <form
                onSubmit={async e => {
                  e.preventDefault()
                  if (!this.comprobarDatos()) {
                    alert("El usuario no existe");
                  }
                }}
              >
                <div className="container">
                  <div className="row">
                    <div className="col-12 col-sm-12">
                      <div className="form-group">
                        <label htmlFor="user-name">
                          <FormattedMessage
                            id={'LoginUsuario.userName'}
                            defaultMessage={'Usuario'}
                          />
                        </label>
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          value={this.state.usernameForm}
                          onChange={e =>
                            this.setState({ usernameForm: e.currentTarget.value })
                          }
                          placeholder={intl.formatMessage(
                            this.intlMessages.usernamePlaceholder
                          )}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">
                          <FormattedMessage
                            id={'LoginUser.passwordRegister'}
                            defaultMessage={'Contraseña'}
                          />
                        </label>
                        <input
                          type="password"
                          id="passwordRegister"
                          name="password"
                          className="form-control"
                          value={this.state.passwordForm}
                          onChange={e =>
                            this.setState({ passwordForm: e.currentTarget.value })
                          }
                          placeholder={intl.formatMessage(this.intlMessages.passwordPlaceholder)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <div className="col-12">
                          <div className="button-container d-flex justify-content-center">
                            <button type="submit" className="publish btn btn-sm btn-primary d-block" style={{marginTop: "10px"}}>
                              <FormattedMessage
                                id={'LoginUsuario.continueRegister'}
                                defaultMessage={'Acceder'}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              <h5 style={{textAlign: "center", fontSize: "15px"}}>
                <FormattedMessage
                  id={'LoginUsuario.register'}
                  defaultMessage={'¿No tienes cuenta en CleanersDApp? ¡Hazte una!'}
                />
                <a href="/#/signup" > Registrarse </a>
              </h5>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

LoginUsuario.getDerivedStateFromProps = (nextProps, prevState) => {
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
)(injectIntl(LoginUsuario))
