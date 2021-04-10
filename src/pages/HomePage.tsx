/** @jsx jsx */
import React from 'react'
import { jsx } from 'theme-ui'
import { Link } from 'gatsby'
import Title from '@components/title'
import Listing from '@components/listing'
import useBlogConfig from '@hooks/use-blog-config'
import useSiteMetadata from '@hooks/use-site-metadata'
import replaceSlashes from '@utils/replace-slashes'
import { visuallyHidden } from '@utils/vissually-hidden'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { Note } from '@models/note'
import CardList from '@components/CardList'
import Divider from '@components/Divider'
import SEO from '@components/SEO'
import pageContextProvider from '../components/pageContextProvider'

type HomePageProps = {
  data: {
    allNote: { nodes: Array<Note> }
    allMoc: { nodes: Array<Note> }
  }
  [key: string]: unknown
}

const HomePage = (props: HomePageProps) => {
  const { basePath, digitalGardenPath } = useBlogConfig()
  const { siteTitle } = useSiteMetadata()

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!props.data) {
    return null
  }

  const {
    data: {
      allNote: { nodes: notes },
      allMoc: { nodes: mocs },
    },
  } = props
  return (
    <React.Fragment>
      <SEO />
      <h1 sx={visuallyHidden}>{siteTitle}</h1>
      {/*<section*/}
      {/*  sx={{*/}
      {/*    mb: [3, 4, 6],*/}
      {/*    p: { fontSize: [1, 2, 3], mt: 2 },*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <HeroContent />*/}
      {/*</section>*/}
      {/*<Title text="Latest Notes">*/}
      {/*  <Link to={replaceSlashes(`/${basePath}/${digitalGardenPath}`)}>View All</Link>*/}
      {/*</Title>*/}
      {/*<Divider />*/}
      <CardList variant={['horizontal']} title="Latest Notes" nodes={notes} columns={[1, 2]} omitMedia />
      {/*<Title text="Maps of content" />*/}
      {/*<Listing mocs={mocs} showTags={false} />*/}
    </React.Fragment>
  )
}

export default HomePage
