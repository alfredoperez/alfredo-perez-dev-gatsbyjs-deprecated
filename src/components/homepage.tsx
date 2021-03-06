/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Link } from 'gatsby'
import Layout from './layout'
import Title from './title'
import Listing from './listing'
import useBlogConfig from '../hooks/use-blog-config'
import useSiteMetadata from '../hooks/use-site-metadata'
import replaceSlashes from '../utils/replace-slashes'
import { visuallyHidden } from '../styles/utils'
// @ts-ignore
import Hero from '../texts/hero'
// @ts-ignore
import { NoteEntity } from '../models/note.entity'

type HomePageProps = {
  data: {
    allNote: { nodes: Array<NoteEntity> }
    allMoc: { nodes: Array<NoteEntity> }
  }
  [key: string]: any
}

const Homepage = ({
  data: {
    allNote: { nodes: notes },
    allMoc: { nodes: mocs },
  },
}: HomePageProps) => {
  const { basePath, digitalGardenPath } = useBlogConfig()
  const { siteTitle } = useSiteMetadata()

  return (
    <Layout>
      <h1 sx={visuallyHidden}>{siteTitle}</h1>
      <section
        sx={{
          mb: [5, 6, 7],
          p: { fontSize: [1, 2, 3], mt: 2 },
          variant: `section_hero`,
        }}
      >
        <Hero />
      </section>
      <Title text="Latest Notes">
        <Link to={replaceSlashes(`/${basePath}/${digitalGardenPath}`)}>View All Notes</Link>
      </Title>
      <Listing notes={notes} showTags={false} />
      <Title text="Maps of content">
        {/* <Link to={replaceSlashes(`/${basePath}/${digitalGardenPath}`)}> */}
        {/*  View All Notes */}
        {/* </Link> */}
      </Title>
      <Listing mocs={mocs} showTags={false} />

      {/* <List sx={{ variant: `section_bottom` }}> */}
      {/*  <Bottom /> */}
      {/* </List> */}
    </Layout>
  )
}

export default Homepage
