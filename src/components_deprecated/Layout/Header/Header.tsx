/** @jsx jsx */
import { Box, Container, jsx } from 'theme-ui'
import { Flex } from '@theme-ui/components'
import { Link } from 'gatsby'
import Logo from '../../Logo/Logo'
import { replaceSlashes } from '../../../utils'
import HeaderColorModeToggle from './Header.ColorModeToggle'
import Search from '../Search/Search'
import defaultOptions from '../../../config/default-Options'
import { HeaderMenu } from './Header.Menu'

const styles = {
  wrapper: {
    position: `relative`,
    bg: `headerBg`,
  },
  container: {
    position: `relative`,
    zIndex: 10,
  },
  logoContainer: {
    flexBasis: [`full`, `full`, `1/3`],
  },
  colorModeContainer: {
    minWidth: `auto`,
    order: [2, 2, `unset`],
  },
  searchContainer: {
    flexBasis: [`auto`, `auto`, `1/3`],
    minWidth: `auto`,
    order: [3, 3, `unset`],
    mx: 3,
  },
  menuContainer: {
    flexBasis: [`auto`, `auto`, `1/3`],
    minWidth: `auto`,
    order: [4, 4, `unset`],
  },
}
const Header = () => {
  const { websiteData, siteMetadata } = defaultOptions
  const { siteTitle } = siteMetadata
  console.log({ siteTitle })
  return (
    <Box sx={styles.wrapper}>
      <Container variant="compact" sx={styles.container}>
        <Flex variant="layout.header">
          <Box sx={styles.logoContainer}>
            <Link
              to={replaceSlashes(`/${websiteData.basePath}`)}
              aria-label={`${siteTitle} - Back to home`}
              sx={{ color: `heading`, textDecoration: `none` }}
            >
              <Logo />
            </Link>
          </Box>
          <Box sx={styles.searchContainer}>
            <Search />
          </Box>
          <Box sx={styles.menuContainer}>
            <HeaderMenu />
          </Box>

          <Box sx={styles.colorModeContainer}>
            <HeaderColorModeToggle />
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default Header
