/** @jsx jsx */
import { jsx } from 'theme-ui'
import FooterExternalLinks from './Footer.ExternalLinks'
import defaultOptions from '../../../config/default-Options'

const Footer = () => {
  return (
    <footer
      sx={{
        boxSizing: `border-box`,
        display: `flex`,
        justifyContent: `space-between`,
        mt: [6],
        color: `secondary`,
        a: {
          variant: `links.secondary`,
        },
        flexDirection: [`column`, `column`, `row`],
        variant: `dividers.top`,
      }}
    >
      <div>
        &copy; {new Date().getFullYear()} by {defaultOptions.siteMetadata.siteTitle}. All rights
        reserved.
      </div>
      <FooterExternalLinks />
    </footer>
  )
}

export default Footer
