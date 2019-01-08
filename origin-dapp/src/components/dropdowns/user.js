import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import $ from 'jquery'

import Identicon from 'components/identicon'
import WalletCard from 'components/wallet-card'
import origin from '../../services/origin'

class UserDropdown extends Component {
  componentDidMount() {
    // control hiding of dropdown menu
    $('.identity.dropdown').on('hide.bs.dropdown', function({ clickEvent }) {
      // if triggered by data-toggle
      if (!clickEvent) {
        return true
      }
      // otherwise only if triggered by self or another dropdown
      const el = $(clickEvent.target)

      return el.hasClass('dropdown') && el.hasClass('nav-item')
    })
  }

  handleClick() {
    $('#identityDropdown').dropdown('toggle')
  }

  render() {
    const { wallet } = this.props

    return (
      <div className="nav-item identity dropdown">
        <a
          className="nav-link active dropdown-toggle"
          id="identityDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          ga-category="top_nav"
          ga-label="user_profile_dropdown"
        >
          <Identicon address={wallet.address} />
        </a>
        <div
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby="identityDropdown"
        >
          <div className="triangle-container d-flex justify-content-end">
            <div className="triangle" />
          </div>
          <div className="actual-menu">
            <WalletCard wallet={wallet} withMenus={false} withProfile={true} />
            {
              origin.contractService.walletLinker &&
              origin.contractService.walletLinker.linked &&
                <Link to="#"
                  className="btn edit-profile placehold"
                  onClick={()=>{origin.contractService.walletLinker.unlink(); return false}}>
                  <FormattedMessage
                    id={'user-dropdown.UnlinkMobile'}
                    defaultMessage ={'Unlink Mobile'}
                  />
                </Link>
            }
            <Link to="/profile" className="btn edit-profile placehold" onClick={this.handleClick}>
              <FormattedMessage
                id={'user-dropdown.EditProfile'}
                defaultMessage={'Edit Profile'}
              />
            </Link>
            <Link to="/" className="btn edit-profile placehold" onClick={this.handleClick}>
              <FormattedMessage
                id={'user-dropdown.CloseSession'}
                defaultMessage={'Cerrar Sesión'}
              />
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    wallet: state.wallet
  }
}

export default connect(mapStateToProps)(UserDropdown)
