import React from 'react'
import { Text } from 'theme-ui'
import { buildResponsiveVariant as rv } from '@utils/buildResponsiveVariant'
import { Flex } from '@theme-ui/components'
import Status from '@components/status'
import TagsList from '@components/tags-list'

const CardFooterTags = ({ variant, tags, omitTags }) => (
  <React.Fragment>
    <Flex>{tags && !omitTags && <TagsList tags={tags} />}</Flex>
  </React.Fragment>
)

export default CardFooterTags
