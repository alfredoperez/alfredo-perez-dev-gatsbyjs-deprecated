import React from 'react'
import { buildResponsiveVariant } from '@utils/buildResponsiveVariant'
import Base from './Card.Base'

type Category = {
  name: string
  color: string
  slug: string
  icon: string
}

type Author = {
  name: string
  slug: string
  thumbnail: unknown
}

type CardProps = {
  variantGroup: unknown
  variant:
    | 'horizontal'
    | 'horizontal-aside'
    | 'horizontal-md'
    | 'horizontal-lg'
    | 'horizontal-cover'
    | 'horizontal-cover-hero'
    | 'horizontal-cover-wide'
    | 'horizontal-hero'
    | 'vertical-cover'
    | 'vertical'
    | 'search'
  omitMedia: boolean
  omitCategory: boolean
  omitExcerpt: boolean
  omitAuthor: boolean
  omitBody: boolean
  omitFooter: boolean
  aside: boolean
  columns: Array<unknown>
  mediaType: 'icon' | 'image'
  imageVariant: string
  loading: 'lazy' | 'auto' | 'eager'
  title: string | {}
  slug: string
  link: string
  category: Category
  author: Author
  date: string
  timeToRead: number
  excerpt: string
  thumbnail: unknown
  thumbnailText: string
}

const Card = ({ variantGroup = 'cards', variant = 'vertical', aside, ...props }: CardProps) => {
  const responsiveVariant = buildResponsiveVariant(variantGroup, variant)
  return <Base variant={responsiveVariant} {...props} />
}

export default Card