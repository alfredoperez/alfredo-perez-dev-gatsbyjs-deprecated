import { merge } from 'theme-ui'
import { transparentize } from '@theme-ui/color'
import { tailwind } from '@theme-ui/presets'
import elegantTheme from '../theme'

require('typeface-ibm-plex-sans')

const tailwindAndElegantTheme = merge(tailwind, elegantTheme)

const theme = merge(tailwindAndElegantTheme, {
  initialColorModeName: `light`,
  useCustomProperties: true,
  fonts: {
    body: `"IBM Plex Sans", -apple-system, BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`,
  },
  copyButton: {
    backgroundColor: transparentize(`primary`, 0.8),
    border: `none`,
    color: `gray.2`,
    cursor: `pointer`,
    fontSize: [`14px`, `14px`, `16px`],
    fontFamily: `body`,
    letterSpacing: `0.025rem`,
    transition: `default`,
    '&[disabled]': {
      cursor: `not-allowed`,
    },
    ':not([disabled]):hover': {
      bg: `primary`,
      color: `white`,
    },
    position: `absolute`,
    top: 0,
    right: 0,
    zIndex: 1,
    borderRadius: `0 0 0 0.25rem`,
    padding: `0.25rem 0.6rem`,
  },
})

export default theme
