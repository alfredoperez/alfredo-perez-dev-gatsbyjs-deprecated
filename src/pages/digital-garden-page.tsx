/** @jsx jsx */
import React from 'react'
import { Heading, jsx, Link as TLink } from 'theme-ui'
import { Link } from 'gatsby'
import { Flex } from '@theme-ui/components'
import Listing from '../components/listing'
import useBlogConfig from '../hooks/use-blog-config'
import replaceSlashes from '../utils/replace-slashes'
import SEO from '../components/seo'
import { NoteModel } from '../models/note.model'

type DigitalGardenProps = {
  data: { allNote: { nodes: Array<NoteModel> } }
  [key: string]: unknown
}

const DigitalGardenPage = (props: DigitalGardenProps) => {
  const { tagsPath, basePath } = useBlogConfig()

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!props.data) {
    return null
  }

  const notes = props.data.allNote.nodes
  return (
    <React.Fragment>
      <SEO title="Digital Garden" />
      <Flex
        sx={{
          alignItems: `center`,
          justifyContent: `space-between`,
          flexFlow: `wrap`,
        }}
      >
        <Heading as="h1" variant="styles.h1" sx={{ marginY: 2 }}>
          Digital Garden
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

export default DigitalGardenPage
