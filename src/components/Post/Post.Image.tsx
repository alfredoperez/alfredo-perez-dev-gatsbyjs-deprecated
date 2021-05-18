import React from 'react'
import Img from 'gatsby-image'
import { css } from 'theme-ui'
import Divider from '@components/Divider'
import getImageVariant from '@utils/getImageVariant'

const styles = {
  regular: {
    minHeight: `23rem`,
    img: {
      borderRadius: `lg`,
    },
  },
  wide: {
    img: {
      borderRadius: `lg`,
    },
  },
  inCard: {
    mt: -4,
    mx: -4,
    img: {
      borderRadius: (t) => `${t.radii.lg} ${t.radii.lg} 0 0`,
    },
  },
  inCardLarge: {
    mt: -5,
    mx: -5,
    img: {
      borderRadius: (t) => `${t.radii.lg} ${t.radii.lg} 0 0`,
    },
  },
}

type PostImageProps = {
  wide: boolean
  full: boolean
  inCard: boolean
  inCardLarge: boolean
  title: string
  thumbnail: string
}

export const PostImage = ({ title, thumbnail, wide, full, inCard, inCardLarge }: PostImageProps) => {
  if (!thumbnail) return null

  // const variant = (wide && 'wide') || (full && 'full') || 'regular'
  // const image = getImageVariant(thumbnail, 'hero')

  return (
    <React.Fragment>
      <p>HERE GOES THE Thumbnail IMAGE</p>
      {/*<Img*/}
      {/*  image={image}*/}
      {/*  alt={title}*/}
      {/*  css={css({*/}
      {/*    ...styles[variant],*/}
      {/*    ...(inCard && styles.inCard),*/}
      {/*    ...(inCardLarge && styles.inCardLarge),*/}
      {/*  })}*/}
      {/*  imgStyle={variant === 'wide' || variant === 'full' ? styles.full : undefined}*/}
      {/*/>*/}
      <Divider space={3} />
    </React.Fragment>
  )
}
