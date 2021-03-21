import React from 'react'
import { Box } from 'theme-ui'
import HeaderNavigation from './Header.Navigation'
import useBlogConfig from '@hooks/use-blog-config'

const styles = {
  desktopMenu: {
    display: [`none`, `none`, `block`],
  },
  mobileMenu: {
    display: [`block`, `block`, `none`],
  },
  desktopMenuWrapper: {
    justifyContent: 'flex-end',
  },
}

export const HeaderMenu = () => {
  const { navigation: navItems } = useBlogConfig()

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
    <React.Fragment>
      <Box sx={styles.desktopMenu}>{desktopMenuNav}</Box>
      {/*<Box sx={styles.mobileMenu}>{mobileMenuNav}</Box>*/}
    </React.Fragment>
  )
}
