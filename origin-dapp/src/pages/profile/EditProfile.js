import React, { Component } from 'react'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'

import Modal from 'components/modal'
import Avatar from 'components/avatar'

class EditProfile extends Component {
  constructor(props) {
    super(props)
    this.nameRef = React.createRef()

    const { pic, firstName, lastName, description, roleName, username, password, postalCode, nif } = this.props.data
    this.state = {
      pic,
      firstName,
      lastName,
      description,
      roleName,
      username,
      password,
      postalCode,
      nif
    }

    this.intlMessages = defineMessages({
      descriptionPlaceholder: {
        id: 'EditProfile.descriptionPlaceholder',
        defaultMessage: 'Tell us a little something about yourself'
      },
      firstNamePlaceholder: {
        id: 'EditProfile.firstNamePlaceholder',
        defaultMessage: 'Your First Name'
      },
      lastNamePlaceholder: {
        id: 'EditProfile.lastNamePlaceholder',
        defaultMessage: 'Your Last Name'
      },
      roleNamePlaceholder: {
        id: 'EditProfile.roleNamePlaceholder',
        defaultMessage: 'Your role'
      },
      usernamePlaceholder: {
        id: 'EditProfile.usernamePlaceholder',
        defaultMessage: 'Usuario'
      },
      passwordPlaceholder: {
        id: 'EditProfile.passwordPlaceholder',
        defaultMessage: 'Contraseña'
      },
      postalCodePlaceholder: {
        id: 'EditProfile.postalCodePlaceholder',
        defaultMessage: 'Código Postal'
      },
      nifPlaceholder: {
        id: 'EditProfile.nifPlaceholder',
        defaultMessage: 'NIF/DNI'
      },
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
      a.onload = function(e) {
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
      <Modal
        isOpen={open}
        data-modal="profile"
        handleToggle={handleToggle}
        tabIndex="-1"
      >
        <h2>
          <FormattedMessage
            id={'EditProfile.editProfileHeading'}
            defaultMessage={'Edit Profile'}
          />
        </h2>
        <form
          onSubmit={async e => {
            e.preventDefault()
            const data = {
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              description: this.state.description,
              roleName: this.state.roleName,
              username: this.state.username,
              password: this.state.password,
              nif: this.state.nif,
              postalCode: this.state.postalCode
            }
            this.props.handleSubmit({ data })
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="image-container">
                  <div className="image-pair">
                    <Avatar
                      image={this.state.pic}
                      className="primary"
                      placeholderStyle="unnamed"
                    />
                    <label className="edit-profile">
                      <img
                        src="images/camera-icon-circle.svg"
                        alt="camera icon"
                      />
                      <input
                        id="edit-profile-image"
                        type="file"
                        ref={r => (this.editPic = r)}
                        style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
                        onChange={e => {
                          this.props.handleCropImage(e.currentTarget.files[0])
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label htmlFor="first-name">
                    <FormattedMessage
                      id={'EditProfile.firstName'}
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
                      id={'EditProfile.lastName'}
                      defaultMessage={'Apellidos'}
                    />
                  </label>
                  <input
                    type="text"
                    id="last-name"
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
              </div>
              <div className="col-12">
              <div className="form-group">
                <label htmlFor="username">
                  <FormattedMessage
                    id={'EditProfile.username'}
                    defaultMessage={'Username'}
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
              </div>
              <div className="col-12">
              <div className="form-group">
                <label htmlFor="password">
                  <FormattedMessage
                    id={'EditProfile.password'}
                    defaultMessage={'Password'}
                  />
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={this.state.password}
                  onChange={e =>
                    this.setState({ password: e.currentTarget.value })
                  }
                  placeholder={intl.formatMessage(
                    this.intlMessages.passwordPlaceholder
                  )}
                  pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$"
                  required
                />
              </div>
              </div>
              <div className="col-12">
              <div className="form-group">
                <label htmlFor="nif">
                  <FormattedMessage
                    id={'EditProfile.nif'}
                    defaultMessage={'NIF'}
                  />
                </label>
                <input
                  type="text"
                  name="nif"
                  className="form-control"
                  value={this.state.nif}
                  onChange={e =>
                    this.setState({ nif: e.currentTarget.value })
                  }
                  placeholder={intl.formatMessage(
                    this.intlMessages.nifPlaceholder
                  )}
                  pattern="(([X-Z]{1})([-]?)(\d{7})([-]?)([A-Z]{1}))|((\d{8})([-]?)([A-Z]{1}))"
                  required
                />
              </div>
              </div>
              <div className="col-12">
              <div className="form-group">
                <label htmlFor="postalCode">
                  <FormattedMessage
                    id={'EditProfile.postalCode'}
                    defaultMessage={'Postal Code'}
                  />
                </label>
                <input
                  type="text"
                  name="postalCode"
                  className="form-control"
                  value={this.state.postalCode}
                  onChange={e =>
                    this.setState({ postalCode: e.currentTarget.value })
                  }
                  placeholder={intl.formatMessage(
                    this.intlMessages.postalCodePlaceholder
                  )}
                  pattern="((0[1-9]|5[0-2])|[1-4][0-9])[0-9]{3}"
                  required
                />
              </div>
              </div>
              
              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="description">
                    <FormattedMessage
                      id={'EditProfile.description'}
                      defaultMessage={'Description'}
                    />
                  </label>
                  <textarea
                    rows="4"
                    id="description"
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
              </div>
              <div className="col-12">
                <div className="explanation text-center">
                  <FormattedMessage
                    id={'EditProfile.publicDataNotice'}
                    defaultMessage={
                      'This information will be published on the blockchain and will be visible to everyone.'
                    }
                  />
                </div>
                <div className="button-container d-flex justify-content-center">
                  <button type="submit" className="btn btn-clear">
                    <FormattedMessage
                      id={'EditProfile.continue'}
                      defaultMessage={'Continue'}
                    />
                  </button>
                </div>
                <div className="link-container text-center">
                  <a href="#" data-modal="profile" onClick={handleToggle}>
                    <FormattedMessage
                      id={'EditProfile.cancel'}
                      defaultMessage={'Cancel'}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    )
  }
}

export default injectIntl(EditProfile)
