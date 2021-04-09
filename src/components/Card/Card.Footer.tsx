import React from 'react'
import { Box, Flex } from 'theme-ui'
import { buildResponsiveVariant as rv } from '@utils/buildResponsiveVariant'
import AuthorAvatar from './Card.Footer.Author.Avatar'
import AuthorName from './Card.Footer.Author.Name'
import Info from './Card.Footer.Info'
import CardFooterTags from '@components/Card/Card.Footer.Tags'

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
    <Box sx={{ variant: rv(props.variant, 'footer') }}>
      <Flex sx={styles.wrapper}>
        <CardFooterTags {...props} />
        <Flex sx={styles.postInfo}>
          {/*<AuthorName {...props} />*/}
          <Info {...props} />
        </Flex>
      </Flex>
    </Box>
  )
export default CardFooter
