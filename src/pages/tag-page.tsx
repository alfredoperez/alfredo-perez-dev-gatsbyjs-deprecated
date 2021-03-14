/** @jsx jsx */
import React from 'react'
import { Heading, jsx, Link as TLink } from 'theme-ui'
import { Flex } from '@theme-ui/components'
import { Link } from 'gatsby'
import useBlogConfig from '../hooks/use-blog-config'
import Listing from '../components/listing'
import replaceSlashes from '../utils/replace-slashes'
import SEO from '../components/seo'
import { NoteEntity } from '../models/note.entity'

type TagProps = {
  data: {
    allNote: {
      nodes: Array<NoteEntity>
    }
  }
  pageContext: {
    isCreatedByStatefulCreatePages: boolean
    slug: string
    name: string
    [key: string]: unknown
  }
}

const TagPage = (props: TagProps) => {
  const {
    data: {
      allNote: { nodes: notes },
    },
    pageContext,
  } = props
  const { tagsPath, basePath } = useBlogConfig()

  return (
    <React.Fragment>
      <SEO title={`Tag: ${pageContext.name}`} />
      <Flex
        sx={{
          alignItems: `center`,
          justifyContent: `space-between`,
          flexFlow: `wrap`,
        }}
      >
        <Heading as="h1" variant="styles.h1" sx={{ marginY: 2 }}>
          {pageContext.name}
        </Heading>
        <TLink
          as={Link}
          sx={{ variant: `links.secondary`, marginY: 2 }}
          to={replaceSlashes(`/${basePath}/${tagsPath}`)}
        >
          View all tags
        </TLink>
      </Flex>
      <Listing notes={notes} sx={{ mt: [4, 5] }} />
    </React.Fragment>
  )
}

export default TagPage
