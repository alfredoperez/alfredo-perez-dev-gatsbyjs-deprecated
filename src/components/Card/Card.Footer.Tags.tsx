import React from 'react'
import { Flex } from '@theme-ui/components'
import TagsList from '@components/TagsList'

const CardFooterTags = ({ variant, tags, omitTags }) => (
  <React.Fragment>
    <Flex>{tags && !omitTags && <TagsList tags={tags} />}</Flex>
  </React.Fragment>
)

export default CardFooterTags
