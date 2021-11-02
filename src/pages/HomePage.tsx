/** @jsx jsx */
import React from 'react'
import { Flex, jsx } from 'theme-ui'
import useSiteMetadata from '../hooks/use-site-metadata'
import NewsletterCompact from '../components/NewsletterForm/NewsletterCompact'
import { visuallyHidden } from '../utils'
import CardList from '../components/CardList'
import { Note } from '../models'
import SEO from '../components/SEO'
import { Main, Stack } from '../components/Layout'
import Divider from '../components/Divider'

type HomePageProps = {
  data: {
    allNote: { nodes: Array<Note> }
    allMoc: { nodes: Array<Note> }
  }
  [key: string]: unknown
}

const HomePage = ({ data }: HomePageProps) => {
  if (!data) {
    return null
  }
  const { siteTitle } = useSiteMetadata()

  const {
    allNote: { nodes: notes },
    allMoc: { nodes: mocs },
  } = data

  return (
    <>
      <SEO />
      <h1 sx={visuallyHidden}>{siteTitle}</h1>
      <Stack>
        <Main>
          <CardList
            variant="horizontal"
            title="Latest Notes"
            nodes={notes}
            columns={[2, 1]}
            omitMedia
          />
          <Divider space={3} />
          <CardList
            variant={[`horizontal`]}
            title="Maps of Content"
            nodes={mocs}
            columns={[4]}
            omitMedia
          />
        </Main>
      </Stack>
      <Divider space={3} />
      <Stack>
        <Flex sx={{ maxWidth: `400px`, width: `400px`, justifyItems: `center` }}>
          <NewsletterCompact />
        </Flex>
      </Stack>
    </>
  )
}

export default HomePage
