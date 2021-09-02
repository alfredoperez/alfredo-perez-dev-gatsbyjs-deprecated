/** @jsx jsx */
import { Heading, jsx, Link as TLink } from 'theme-ui'

import React from 'react'
import { Box, Flex } from '@theme-ui/components'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import kebabCase from 'lodash.kebabcase'
import { Link } from 'gatsby'
import useBlogConfig from '@hooks/use-blog-config'
import replaceSlashes from '@utils/replace-slashes'
import SEO from '@components/SEO'

jsx
type TagsProps = {
  data: {
    allNote: {
      group: {
        fieldValue: string
        totalCount: number
      }[]
    }
  }
}

const TagsPage = ({ data }: TagsProps) => {
  const { tagsPath, basePath } = useBlogConfig()

  if (!data) {
    return null
  }
  const { group: tags } = data.allNote

  return (
    <React.Fragment>
      <SEO title="Tags" />
      <Heading as="h1" variant="styles.h1">
        All Tags
      </Heading>
      <Box mt={[4, 5]}>
        {tags.map((listItem) => (
          <Flex key={listItem.fieldValue} mb={[1, 1, 2]} sx={{ alignItems: `center` }}>
            <TLink
              as={Link}
              sx={{ variant: `links.listItem`, mr: 2 }}
              to={replaceSlashes(`/${basePath}/${tagsPath}/${kebabCase(listItem.fieldValue)}`)}
            >
              {listItem.fieldValue} <span sx={{ color: `secondary` }}>({listItem.totalCount})</span>
            </TLink>
          </Flex>
        ))}
      </Box>
    </React.Fragment>
  )
}

export default TagsPage
