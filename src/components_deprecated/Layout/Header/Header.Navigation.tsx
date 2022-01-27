/** @jsx jsx */
import React from 'react'
import { jsx, Link as TLink } from 'theme-ui'
import { Link } from 'gatsby'
import { replaceSlashes } from '../../../utils'
import defaultOptions from '../../../config/default-Options'

type NavigationProps = {
  items: {
    title: string
    slug: string
  }[]
}

const HeaderNavigation = ({ items }: NavigationProps) => {
  const { basePath } = defaultOptions.websiteData

  return (
    <React.Fragment>
      {items.length > 0 && (
        <nav
          sx={{
            'a:not(:last-of-type)': { mr: 3 },
            fontSize: [1, `18px`],
            '.active': { color: `heading` },
          }}
        >
          {items.map((item) => (
            <TLink
              key={item.slug}
              as={Link}
              activeClassName="active"
              to={replaceSlashes(`/${basePath}/${item.slug}`)}
            >
              {item.title}
            </TLink>
          ))}
        </nav>
      )}
    </React.Fragment>
  )
}

export default HeaderNavigation
