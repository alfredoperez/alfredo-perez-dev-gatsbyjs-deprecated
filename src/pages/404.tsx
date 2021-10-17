import React from 'react'
import { Link } from 'gatsby'
import { Button } from 'theme-ui'
import SEO from '@components/SEO'
import PageTitle from '@components/PageTitle'
import Section from '@components/Section'
import Divider from '@components/Divider'
import { Layout, Main, Stack } from '@components/Layout'

const Page404 = () => (
  <>
    <SEO title="Page Not Found" />
    <Divider space={3} />
    <Stack>
      <Main>
        <Section>
          <PageTitle
            header="Sorry, this page isn't available."
            subheader="You may have mistyped the address or the page may have moved."
          />
        </Section>
        <Section>
          <Button variant="primary" as={Link} to="/">
            Go to homepage
          </Button>
        </Section>
      </Main>
    </Stack>
  </>
)

export default Page404
