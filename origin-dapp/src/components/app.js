import React, { Component, Fragment } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { saveServiceWorkerRegistration } from 'actions/Activation'
import { localizeApp, setMobile } from 'actions/App'
import { fetchProfile } from 'actions/Profile'
import {
  getEthBalance,
  getOgnBalance,
  storeAccountAddress
} from 'actions/Wallet'

// Components
import AboutTokens from 'components/about-tokens'
import Alert from 'components/alert'
import Analytics from 'components/analytics'
import Arbitration from 'components/arbitration'
import DappInfo from 'components/dapp-info'
import Layout from 'components/layout'
import ListingCreate from 'components/listing-create'
import ListingDetail from 'components/listing-detail'
import ListingsGrid from 'components/listings-grid'
import Messages from 'components/messages'
import Onboarding from 'components/onboarding'
import MyListings from 'components/my-listings'
import MyPurchases from 'components/my-purchases'
import MySales from 'components/my-sales'
import NotFound from 'components/not-found'
import Notifications from 'components/notifications'
import PurchaseDetail from 'components/purchase-detail'
import ScrollToTop from 'components/scroll-to-top'
import SearchResult from 'components/search/search-result'
import Web3Provider from 'components/web3-provider'

import Profile from 'pages/profile/Profile'
import User from 'pages/user/User'
import SearchBar from 'components/search/searchbar'
import LandPage from 'components/landpage'
import LoginPage from 'pages/profile/LoginUsuario'
import SignupPage from 'components/signpage'
import LayoutPage from 'components/layout-landpage'
import LayoutLogReg from 'components/layout-logreg'
import ReservaOferta from 'components/publicar-oferta'
import ReservaVivienda from 'components/publicar-vivienda'
import RegistrarUsuario from 'pages/profile/RegistrarUsuario'
import 'bootstrap/dist/js/bootstrap'

import { setClickEventHandler } from 'utils/analytics'
import { initServiceWorker } from 'utils/notifications'
import { mobileDevice } from 'utils/mobile'

// CSS
import 'bootstrap/dist/css/bootstrap.css'
import '../css/lato-web.css'
import '../css/poppins.css'
import '../css/app.css'

const withLayout = (LayoutComp, ComponentComp) => <LayoutComp><ComponentComp /></LayoutComp>;
const httpsRequired = process.env.FORCE_HTTPS
var loaded = null;

const landPage = () => (
  <Fragment>
    <LandPage id="features"/>
  </Fragment>
)

const loginPage = () => (
  <Fragment>
    <LoginPage />
  </Fragment>
)

const signupPage = () => (
  <Fragment>
    {/*<SignupPage />*/}
    <RegistrarUsuario />
  </Fragment>
)

const HomePage = () => (
  <Fragment>
    {/*<SearchBar />*/}
    <div className="container">
      <ListingsGrid renderMode="home-page" />
    </div>
  </Fragment>
)

const ListingDetailPage = props => (
  <ListingDetail listingId={props.match.params.listingId} withReviews={true} />
)

const CreateListingPage = props => (
  <div className="container">
    <ListingCreate listingId={props.match.params.listingId} />
  </div>
)

const PublicarOferta = props => (
  <div className="container">
    <ReservaOferta listingId={props.match.params.listingId} />
  </div>
)

const PublicarVivienda = props => (
  <div className="container">
    <ReservaVivienda listingId={props.match.params.listingId} />
  </div>
)

const PurchaseDetailPage = props => (
  <PurchaseDetail offerId={props.match.params.offerId} />
)

const ArbitrationPage = props => (
  <Arbitration offerId={props.match.params.offerId} />
)

const UserPage = props => <User userAddress={props.match.params.userAddress} />

// Top level component
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      redirect: httpsRequired && !window.location.protocol.match('https')
    }
  }

  componentWillMount() {
    if (this.state.redirect) {
      window.location.href = window.location.href.replace(/^http(?!s)/, 'https')
    }

    this.props.localizeApp()
    setClickEventHandler()
  }

  async componentDidMount() {
    this.props.storeAccountAddress()
    this.props.fetchProfile()
    this.props.getEthBalance()
    this.props.getOgnBalance()

    this.detectMobile()

    try {
      const reg = await initServiceWorker()

      this.props.saveServiceWorkerRegistration(reg)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Detect if accessing from a mobile browser
   * @return {void}
   */
  detectMobile() {
    this.props.setMobile(mobileDevice())
  }

  render() {
    // prevent flickering
    if (this.state.redirect) {
      return null
    }

    function RouteWithLayout({layout, component, ...rest}){
      return (
        <Route {...rest} render={(props) =>
          React.createElement( layout, props, React.createElement(component, props))
        }/>
      );
    }

    return this.props.selectedLanguageCode ? (
      <IntlProvider
        locale={this.props.selectedLanguageCode}
        defaultLocale="en-US"
        messages={this.props.messages}
        textComponent={Fragment}
      >
        <Router>
            <ScrollToTop>
              <Web3Provider>
                <Onboarding>
                  <Analytics>
                    <Switch>
                      <RouteWithLayout layout={LayoutPage} exact path="/" component={landPage} />
                      <RouteWithLayout layout={LayoutLogReg} exact path="/login" component={loginPage} />
                      <RouteWithLayout layout={LayoutLogReg} exact path="/signup" component={signupPage} />
                      <RouteWithLayout layout={Layout} exact path="/home" component={HomePage} />
                      <RouteWithLayout layout={LayoutLogReg} exact path="/publicar-oferta" component={PublicarOferta} />
                      <RouteWithLayout layout={Layout} exact path="/publicar-vivienda" component={PublicarVivienda} />
                      <RouteWithLayout layout={Layout} exact path="/create" component={CreateListingPage} />
                      <RouteWithLayout layout={Layout} exact path="/update/:listingAddress" component={CreateListingPage} />
                      <RouteWithLayout layout={Layout} exact path="/listing/:listingId" component={ListingDetailPage} />
                      <RouteWithLayout layout={Layout} exact path="/my-listings" component={MyListings} />
                      <RouteWithLayout layout={Layout} exact path="/my-purchases" component={MyPurchases} />
                      <RouteWithLayout layout={Layout} exact path="/purchases/:offerId" component={PurchaseDetailPage} />
                      <RouteWithLayout layout={Layout} exact path="/arbitration/:offerId" component={ArbitrationPage} />
                      <RouteWithLayout layout={Layout} exact path="/my-sales" component={MySales} />
                      <RouteWithLayout layout={Layout} exact path="/messages/:conversationId" component={Messages} />
                      <RouteWithLayout layout={Layout} exact path="/notifications" component={Notifications} />
                      <RouteWithLayout layout={Layout} exact path="/profile" component={Profile} />
                      <RouteWithLayout layout={Layout} exact path="/users/:userAddress" component={UserPage} />
                      <RouteWithLayout layout={Layout} exact path="/search" component={SearchResult} />
                    </Switch>
                </Analytics>
                <Alert />
              </Onboarding>
            </Web3Provider>
          </ScrollToTop>
        </Router>
      </IntlProvider>
    ) : null // potentially a loading indicator
  }
}

const mapStateToProps = state => ({
  messages: state.app.translations.messages,
  selectedLanguageCode: state.app.translations.selectedLanguageCode,
  networkId: state.app.web3.networkId
})

const mapDispatchToProps = dispatch => ({
  fetchProfile: () => dispatch(fetchProfile()),
  getEthBalance: () => dispatch(getEthBalance()),
  getOgnBalance: () => dispatch(getOgnBalance()),
  localizeApp: () => dispatch(localizeApp()),
  saveServiceWorkerRegistration: reg => dispatch(saveServiceWorkerRegistration(reg)),
  setMobile: device => dispatch(setMobile(device)),
  storeAccountAddress: () => dispatch(storeAccountAddress())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
