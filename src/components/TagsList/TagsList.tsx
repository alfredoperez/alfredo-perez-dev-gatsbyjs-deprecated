import React from 'react'
import { Badge, Box, Flex } from 'theme-ui'
import { Link } from 'gatsby'
import useBlogConfig from '../../hooks/use-blog-config'
import replaceSlashes from '../../utils/replaceSlashes'
import { Tag } from '../../models'

type TagsProps = {
  tags: Array<Tag>
}

const TagsList = ({ tags }: TagsProps) => {
  const { tagsPath, basePath } = useBlogConfig()

  return (
    <Flex sx={{ flexDirection: `row`, marginRight: `2rem` }}>
      {tags.map((tag) => (
        <Box key={tag.slug} sx={{ marginRight: `0.5rem` }}>
          <Badge
            variant="tag"
            as={Link}
            to={replaceSlashes(`/${basePath}/${tagsPath}/${tag.slug}`)}
          >
            {tag.name}
          </Badge>
        </Box>
      ))}
    </Flex>
  )
}

export default TagsList
