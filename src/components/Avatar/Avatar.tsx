/** @jsx jsx */
import React from 'react'
import Img from 'gatsby-image'
import { Box, jsx, ThemeUICSSObject } from 'theme-ui'
import { normalizeImage } from '../../utils/normalizeImage'
import MemphisPattern from '../MemphisPattern'

// Base size to keep all layers aligned easier
const bs = (x: number) => `${x * 0.35}rem`

const styles = {
  wrapper: {
    position: `relative`,
    zIndex: 2,
    textAlign: `center`,
    mb: bs(3),
  } as ThemeUICSSObject,
  pattern: {
    backgroundSize: `8rem`,
    opacity: 0.15,
  } as ThemeUICSSObject,
  circle: ({ width }: any) =>
    ({
      width: [bs(30), `full`],
      height: `full`,
      maxWidth: width,
      borderRadius: `full`,
      position: `absolute`,
      transform: `translate(-50%)  scale(0.98)`,
      left: `50%`,
      top: bs(3),
      bg: `alpha`,
    } as ThemeUICSSObject),
  arc: ({ width }: any) =>
    ({
      width: [bs(30), `full`],
      height: `full`,
      maxWidth: width,
      borderRadius: `full`,
      position: `absolute`,
      zIndex: 2,
      left: `50%`,
      transform: `translate(-50%)`,
      mt: bs(-1),
      ml: bs(-2),
      boxShadow: (t) => `
			${bs(2)}
			${bs(4)}
			${t.colors.omegaLight}
		`,
    } as ThemeUICSSObject),
  imageWrapper: ({ width }: any) =>
    ({
      width: [bs(30), `full`],
      maxWidth: width,
      position: `relative`,
      mx: `auto`,
      '> div': {
        borderRadius: `0 0 9999px 9999px`,
      },
    } as ThemeUICSSObject),
  imageWrapperSimple: ({ width }: any) => ({
    width,
    bg: `omegaLight`,
    display: `inline-block`,
    verticalAlign: `middle`,
    borderRadius: `full`,
    borderStyle: `solid`,
    borderWidth: `md`,
    borderColor: `omegaLight`,
    overFlow: `hidden`,
    // filter: `grayscale(1)`,
    opacity: 0.9,
    mr: 3,
    ':hover': {
      opacity: 1,
    },
    '> div': {
      borderRadius: `full`,
    },
  }),
}

type AvatarProps = {
  avatar: any
  size: false | 'regular'
  width?: number
  simple: boolean
  withPattern: boolean
  patternStyles: unknown
}
const Avatar = ({
  avatar = `regular`,
  withPattern = false,
  patternStyles = {},
  simple = false,
  size,
  width,
}: AvatarProps) => {
  if (!avatar || !avatar[size]) return null

  const image = normalizeImage(avatar[size])

  width = width || image.width

  return simple ? (
    <Box sx={styles.imageWrapperSimple({ width })}>
      <Img fluid={image} />
    </Box>
  ) : (
    <Box sx={styles.wrapper}>
      <Box>
        {withPattern && <MemphisPattern sx={{ ...styles.pattern, ...patternStyles }} />}
        <Box sx={styles.circle({ width })} />
        <Box sx={styles.arc({ width })} />
        <Box sx={styles.imageWrapper({ width })}>
          <Img fluid={image} />
        </Box>
      </Box>
    </Box>
  )
}

export default Avatar
