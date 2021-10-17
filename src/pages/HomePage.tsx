/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import useSiteMetadata from '@hooks/use-site-metadata'
import { visuallyHidden } from '@utils/visuallyHidden'
import { Note } from '@models/note'
import CardList from '@components/CardList'
import SEO from '@components/SEO'
import { Main, Stack } from '@components/Layout'
import NewsletterCompact from '@components/NewsletterForm/NewsletterCompact'
import Divider from '@components/Divider'
import { Flex } from 'theme-ui'

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
            variant={[`horizontal`]}
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
