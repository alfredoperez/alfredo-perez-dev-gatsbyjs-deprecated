/** @jsx jsx */
import React from 'react'
import { jsx, Link as TLink } from 'theme-ui'
import defaultOptions from '../../../config/default-Options'

const FooterExternalLinks = () => {
  const { externalLinks } = defaultOptions.websiteData

  return (
    <React.Fragment>
      {externalLinks.length > 0 && (
        <div sx={{ 'a:not(:first-of-type)': { ml: 3 }, fontSize: [1, `18px`] }}>
          {externalLinks.map((link) => (
            <TLink key={link.url} href={link.url}>
              {link.name}
            </TLink>
          ))}
        </div>
      )}
    </React.Fragment>
  )
}

export default FooterExternalLinks
