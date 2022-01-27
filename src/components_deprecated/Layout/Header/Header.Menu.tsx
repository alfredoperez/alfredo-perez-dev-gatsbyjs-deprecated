import React from 'react'
import { Box } from 'theme-ui'
import HeaderNavigation from './Header.Navigation'
import defaultOptions from '../../../config/default-Options'

const styles = {
  desktopMenu: {
    display: [`none`, `none`, `block`],
  },
  mobileMenu: {
    display: [`block`, `block`, `none`],
  },
  desktopMenuWrapper: {
    justifyContent: `flex-end`,
  },
}

export const HeaderMenu = () => {
  const { navigation: navItems } = defaultOptions.websiteData

  const desktopMenuNav = <HeaderNavigation items={navItems} />

  // const mobileMenuNav = (
  //   <Navigation
  //     variant="vertical"
  //     headingProps={{ variant: 'h3' }}
  //     items={[
  //       {
  //         title: 'Main Menu',
  //         items: navItems,
  //       },
  //       mobileMenu,
  //     ]}
  //   />
  // )

  return (
    <>
      <Box sx={styles.desktopMenu}>{desktopMenuNav}</Box>
      {/* <Box sx={styles.mobileMenu}>{mobileMenuNav}</Box> */}
    </>
  )
}
