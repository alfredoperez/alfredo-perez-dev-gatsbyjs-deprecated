/** @jsx jsx */
import React from 'react'
import { Box, Container, jsx } from 'theme-ui'
import SEO from '../seo'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import SkipNavLink from '../skip-nav'
import CodeStyles from '../../theme/code'
import 'normalize.css'
import pageContextProvider from '../pageContextProvider'

type LayoutProps = { children: React.ReactNode; className?: string }

const Layout = ({ children, className = `` }: LayoutProps) => {
  const pageContext: PageContext = {
    paginatePostsPage: true,
    basePath: true,
    services: true,
    siteUrl: true,
    mobileMenu: true,
    isDarkModeActive: true,
  }
  return (
    <React.Fragment>
      <pageContextProvider.Provider value={{ pageContext }}>
        <SEO />
        <SkipNavLink>Skip to content</SkipNavLink>
        <Container>
          <Header />
          <Box id="skip-nav" sx={{ ...CodeStyles }} className={className}>
            {children}
          </Box>
          <Footer />
        </Container>
      </pageContextProvider.Provider>
    </React.Fragment>
  )
}

export default Layout
