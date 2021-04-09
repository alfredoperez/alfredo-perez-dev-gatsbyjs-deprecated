import React from 'react'
import { Badge, Box, Flex } from 'theme-ui'
import { Link } from 'gatsby'
import useBlogConfig from '../hooks/use-blog-config'
import replaceSlashes from '../utils/replace-slashes'
import { TagEntity } from '@models/note'
import { getReadableColor } from '@utils/getReadableColor'

type TagsProps = {
  tags: Array<TagEntity>
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
