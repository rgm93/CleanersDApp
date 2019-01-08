import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import { fetchUser } from 'actions/User'

import Avatar from 'components/avatar'
import Reviews from 'components/reviews'
import UnnamedUser from 'components/unnamed-user'
import Services from 'pages/profile/_ServicesProfileVerified'
import WalletCard from 'components/wallet-card'

import { formattedAddress } from 'utils/user'

class User extends Component {
  async componentDidMount() {
    fetchUser(this.props.userAddress)
  }

  render() {
    const { user, userAddress } = this.props
    const { attestations, fullName, profile } = user
    const username = (profile && profile.username)
    const description = (profile && profile.description) || 'Usuario de CheKin sin descripción'
    //const roleName = this.props.provisional.roleName;
    const postalCode = (profile && profile.postalCode)

    return (
      <div className="public-user profile-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-4 col-lg-4 order-md-3">
            </div>
            <div className="col-12 col-sm-4 col-md-3 col-lg-2 order-md-1">
              <Avatar
                image={profile && profile.avatar}
                className="primary"
                placeholderStyle="purple"
              />
            </div>
            <div className="col-12 col-sm-8 col-md-5 col-lg-6 order-md-2">
              <div className="name d-flex">
                <h1>{fullName || <UnnamedUser />}</h1>
              </div>

              <div className="row" style={{ marginTop: "5px" }}>
                <div className="col-6">
                  {profile && profile.roleName &&
                    <p className="ws-aware">
                      {"Usuario: " + profile.username}
                    </p>
                  }
                </div>
                <div className="col-6">
                  {profile && profile.roleName &&
                    <p className="ws-aware">
                      {"Rol: " + (profile.roleName === "Owner" ? "Propietario" : (profile.roleName === "Cleaner" ? "Limpiador" : ""))}
                    </p>
                  }
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <p className="ws-aware">{"Código Postal: " + postalCode}</p>
                </div>
              </div>
              <p className="ws-aware">{"Descripción: " + description}</p>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-12">
            <Services />
            </div>
            <br /> <br />
            <div className="col-12 col-sm-4 col-md-3 col-lg-2 order-md-4">
              {attestations &&
                !!attestations.length && (
                  <div className="verifications-box">
                    <h3>
                      <FormattedMessage
                        id={'User.verifiedInto'}
                        defaultMessage={'Verified Info'}
                      />
                    </h3>
                    {/* need to know how to verify signature instead of just finding object by key */}
                    {attestations.find(a => a.service === 'phone') && (
                      <div className="service d-flex">
                        <img
                          src="images/phone-icon-verified.svg"
                          alt="phone verified icon"
                        />
                        <div>
                          <FormattedMessage
                            id={'User.phone'}
                            defaultMessage={'Phone'}
                          />
                        </div>
                      </div>
                    )}
                    {attestations.find(a => a.service === 'email') && (
                      <div className="service d-flex">
                        <img
                          src="images/email-icon-verified.svg"
                          alt="email verified icon"
                        />
                        <div>
                          <FormattedMessage
                            id={'User.email'}
                            defaultMessage={'Email'}
                          />
                        </div>
                      </div>
                    )}
                    {attestations.find(a => a.service === 'facebook') && (
                      <div className="service d-flex">
                        <img
                          src="images/facebook-icon-verified.svg"
                          alt="Facebook verified icon"
                        />
                        <div>
                          <FormattedMessage
                            id={'User.facebook'}
                            defaultMessage={'Facebook'}
                          />
                        </div>
                      </div>
                    )}
                    {attestations.find(a => a.service === 'twitter') && (
                      <div className="service d-flex">
                        <img
                          src="images/twitter-icon-verified.svg"
                          alt="Twitter verified icon"
                        />
                        <div>
                          <FormattedMessage
                            id={'User.twitter'}
                            defaultMessage={'Twitter'}
                          />
                        </div>
                      </div>
                    )}
                    {attestations.find(a => a.service === 'airbnb') && (
                      <div className="service d-flex">
                        <img
                          src="images/airbnb-icon-verified.svg"
                          alt="Airbnb verified icon"
                        />
                        <div>
                          <FormattedMessage
                            id={'User.airbnb'}
                            defaultMessage={'Airbnb'}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-12 col-sm-8 col-md-9 col-lg-10 order-md-5">
              <Reviews userAddress={userAddress} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, { userAddress }) => {
  return {
    provisional: state.profile.provisional,
    profile: state.profile,
    user: state.users.find(u => {
      return formattedAddress(u.address) === formattedAddress(userAddress)
    }) || {}

  }
}

const mapDispatchToProps = dispatch => ({
  fetchUser: addr => dispatch(fetchUser(addr))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User)
