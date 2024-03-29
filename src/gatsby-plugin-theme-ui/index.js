import { merge } from 'theme-ui'
import { tailwind } from '@theme-ui/presets'
import { transparentize } from '@theme-ui/color'
import customTheme from './custom-theme'

require('typeface-ibm-plex-sans')
require('typeface-fira-code')

const tailwindAndCustomTheme = merge(tailwind, customTheme)

const theme = merge(tailwindAndCustomTheme, {
  initialColorModeName: `light`,
  useCustomProperties: true,

  copyButton: {
    backgroundColor: transparentize(`primary`, 0.8),
    border: `none`,
    color: `gray.2`,
    cursor: `pointer`,
    fontSize: [`14px`, `14px`, `16px`],
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
