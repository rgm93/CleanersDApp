import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import Pagination from 'react-js-pagination'
import { withRouter } from 'react-router'

import { getListingIds } from 'actions/Listing'

import { LISTINGS_PER_PAGE } from 'components/constants'
import ListingCard from 'components/listing-card'

class ListingsGridUser extends Component {
  constructor(props) {
    super(props)
    this.handleOnChange = this.handleOnChange.bind(this)
  }

  componentWillMount() {
    const roleName = this.props.provisional.roleName;
    var category = null;
    console.log("ROLENAMECOMPONENT: " + JSON.stringify(roleName));
    if(roleName == 'Cleaner')
    {
      category = 'schema.housing.businessRentals';
    }
    else if (roleName == 'Owner') {
      category = 'schema.housing.vacationRentals';
    }

    console.log("CATEGORY: " + JSON.stringify(category));
    if (this.props.renderMode === 'home-page') {
      this.props.getListingIds()
      
    }
  }

  /*componentWillMount() {
    if (this.props.renderMode === 'home-page') {
      this.props.getListingIds()
    }
  }*/

  handleOnChange(page) {
    if (this.props.renderMode === 'home-page') {
      this.props.history.push(`/page/${page}`)
    } else {
      this.props.handleChangePage(page)
    }
  }

  render() {
    const { contractFound, listingIds, search } = this.props
    let activePage, currentPageListingIds, resultsCount

    if (this.props.renderMode === 'home-page') {
      activePage = parseInt(this.props.match.params.activePage) || 1

      const startSlicePosition = Math.max(0, LISTINGS_PER_PAGE * (activePage - 1))
      currentPageListingIds = listingIds.slice(
        startSlicePosition,
        Math.max(0, startSlicePosition + LISTINGS_PER_PAGE)
      )
      resultsCount = listingIds.length
    } else if (this.props.renderMode === 'search') {
      currentPageListingIds = search.listingIds
      activePage = this.props.searchPage
      resultsCount = search.listingsLength
    }

    return (
      <div className="listings-wrapper">
        {contractFound === false && (
          <div className="listings-grid">
            <div className="alert alert-warning" role="alert">
              <FormattedMessage
                id={'listings-grid.originContractNotFoundUser'}
                defaultMessage={
                  'No Origin listing contracts were found on this network.'
                }
              />
              <br />
              <FormattedMessage
                id={'listings-grid.changeNetworksUser'}
                defaultMessage={
                  'You may need to change networks, or deploy the contract.'
                }
              />
            </div>
          </div>
        )}
        {contractFound && (
          <div className="listings-grid">
            {resultsCount > 0 && (
              <h1>
                <FormattedMessage
                  id={'listings-grid.listingsCountUser'}
                  defaultMessage={'{listingIdsCount} Propiedades'}
                  values={{
                    listingIdsCount: (
                      <FormattedNumber value={resultsCount} />
                    )
                  }}
                />
              </h1>
            )}
            <div className="row">
              {currentPageListingIds.map(id => (
                <ListingCard
                  listingId={id}
                  key={id}
                />
              ))}
            </div>
            <Pagination
              activePage={parseInt(activePage)}
              itemsCountPerPage={LISTINGS_PER_PAGE}
              totalItemsCount={resultsCount}
              pageRangeDisplayed={5}
              onChange={this.handleOnChange}
              itemClass="page-item"
              linkClass="page-link"
              hideDisabled="true"
            />
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  contractFound: state.listings.contractFound,
  listingIds: state.listings.ids,
  provisional: state.profile.provisional
})

const mapDispatchToProps = dispatch => ({
  getListingIds: () => dispatch(getListingIds())
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ListingsGridUser)
)
