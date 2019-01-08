import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import Pagination from 'react-js-pagination'
import { withRouter } from 'react-router'

import { getListingIds } from 'actions/Listing'
import origin from '../services/origin'
import { getListing } from 'utils/listing'

import { LISTINGS_PER_PAGE } from 'components/constants'
import ListingCard from 'components/listing-card'

const { web3 } = origin.contractService

class ListingsGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: 'all',
      listings: [],
      loading: true,
      processing: false
    }
    this.handleOnChange = this.handleOnChange.bind(this)
  }

  componentWillMount() {
    if (this.props.renderMode === 'home-page') {
      /*const roleName = this.props.provisional.roleName
      var category = null;
      console.log("ROLENAMECOMPONENT: " + JSON.stringify(roleName));
      if(roleName == 'Cleaner')
      {
        category = 'Limpieza Residencial';
      }
      else if (roleName == 'Owner') {
        category = 'Oferta de Limpieza';
      }
      
      //this.props.getListingIds()*/

      if (
        this.props.wallet.address &&
        (web3.givenProvider || origin.contractService.walletLinker)
      ) {
        this.loadListings()
      } else if (!web3.givenProvider) {
        this.props.storeWeb3Intent('view your listings')
        origin.contractService.showLinkPopUp()
      }
      
    }
  }

  componentDidUpdate(prevProps) {
    const { wallet } = this.props

    // on account change
    if (wallet.address && wallet.address !== prevProps.wallet.address) {
      /*const roleName = this.props.provisional.roleName
      var category = null;
      console.log("ROLENAMECOMPONENT: " + JSON.stringify(roleName));
      if(roleName == 'Cleaner')
      {
        category = 'Limpieza Residencial';
      }
      else if (roleName == 'Owner') {
        category = 'Oferta de Limpieza';
      }*/
      this.loadListings()
    }
  }

  /*componentDidUpdate(){
    const roleName = this.props.provisional.roleName
      var category = null;
      console.log("ROLENAMECOMPONENT: " + JSON.stringify(roleName));
      if(roleName == 'Cleaner')
      {
        category = 'Limpieza Residencial';
      }
      else if (roleName == 'Owner') {
        category = 'Oferta de Limpieza';
      }
    this.loadListings(category);
  }*/

  /*async loadListings(category) {
    try {
      console.log("CATEGORY_INTO: " + JSON.stringify(category));
      const ids = await origin.marketplace.getListings({idsOnly: true})
      console.log("LOADLISTINGSIDS: " + JSON.stringify(ids));
      const listings = await Promise.all(
        ids.map(id => {
          return getListing(id, true)
        })
      )

      console.log("LOADLISTINGSLISTINGS: " + JSON.stringify(listings));

      var arrayIds = [];
      if(category) {
        var k;
        for(k = 0; k < ids.length; k++) {
          console.log("OBTENGO[" + k + "] = " + JSON.stringify(ids[k]));
          var list = getListing(ids[k], true);
          console.log("GETLISTING[" + i + "] = " + JSON.stringify(list));
          if(list.category === category) {
            arrayIds.push(ids[k]);
            console.log("ARRAYAUX: " + JSON.stringify(arrayIds));
          }
          else console.log("NO SE METE EL ID " + k);
        }
      }
      /*var arrayIds = [];
      if(category) {
        var k;
        for(k = 0; k < listings.length; k++) {
          if(listings[k].category === category) {
            arrayIds.push(listing[k].id);
            console.log("ARRAYAUX: " + JSON.stringify(arrayIds));
          }
          else console.log("NO SE METE EL ID " + k);
        }
      }

      this.setState({ listingIds: arrayIds })
    } catch (error) {
      console.error('Error fetching listing ids')
    }
  }*/

  handleOnChange(page) {
    if (this.props.renderMode === 'home-page') {
      this.props.history.push(`/page/${page}`)
    } else {
      this.props.handleChangePage(page)
    }
  }

  async loadListings() {
    try {
      const ids = await origin.marketplace.getListings({
        idsOnly: true
      })
      const listings2 = await Promise.all(
        ids.map(id => {
          return getListing(id, true)
        })
      );

      var categoryPer = this.props.provisional.roleName === "Owner" ? "Oferta de Limpieza" : (this.props.provisional.roleName === "Cleaner" ? "Limpieza Residencial" : '');
      const listingsCat = await Promise.all(listings2.filter(list => { return list.category === categoryPer && list.status === 'active'}));
      const listings = await Promise.all(listingsCat.map(list => { return list.id }))

      this.setState({ listings, loading: false })
    } catch (error) {
      console.error('Error fetching listing ids')
    }
  }

  render() {
    //const { contractFound, listingIds, search } = this.props
    const { filter, listings, loading, processing } = this.state
    let activePage, currentPageListingIds, resultsCount

    if (this.props.renderMode === 'home-page') {
      activePage = parseInt(this.props.match.params.activePage) || 1

      const startSlicePosition = Math.max(0, LISTINGS_PER_PAGE * (activePage - 1))
      currentPageListingIds = listings.slice(
        startSlicePosition,
        Math.max(0, startSlicePosition + LISTINGS_PER_PAGE)
      )
      resultsCount = listings.length
    } else if (this.props.renderMode === 'search') {
      currentPageListingIds = search.listings
      activePage = this.props.searchPage
      resultsCount = search.listingsLength
    }

    return (
      <div className="listings-wrapper">
        {listings && (
          <div className="listings-grid">
            {resultsCount > 0 && (
              <h1>
                <FormattedMessage
                  id={'listings-grid.listingsCount'}
                  defaultMessage={'{listingIdsCount}' + ('{listingIdsCount}' === 1 ? 'anuncio' : 'anuncios')}
                  values={{
                    listingIdsCount: (
                      <FormattedNumber value={resultsCount} />
                    )
                  }}
                  
                />
              </h1>
            )}
            <div className="row">
              {listings.map(id => (
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

const mapStateToProps = ({ app, profile, wallet }) => {
  return {
    provisional: profile.provisional,
    wallet,
    web3Intent: app.web3.intent,
    profile: profile,
  }
}

const mapDispatchToProps = dispatch => ({
  getListingIds: () => dispatch(getListingIds()),
  storeWeb3Intent: intent => dispatch(storeWeb3Intent(intent))
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ListingsGrid)
)
