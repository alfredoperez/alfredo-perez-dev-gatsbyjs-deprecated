import { toTheme } from '@theme-ui/typography'

const fonts = {
  theme: {
    headerFontFamily: ['IBM Plex Sans', 'sans-serif'],
    bodyFontFamily: ['IBM Plex Sans', 'sans-serif'],
    monospace: ['Fira Code'],
  },
}

const typography = {
  baseFontSize: 16,
  baseLineHeight: 1.8,
  headerLineHeight: 1.33,
  scaleRatio: 1.9,
  blockMarginBottom: 0.62,
  ...fonts.theme,
}

const typographyTheme = toTheme(typography)

// We use our own config for this property
typographyTheme.space = null

typographyTheme.fonts = {
  ...typographyTheme.fonts,
  monospace: `"Fira Code", Menlo, Monaco, source-code-pro, Courier New, monospace`,
}

typographyTheme.fontWeights = {
  body: `normal`,
  heading: `bold`,
  bold: 700,
  medium: 600,
  bolder: 900,
}

typographyTheme.fontSizes = [
  '0.75rem',
  '0.875rem',
  '1rem',
  '1.25rem',
  '1.5rem',
  '1.875rem',
  '2.25rem',
  '3rem',
  '4rem',
  '4.5rem',
]

export default typographyTheme
