import React from 'react'
import { Box } from 'theme-ui'
import { buildResponsiveVariant as rv } from '@utils/buildResponsiveVariant'
import CardBodyStatus from './Card.Body.Status'
import CardBodyTitle from './Card.Body.Title'
import CardBodyExcerpt from './Card.Body.Excerpt'
import { CardProps } from './Card'

const styles = {
  body: {
    display: `flex`,
    flexDirection: `column`,
    justifyContent: `center`,
    flex: 1,
  },
}

const CardBody = ({ children, omitBody, ...props }: CardProps) =>
  !omitBody && (
    <Box
      sx={{
        ...styles.body,
        variant: rv(props.variant, 'body'),
      }}
    >
      <CardBodyStatus {...props} />
      <CardBodyTitle {...props} />
      <CardBodyExcerpt {...props} />
      {children}
    </Box>
  )

export default CardBody
