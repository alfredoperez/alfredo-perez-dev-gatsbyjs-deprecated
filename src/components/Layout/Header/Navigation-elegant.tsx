import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import { Divider, Flex, Heading, IconButton, NavLink } from 'theme-ui'
import { hashCode } from '@utils/hashCode'
import { buildResponsiveVariant } from '@utils/index'

const NavigationItem = ({ name, slug, url, Icon, color, variant, iconOnly }) => {
  let linkProps = {
    sx: { variant: iconOnly ? 'icon' : variant },
  }

  //External link
  if (url) {
    linkProps = {
      ...linkProps,
      as: 'a',
      href: url,
      target: '_blank',
      rel: 'noopener noreferrer',
    }
  }
  //Internal link
  if (slug) {
    linkProps = {
      ...linkProps,
      as: Link,
      to: slug,
    }
  }

  return iconOnly ? (
    <IconButton {...linkProps} title={name}>
      {Icon && <Icon color={color} />}
    </IconButton>
  ) : (
    <NavLink {...linkProps}>
      {Icon && <Icon color={color} />}
      {name}
    </NavLink>
  )
}

const NavigationList = ({ navKey, wrapperProps, items, ...props }: unknown) => {
  return items ? (
    <Flex {...wrapperProps}>
      {items.map((menuItem, index) => {
        return <NavigationItem key={`${navKey}-${index}`} {...menuItem} {...props} />
      })}
    </Flex>
  ) : null
}

const NavigationDivider = ({ index }) =>
  index !== 0 && (
    <Divider
      sx={{
        mt: 3,
      }}
    />
  )

type NavigationMenuItem = {
  name: string
  title: string
  slug: string
  color: string
  Icon: unknown
}

type NavigationElegantProps = {
  variant: 'horizontal' | 'vertical'
  iconOnly: boolean
  wrapperStyle: unknown
  headingProps: unknown
  items: Array<NavigationMenuItem>
}

const NavigationElegant = ({ items, variant = 'horizontal', headingProps, wrapperStyle }: NavigationElegantProps) => {
  if (items.length === 0) return null

  const wrapperVariant = buildResponsiveVariant('lists.links', variant)
  const linkVariant = buildResponsiveVariant('links', variant)

  const navKey = `${hashCode(items.map((node) => node.title || node.name).join())}-nav`

  const wrapperProps = {
    sx: { variant: wrapperVariant, ...wrapperStyle },
    key: navKey,
  }

  const hasGroupedItems = Array.isArray(items[0].items)

  return hasGroupedItems ? (
    items.map((node, i) => (
      <Fragment key={`nav-menu-${i}`}>
        <NavigationDivider index={i} />
        <Heading {...headingProps}>{node.title}</Heading>
        <NavigationList navKey={navKey} wrapperProps={wrapperProps} items={node.items} variant={linkVariant} />
      </Fragment>
    ))
  ) : (
    <NavigationList navKey={navKey} wrapperProps={wrapperProps} items={items} variant={linkVariant} />
  )
}

export default NavigationElegant
