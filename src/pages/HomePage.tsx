/** @jsx jsx */
import React from 'react'
import { Flex, jsx } from 'theme-ui'
import { useSiteMetadata } from '../hooks'
import NewsletterCompact from '../components_deprecated/NewsletterForm/NewsletterCompact'
import { visuallyHidden } from '../utils'
import CardList from '../components_deprecated/CardList'
import { Note } from '../models'
import Seo from '../components_deprecated/SEO'
import { Main, Stack } from '../components_deprecated/Layout'
import Divider from '../components_deprecated/Divider'

type HomePageProps = {
  data: {
    allNote: { nodes: Array<Note> }
    allMoc: { nodes: Array<Note> }
  }
  [key: string]: unknown
}

const HomePage = ({ data }: HomePageProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
      <Seo />
      <h1 sx={visuallyHidden}>{siteTitle}</h1>
      <Stack>
        <Main>
          <CardList
            variant="horizontal"
            title="Latest Notes"
            nodes={notes}
            columns={[1, 2]}
            omitMedia
          />
          <Divider space={3} />
          <CardList
            variant={[`horizontal`]}
            title="Maps of Content"
            nodes={mocs}
            columns={[3]}
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
