import React, { Component } from 'react'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'

import Modal from 'components/modal'
import Avatar from 'components/avatar'

class EditProfileRegister extends Component {
  constructor(props) {
    super(props)
    this.nameRef = React.createRef()

    this.state = {
      pic: '',
      firstName: '',
      lastName: '',
      description: '',
      roleName: 'Owner',
      username: '',
      password: '', 
      repeatPassword: '', 
      nif: '', 
      postalCode: ''
    }

    this.intlMessages = defineMessages({
      descriptionPlaceholder: {
        id: 'EditProfile.descriptionPlaceholderRegister',
        defaultMessage: '¡Cuéntanos quien eres!'
      },
      firstNamePlaceholder: {
        id: 'EditProfile.firstNamePlaceholderRegister',
        defaultMessage: 'Nombre'
      },
      lastNamePlaceholder: {
        id: 'EditProfile.lastNamePlaceholderRegister',
        defaultMessage: 'Apellidos'
      },
      usernamePlaceholder: {
        id: 'EditProfile.userNamePlaceholderRegister',
        defaultMessage: 'Nombre de Usuario'
      },
      passwordPlaceholder: {
        id: 'EditProfile.passwordPlaceholderRegister',
        defaultMessage: 'Contraseña'
      },
      repeatPasswordPlaceholder: {
        id: 'EditProfile.repeatPasswordPlaceholderRegister',
        defaultMessage: 'Repetir Contraseña'
      },
      nifPlaceholder: {
        id: 'EditProfile.nifPlaceholderRegister',
        defaultMessage: 'Nº Documento Identificación'
      },
      postalCodePlaceholder: {
        id: 'EditProfile.postalCodePlaceholderRegister',
        defaultMessage: 'Código Postal'
      },
      roleNamePlaceholder: {
        id: 'EditProfile.roleNamePlaceholderRegister',
        defaultMessage: '¿Eres propietario o limpiador?'
      }
    })
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props
    const { pic } = data
    if (pic && pic !== prevProps.data.pic) {
      this.setState({
        pic
      })
    }

    if (!prevProps.open && this.props.open) {
      setTimeout(() => {
        this.nameRef.current.focus()
      }, 500)
    }
  }

  blobToDataURL(blob) {
    return new Promise(resolve => {
      const a = new FileReader()
      a.onload = function (e) {
        resolve(e.target.result)
      }
      a.readAsDataURL(blob)
    })
  }

  comprobarDatos() {
    var comprobar = false;

    if(this.state.firstName !== '' && this.state.lastName !== '' && 
       this.state.description !== '' && this.state.username !== '' && 
       this.state.password !== '' && this.state.nif !== '' && 
       this.state.postalCode !== '') {
        comprobar = true;
    }
    return comprobar;
  }

  render() {
    const { intl, open, handleToggle } = this.props

    return (
      <div>
        <h2 style={{textAlign: "center"}}>
          <FormattedMessage
            id={'EditProfile.editProfileHeadingRegister'}
            defaultMessage={'Darte de alta en CleanersDApp'}
          />
        </h2>
        <form
          onSubmit={async e => {
            e.preventDefault()
            if(this.comprobarDatos() && (this.state.password === this.state.repeatPassword)) {
              const data = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                description: this.state.description,
                username: this.state.username,
                password: this.state.password,
                nif: this.state.nif,
                postalCode: this.state.postalCode,
                roleName: this.state.roleName
              }
              this.props.handleSubmit({ data })
            }
            else alert("Las contraseñas deben de ser idénticas");
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-12 col-sm-12">
                <div className="form-group">
                  <label htmlFor="first-name">
                    <FormattedMessage
                      id={'EditProfile.firstNameRegister'}
                      defaultMessage={'Nombre'}
                    />
                  </label>
                  <input
                    type="text"
                    ref={this.nameRef}
                    name="firstName"
                    className="form-control"
                    value={this.state.firstName}
                    onChange={e =>
                      this.setState({ firstName: e.currentTarget.value })
                    }
                    placeholder={intl.formatMessage(
                      this.intlMessages.firstNamePlaceholder
                    )}
                    pattern="[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last-name">
                    <FormattedMessage
                      id={'EditProfile.lastNameRegister'}
                      defaultMessage={'Apellidos'}
                    />
                  </label>
                  <input
                    type="text"
                    id="last-nameRegister"
                    name="lastName"
                    className="form-control"
                    value={this.state.lastName}
                    onChange={e =>
                      this.setState({ lastName: e.currentTarget.value })
                    }
                    placeholder={intl.formatMessage(
                      this.intlMessages.lastNamePlaceholder
                    )}
                    pattern="[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,64}"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="user-name">
                    <FormattedMessage
                      id={'EditProfile.userNameRegister'}
                      defaultMessage={'Nombre de Usuario'}
                    />
                  </label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={this.state.username}
                    onChange={e =>
                      this.setState({ username: e.currentTarget.value })
                    }
                    placeholder={intl.formatMessage(
                      this.intlMessages.usernamePlaceholder
                    )}
                    pattern="^[a-zA-Z][a-zA-Z0-9-_\.]{3,20}$"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">
                    <FormattedMessage
                      id={'EditProfile.passwordRegister'}
                      defaultMessage={'Contraseña'}
                    />
                  </label>
                  <input
                    type="password"
                    id="passwordRegister"
                    name="password"
                    className="form-control"
                    value={this.state.password}
                    onChange={e =>
                      this.setState({ password: e.currentTarget.value })
                    }
                    placeholder={intl.formatMessage(this.intlMessages.passwordPlaceholder)}
                    pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="repeatPassword">
                    <FormattedMessage
                      id={'EditProfile.repeatPasswordRegister'}
                      defaultMessage={'Repetir Contraseña'}
                    />
                  </label>
                  <input
                    type="password"
                    id="repeatPasswordRegister"
                    name="repeatPassword"
                    className="form-control"
                    value={this.state.repeatPassword}
                    onChange={e =>
                      this.setState({ repeatPassword: e.currentTarget.value })
                    }
                    placeholder={intl.formatMessage(this.intlMessages.repeatPasswordPlaceholder)}
                    pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nif">
                    <FormattedMessage
                      id={'EditProfile.nifRegister'}
                      defaultMessage={'NIF'}
                    />
                  </label>
                  <input
                    type="text"
                    id="nifRegister"
                    name="NIF"
                    className="form-control"
                    value={this.state.nif}
                    onChange={e =>
                      this.setState({ nif: e.currentTarget.value })
                    }
                    placeholder={intl.formatMessage(this.intlMessages.nifPlaceholder)}
                    size="9"  
                    maxlength="9"
                    pattern="(([X-Z]{1})([-]?)(\d{7})([-]?)([A-Z]{1}))|((\d{8})([-]?)([A-Z]{1}))"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">
                    <FormattedMessage
                      id={'EditProfile.postalCodeRegister'}
                      defaultMessage={'Código Postal'}
                    />
                  </label>
                  <input
                    type="text"
                    id="postalCodeRegister"
                    name="postalCode"
                    className="form-control"
                    value={this.state.postalCode}
                    onChange={e =>
                      this.setState({ postalCode: e.currentTarget.value })
                    }
                    placeholder={intl.formatMessage(this.intlMessages.postalCodePlaceholder)}
                    pattern="((0[1-9]|5[0-2])|[1-4][0-9])[0-9]{3}"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="roleName">
                    <FormattedMessage
                      id={'EditProfile.roleNameRegister'}
                      defaultMessage={'Tipo de Usuario'}
                    />
                  </label>
                  <select 
                    className="form-control"
                    value={this.state.roleName} 
                    onChange={e => this.setState({ roleName: e.currentTarget.value })}
                  >
                    <option selected value="Owner">Propietario</option>
                    <option value="Cleaner">Limpiador</option>
                  </select>
                </div>
                <div className="form-group">
                    <label htmlFor="description">
                      <FormattedMessage
                        id={'EditProfile.descriptionRegister'}
                        defaultMessage={'Descripción'}
                      />
                    </label>
                    <textarea
                      rows="1"
                      minLength="5"
                      id="descriptionRegister"
                      name="description"
                      className="form-control"
                      value={this.state.description}
                      onChange={e =>
                        this.setState({ description: e.currentTarget.value })
                      }
                      placeholder={intl.formatMessage(
                        this.intlMessages.descriptionPlaceholder
                      )}
                      required
                    />
                  </div>

                <div className="form-group">
                  <div className="col-12">
                    
                    <div className="button-container d-flex justify-content-center">
                      <button type="submit" className="btn">
                        <FormattedMessage
                          id={'EditProfile.continueRegister'}
                          defaultMessage={'Guardar Datos'}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default injectIntl(EditProfileRegister)
