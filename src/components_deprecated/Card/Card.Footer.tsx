import React from 'react'
import { Box, Flex } from 'theme-ui'
import CardFooterTags from './Card.Footer.Tags'
import { buildResponsiveVariant as rv } from '../../utils/buildResponsiveVariant'
import Info from './Card.Footer.Info'

const styles = {
  wrapper: {
    alignItems: `center`,
  },
  postInfo: {
    flex: 1,
    flexWrap: `wrap`,
    justifyContent: `space-between`,
    color: `omega`,
  },
}

const CardFooter = ({ omitFooter, ...props }) =>
  !omitFooter && (
    <Box sx={{ variant: rv(props.variant, `footer`) }}>
      <Flex sx={styles.wrapper}>
        <CardFooterTags {...props} />
        <Flex sx={styles.postInfo}>
          {/* <AuthorName {...props} /> */}
          <Info {...props} />
        </Flex>
      </Flex>
    </Box>
  )
export default CardFooter
