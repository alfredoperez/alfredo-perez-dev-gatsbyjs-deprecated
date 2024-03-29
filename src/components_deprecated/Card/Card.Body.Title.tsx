import React from 'react'
import { Link as GLink } from 'gatsby'
import { Heading } from 'theme-ui'
import { buildResponsiveVariant as rv } from '../../utils'

const CardBodyTitle = ({ variant, title, slug, link }) => {
  const linkProps = link
    ? {
        as: `a`,
        href: link,
        target: `_blank`,
        rel: `noopener noreferrer`,
      }
    : {
        as: GLink,
        to: `/notes${slug.toLocaleLowerCase()}`,
      }
  return (
    <Heading {...linkProps} sx={{ variant: rv(variant, `title`) }}>
      {title}
    </Heading>
  )
}

export default CardBodyTitle
