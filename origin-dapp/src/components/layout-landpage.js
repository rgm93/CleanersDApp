import React, { Fragment } from 'react'

import Footer from 'components/footer'
import NavBarLandPage from 'components/navbar-landpage'
import Warning from 'components/warning'

const Layout = ({ children }) => (
  <Fragment>
    <main>
      {/*<NavBarLandPage />*/}
      {children}
    </main>
    <Footer />
  </Fragment>
)

export default Layout
