import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import ConnectivityDropdown from 'components/dropdowns/connectivity'
import MessagesDropdown from 'components/dropdowns/messages'
import NotificationsDropdown from 'components/dropdowns/notifications'
import TransactionsDropdown from 'components/dropdowns/transactions'
import UserDropdown from 'components/dropdowns/user'

class NavBar extends Component {
  render() {
    const { showNav, mobileDevice } = this.props

    return showNav && (
      <nav className="navbar navigation-bar navbar-expand-lg" style={{backgroundColor: "#2462a7"}}>
        <div className="container">
          <button
            className="navbar-toggler mr-3"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <img src="images/origin-icon-white.svg" alt="CleanersDApp Menu" style={{width: "50px", height: "50px"}} />
          </button>
          <Link
            to="/home"
            className="navbar-brand mr-auto mr-lg-3"
            ga-category="top_nav"
            ga-label="logo"
          >
            <div className="d-none d-lg-block logo-container">
              <img
                src="images/origin-logo.svg"
                className="origin-logo"
                alt="CleanersDApp"
                style={{width: "150px", height: "150px"}}
              />
            </div>
          </Link>
          <div
            className="collapse navbar-collapse order-2 order-lg-1"
            id="navbarSupportedContent"
          >
            <div className="navbar-nav justify-content-center">
              <Link
                to="/my-listings"
                className="nav-item nav-link"
                ga-category="top_nav"
                ga-label="sell_dropdown_my_listings"
              >
                <FormattedMessage
                  id={'navbar.myListings'}
                  defaultMessage={'Mis Ofertas'}
                />
              </Link>
              <Link
                to="/my-sales"
                className="nav-item nav-link"
                ga-category="top_nav"
                ga-label="sell_dropdown_my_sales"
              >
                <FormattedMessage
                  id={'navbar.mySales'}
                  defaultMessage={'Mis Ofertas Consumidas'}
                />
              </Link>
              <Link
                to="/home"
                className="nav-item nav-link"
                ga-category="top_nav"
                ga-label="buying"
              >
                <FormattedMessage
                  id={'navbar.buying'}
                  defaultMessage={'Ofertas Disponibles'}
                />
              </Link>
              <Link
                to="/create"
                className="nav-item nav-link"
                ga-category="top_nav"
                ga-label="add_listing"
              >
                <img
                  src="images/add-listing-icon.svg"
                  alt="Add Listing"
                  className="add-listing"
                />
                <FormattedMessage
                  id={'navbar.addListing'}
                  defaultMessage={'Publicar Oferta'}
                />
              </Link>
            </div>
          </div>
          <div className="static navbar-nav order-1 order-lg-2 d-flex flex-row justify-content-end">
            <MessagesDropdown />
            <NotificationsDropdown />
            <UserDropdown />
          </div>
        </div>
      </nav>
    )
  }
}

const mapStateToProps = ({ app }) => {
  return {
    mobileDevice: app.mobileDevice,
    showNav: app.showNav
  }
}

export default connect(
  mapStateToProps
)(NavBar)
