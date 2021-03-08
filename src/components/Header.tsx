/** @jsx jsx */
import { jsx, useColorMode } from 'theme-ui'
import { Flex } from '@theme-ui/components'
import useBlogConfig from '../hooks/use-blog-config'
import Navigation from './Navigation'
import Logo from './Logo'
import ColorModeToggle from './colormode-toggle'

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
      <Flex
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
        <Logo />
        <Flex sx={{ alignItems: `center`, justifyContent: `space-between`, marginRight: `2rem` }}>
          <Navigation nav={nav} sx={{ marginRight: `2rem` }} />
          <ColorModeToggle isDark={isDark} toggle={toggleColorMode} />
        </Flex>
      </Flex>
    </header>
  )
}

export default Header
