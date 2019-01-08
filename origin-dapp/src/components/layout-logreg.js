import React, { Fragment } from 'react'

import Footer from 'components/footer'
import NavBarLanding from 'components/navbarLanding'
import Warning from 'components/warning'

const Layout = ({ children }) => (
  <Fragment>
    <main className="d-flex flex-column">
      {/*<Warning />*/}
      <NavBarLanding />
      {children}
    </main>
    <Footer />
  </Fragment>
)

export default Layout
