import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

class VerifierServices extends Component {
  render() {
    const { published, provisional, handleToggle } = this.props
    return (
      <div className="services-container">
        <p className="credit">
          <FormattedMessage
            id={'_Services.poweredByProfile'}
            defaultMessage={'Powered by'}
          />{' '}
          <span className="logo">
            CheKin<sup>ID</sup>
          </span>
        </p>
        <p className="directive">
        </p>
        <div className="row no-gutters">
          <div className="col-12 col-md-4">
            <button
              data-modal="phone"
              className={`service d-flex${
                published.phone
                  ? ' published'
                  : provisional.phone
                    ? ' verified'
                    : ''
              }`}
              onClick={handleToggle}
            >
              <span className="image-container d-flex align-items-center justify-content-center">
                <img src="images/phone-icon-light.svg" alt="phone icon" />
              </span>
              <span className="service-name">
                <FormattedMessage
                  id={'_Services.phoneProfile'}
                  defaultMessage={'Phone'}
                />
              </span>
            </button>
          </div>
          <div className="col-12 col-md-4">
            <button
              data-modal="email"
              className={`service d-flex${
                published.email
                  ? ' published'
                  : provisional.email
                    ? ' verified'
                    : ''
              }`}
              onClick={handleToggle}
            >
              <span className="image-container d-flex align-items-center justify-content-center">
                <img src="images/email-icon-light.svg" alt="email icon" />
              </span>
              <span className="service-name">
                <FormattedMessage
                  id={'_Services.emailProfile'}
                  defaultMessage={'Email'}
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default VerifierServices
