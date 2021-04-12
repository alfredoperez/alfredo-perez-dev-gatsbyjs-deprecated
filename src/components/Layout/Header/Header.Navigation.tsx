/** @jsx jsx */
import React from 'react'
import { jsx, Link as TLink } from 'theme-ui'
import { Link } from 'gatsby'
import useBlogConfig from '@hooks/use-blog-config'
import replaceSlashes from '@utils/replace-slashes'

type NavigationProps = {
  items: {
    title: string
    slug: string
  }[]
}

const HeaderNavigation = ({ items }: NavigationProps) => {
  const { basePath } = useBlogConfig()

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
            <TLink key={item.slug} as={Link} activeClassName="active" to={replaceSlashes(`/${basePath}/${item.slug}`)}>
              {item.title}
            </TLink>
          ))}
        </nav>
      )}
    </React.Fragment>
  )
}

export default HeaderNavigation
