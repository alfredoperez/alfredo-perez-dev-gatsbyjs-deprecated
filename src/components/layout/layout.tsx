/** @jsx jsx */
import React from 'react'
import { Box, Container, jsx } from 'theme-ui'
import SEO from '../seo'
import Header from './header'
import Footer from './footer'
import SkipNavLink from '../skip-nav'
import 'normalize.css'
import CodeStyles from '../../styles/code'

type LayoutProps = { children: React.ReactNode; className?: string }

const Layout = ({ children, className = `` }: LayoutProps) => (
  <React.Fragment>
    <SEO />
    <SkipNavLink>Skip to content</SkipNavLink>
    <Container>
      <Header />
      <Box id="skip-nav" sx={{ ...CodeStyles }} className={className}>
        {children}
      </Box>
      <Footer />
    </Container>
  </React.Fragment>
)

export default Layout
