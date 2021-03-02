/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Link } from 'gatsby'
import Layout from './layout'
import Title from './title'
import Listing from './listing'
import List from './list'
import useBlogConfig from '../hooks/use-blog-config'
import useSiteMetadata from '../hooks/use-site-metadata'
import replaceSlashes from '../utils/replace-slashes'
import { visuallyHidden } from '../styles/utils'
// @ts-ignore
import Hero from '../texts/hero'
// @ts-ignore
import Bottom from '../texts/bottom'
import { NoteEntity } from '../models/note.entity'

type HomePageProps = {
  data: { allNote: { nodes: Array<NoteEntity> } }
  [key: string]: any
}

const Homepage = ({
  data: {
    allNote: { nodes: notes },
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
      <Title text="Digital Garden">
        <Link to={replaceSlashes(`/${basePath}/${digitalGardenPath}`)}>
          View All Notes
        </Link>
      </Title>
      <Listing notes={notes} showTags={false} />
      {/*<List sx={{ variant: `section_bottom` }}>*/}
      {/*  <Bottom />*/}
      {/*</List>*/}
    </Layout>
  )
}

export default Homepage
