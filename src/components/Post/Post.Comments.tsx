import React from 'react'
import { Box, Divider } from 'theme-ui'
import Comments from '@components/Comments/Comments'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PostComments = ({ title, id }) => (
  <Box>
    <Divider />
    <Comments />
  </Box>
)

export default PostComments
