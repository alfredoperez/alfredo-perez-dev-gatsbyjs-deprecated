/** @jsx jsx */
import { Heading, jsx, Link as TLink } from 'theme-ui'
import { Link } from 'gatsby'
import { Flex } from '@theme-ui/components'
import Layout from './layout'
import Listing from './listing'
import useBlogConfig from '../hooks/use-blog-config'
import replaceSlashes from '../utils/replace-slashes'
import SEO from './seo'
import { NoteEntity } from '../models/note.entity'

type DigitalGardenProps = {
  data: { allNote: { nodes: Array<NoteEntity> } }
  [key: string]: any
}

const DigitalGarden = (props: DigitalGardenProps) => {
  const notes = props.data.allNote.nodes
  const { tagsPath, basePath } = useBlogConfig()

  return (
    <Layout>
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
      {!!notes && <Listing notes={notes} sx={{ mt: [4, 5] }} />}
    </Layout>
  )
}

export default DigitalGarden
