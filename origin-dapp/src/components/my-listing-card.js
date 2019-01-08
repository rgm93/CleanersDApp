import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'

import {
  update as updateTransaction,
  upsert as upsertTransaction
} from 'actions/Transaction'

import origin from '../services/origin'

class MyListingCard extends Component {
  constructor(props) {
    super(props)
    //const { listing } = this.props
    const { id, seller, status, schemaType, category, display, name, description, postalCode,
            datetime, frequency, startDate, hours, haveProducts, pictures, price, boostValue,
            boostLevel, ipfsHash, listingType, events } = this.props.listing
    this.state = {
      listing: {
        id,
        seller,
        status,
        schemaType,
        category,
        display,
        name,
        description,
        postalCode,
        datetime,
        frequency,
        startDate,
        hours,
        haveProducts,
        pictures,
        price,
        boostValue,
        boostLevel,
        ipfsHash,
        listingType,
        events
      }
    }
    this.intlMessages = defineMessages({
      confirmCloseListing: {
        id: 'my-listing-card.confirmCloseListing',
        defaultMessage:
          '¿Quieres deshabilitar el anuncio?'
      },
      confirmOpenListing: {
        id: 'my-listing-card.confirmOpenListing',
        defaultMessage:
          '¿Quieres volver a publicar el anuncio?'
      }
    })

    this.closeListing = this.closeListing.bind(this)
  }

  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip()
  }

  async closeListing() {
    const {
      intl,
      //listing,
      handleProcessing,
      onClose,
    } = this.props
    const { address } = this.state.listing
    const prompt = confirm(
      intl.formatMessage(this.intlMessages.confirmCloseListing)
    )

    if (!prompt) {
      return null
    }

    try {
      handleProcessing(true)

      console.log("LISTADO: " + JSON.stringify(this.state.listing))

      


      //this.setState({ listing: {state: stt} });

      
      //let listingCopy = JSON.parse(JSON.stringify(this.state.listing))my

      //listingCopy.state = stt;

      console.log("ESTADO DEL ESTADO: " + JSON.stringify(stt))

      const stt = this.state.listing.status === "active" ? "inactive" : "active";

      let listingCopy = Object.assign({}, this.props.listing);
      listingCopy.status = stt;                       
 
      const listing = listingCopy
      var id = listing.id

      console.log("id => " + id)
      
      const methodName = 'updateListing'


      transactionReceipt = await origin.marketplace[methodName](
        id,
        listing,
        0,
        (confirmationCount, transactionReceipt) => {
          onClose && onClose()
          this.props.updateTransaction(confirmationCount, transactionReceipt)
        }
      )

      const transactionTypeKey = 'updateListing'

      this.props.upsertTransaction({
        ...transactionReceipt,
        transactionTypeKey
      })

      /*const {
        created,
        transactionReceipt
      } = await origin.marketplace.updateListing(
        listingCopy.id,
        {},
        0,
        (confirmationCount, transactionReceipt) => {
          // Having a transaction receipt doesn't guarantee that the listing status will have changed.
          // Let's relentlessly retrieve the data so that we are sure to get it. - Micah
          onClose && onClose()

          updateTransaction(confirmationCount, transactionReceipt)
        }
      )

      const transactionTypeKey = 'updateListing'

      this.props.upsertTransaction({
        ...transactionReceipt,
        created,
        transactionTypeKey
      })*/

      /*this.props.updateTransaction({
        ...transactionReceipt,
        created,
        transactionTypeKey
      })*/

      handleProcessing(false)


    } catch (error) {
      handleProcessing(false)
      console.error(`Error closing listing ${address}`)
      console.error(error)
    }
  }

  componentWillUnmount() {
    $('[data-toggle="tooltip"]').tooltip('dispose')
  }

  render() {
    const { listing } = this.props
    const { category, name, pictures } = listing
    const status = listing.status
    // const timestamp = `Created on ${moment(createdAt).format('MMMM D, YYYY')}`
    const photo = pictures && pictures.length > 0 && pictures[0]

    return (
      <div className="purchase card">
        <div className="card-body d-flex flex-column flex-lg-row">
          <div className="aspect-ratio">
            <div
              className={`${
                photo ? '' : 'placeholder '
              }image-container d-flex justify-content-center`}
            >
              <img
                src={photo || 'images/default-image.svg'}
                role="presentation"
              />
            </div>
          </div>
          <div className="content-container d-flex flex-column">
            <span className={`status ${status}`}>{status}</span>
            <p className="category">{category}</p>
            <h2 className="title text-truncate" title={name}>
              <Link to={`/listing/${listing.id}`}>{name}</Link>
            </h2>
            {/*<p className="timestamp">{timestamp}</p>*/}
            {/*<p className="price">
              {`${Number(price).toLocaleString(undefined, { minimumFractionDigits: 5, maximumFractionDigits: 5 })} ETH`}
              {!parseInt(unitsRemaining) &&
                <span className="badge badge-info">
                  <FormattedMessage
                    id={ 'my-listing-card.soldOut' }
                    defaultMessage={ 'Sold Out' }
                  />
                </span>
              }
            </p>*/}
            <div className="d-flex counts">
              {/*<p>
                <FormattedMessage
                  id={ 'my-listing-card.totalQuantity' }
                  defaultMessage={ 'Total Quantity : {quantity}' }
                  values={{ quantity: <FormattedNumber value={unitsRemaining} /> }}
                />
              </p>*/}
              {/*<p>Total Remaining: {(unitsRemaining - quantity).toLocaleString()}</p>*/}
            </div>
            <div className="d-flex counts">
              {/*<p>{Number(2).toLocaleString()} Pending Transactions</p>*/}
              {/*<p>{Number(3).toLocaleString()} Completed Transactions</p>*/}
            </div>
            <div className="actions d-flex">
              <div className="links-container">
                {/*<a onClick={() => alert('To Do')}>Edit</a>*/}
                {/*!active && <a onClick={() => alert('To Do')}>Enable</a>*/}
                {/*active && <a onClick={() => alert('To Do')}>Disable</a>*/}
                {status === 'inactive' ? null : (
                  <Fragment>
                    <Link to={`/update/${listing.id}`}>
                        <FormattedMessage
                          id={'my-listing-card.editListing'}
                          defaultMessage={'Editar oferta'}
                        />
                    </Link>
                    <a className="warning" onClick={this.closeListing}>
                      <FormattedMessage
                        id={'my-listing-card.closeListing'}
                        defaultMessage={'Cerrar oferta'}
                      />
                    </a>
                  </Fragment>
                )}
                {status === 'active' ? null : (
                  <Fragment>
                    <a className="secondary" onClick={this.closeListing}>
                      <FormattedMessage
                        id={'my-listing-card.openListing'}
                        defaultMessage={'Abrir oferta'}
                      />
                    </a>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  updateTransaction: (confirmationCount, transactionReceipt) =>
    dispatch(updateTransaction(confirmationCount, transactionReceipt)),
  upsertTransaction: transaction => dispatch(upsertTransaction(transaction))
})

export default connect(
  undefined,
  mapDispatchToProps
)(injectIntl(MyListingCard))
