import { Heading, Link as TLink } from 'theme-ui'
import React from 'react'
import { Box, Flex } from '@theme-ui/components'
import kebabCase from 'lodash.kebabcase'
import { Link } from 'gatsby'
import { useBlogConfig } from '../hooks'
import { replaceSlashes } from '../utils'
import Seo from '../components/SEO'

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

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!data) {
    return null
  }
  const { group: tags } = data.allNote

  return (
    <React.Fragment>
      <Seo title="Tags" />
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
