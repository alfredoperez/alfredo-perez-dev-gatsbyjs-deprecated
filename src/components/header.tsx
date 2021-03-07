/** @jsx jsx */
import { jsx, useColorMode } from 'theme-ui'
import { Flex } from '@theme-ui/components'
import useBlogConfig from '../hooks/use-blog-config'
import ColorModeToggle from './colormode-toggle'
import Navigation from './navigation'
import HeaderTitle from './header-title'
import logo from '../../static/logo.png'

const Header = () => {
  const { navigation: nav } = useBlogConfig()
  const [colorMode, setColorMode] = useColorMode()
  const isDark = colorMode === `dark`
  const toggleColorMode = (e: unknown) => {
    e.preventDefault()
    setColorMode(isDark ? `light` : `dark`)
  }

  return (
    <header sx={{ mb: [5, 6] }}>
      <Flex sx={{ alignItems: `center`, justifyContent: `space-between` }}>
        <HeaderTitle />
        <img src={logo} alt="Logo" />
        <ColorModeToggle isDark={isDark} toggle={toggleColorMode} />
      </Flex>
      <div
        sx={{
          boxSizing: `border-box`,
          display: `flex`,
          variant: `dividers.bottom`,
          alignItems: `center`,
          justifyContent: `space-between`,
          mt: 3,
          color: `secondary`,
          a: { color: `secondary`, ':hover': { color: `heading` } },
          flexFlow: `wrap`,
        }}
      >
        <Navigation nav={nav} />
      </div>
    </header>
  )
}

export default Header
