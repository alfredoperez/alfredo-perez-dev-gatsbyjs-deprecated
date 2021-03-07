/** @jsx jsx */
import React from 'react'
import { jsx } from 'theme-ui'
import { Link } from 'gatsby'
import Title from './title'
import Listing from './listing'
import useBlogConfig from '../hooks/use-blog-config'
import useSiteMetadata from '../hooks/use-site-metadata'
import replaceSlashes from '../utils/replace-slashes'
import { visuallyHidden } from '../styles/utils'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Hero from '../texts/hero'
import { NoteEntity } from '../models/note.entity'

type HomePageProps = {
  data: {
    allNote: { nodes: Array<NoteEntity> }
    allMoc: { nodes: Array<NoteEntity> }
  }
  [key: string]: unknown
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
    <>
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
    </>
  )
}

export default Homepage
