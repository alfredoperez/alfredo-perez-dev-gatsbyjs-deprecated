/** @jsx jsx */
import React from 'react'
import { Flex, Box, Divider, jsx } from 'theme-ui'
import PostShare from '@components/Post/Post.Share'

const styles = {
  flex: {
    alignItems: [`flex-start`, `center`],
    justifyContent: `space-between`,
    flexDirection: [`column`, `row`],
    '& > div + div': {
      mt: [3, 0],
      flexBasis: `1/2`,
      justifyContent: `flex-end`,
    },
  },
}

export const PostTagsShare: React.FC = (props) => (
  <Box>
    <Divider />
    <Flex sx={styles.flex}>
      <PostShare {...props} />
    </Flex>
  </Box>
)
