import React from 'react'
import { Badge, Box, Flex } from 'theme-ui'
import { Link } from 'gatsby'
import defaultOptions from '../../config/default-Options'

import { replaceSlashes } from '../../utils'
import { Tag } from '../../models'

type TagsProps = {
  tags: Array<Tag>
}

const TagsList = ({ tags }: TagsProps) => {
  const { tagsUrlPrefix, basePath } = defaultOptions.websiteData

  return (
    <Flex sx={{ flexDirection: `row`, marginRight: `2rem` }}>
      {tags.map((tag) => (
        <Box key={tag.slug} sx={{ marginRight: `0.5rem` }}>
          <Badge
            variant="tag"
            as={Link}
            to={replaceSlashes(`/${basePath}/${tagsUrlPrefix}/${tag.slug}`)}
          >
            {tag.name}
          </Badge>
        </Box>
      ))}
    </Flex>
  )
}

export default TagsList
