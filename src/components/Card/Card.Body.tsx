import React from 'react'
import { Box } from 'theme-ui'
import { buildResponsiveVariant as rv } from '../../utils'
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

const CardBody = ({ children, omitBody, ...props }: CardProps) => {
  const bodyVariant = rv(props.variant, `body`)
  console.log(bodyVariant)
  return (
    !omitBody && (
      <Box
        sx={{
          ...styles.body,
          variant: bodyVariant,
        }}
      >
        <CardBodyStatus {...props} />
        <CardBodyTitle {...props} />
        <CardBodyExcerpt {...props} />
        {children}
      </Box>
    )
  )
}

export default CardBody
