import React, { PropsWithChildren } from 'react'
import { buildResponsiveVariant } from '@utils/buildResponsiveVariant'
import Base from './Card.Base'
import { VariantProp } from '@models/props'

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

export interface CardProps extends PropsWithChildren<any> {
  variantGroup: unknown
  variant: Array<VariantProp> | VariantProp
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
  loading?: 'lazy' | 'auto' | 'eager'

  thumbnail: unknown
  thumbnailText: string

  title: string | {}
  slug: string
  link: string
  category: Category
  author: Author
  date: string
  timeToRead: number
  excerpt: string
}

const Card = ({ variantGroup = 'cards', variant = 'vertical', aside, ...props }: CardProps) => {
  const responsiveVariant = buildResponsiveVariant(variantGroup, variant)
  return <Base variant={responsiveVariant} {...props} />
}

export default Card
