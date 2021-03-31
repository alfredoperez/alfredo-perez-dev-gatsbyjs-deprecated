/** @jsx jsx */

import React from 'react'
import { Heading, jsx, Link as TLink } from 'theme-ui'
import { Box, Flex } from '@theme-ui/components'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import kebabCase from 'lodash.kebabcase'
import { Link } from 'gatsby'
import useBlogConfig from '@hooks/use-blog-config'
import SEO from '@components/seo'
import replaceSlashes from '@utils/replace-slashes'

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

const TagsPage = (props: TagsProps) => {
  const { tagsPath, basePath } = useBlogConfig()

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!props.data) {
    return null
  }
  const { group: tags } = props.data.allNote

  return (
    <>
      <SEO title="Tags" />
      <Heading as="h1" variant="styles.h1">
        Tags
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
    </>
  )
}

export default TagsPage
