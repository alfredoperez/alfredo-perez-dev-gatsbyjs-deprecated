import React from 'react'
import { Link } from 'gatsby'
import { Button } from 'theme-ui'
import PageTitle from '../components_deprecated/PageTitle'
import Seo from '../components_deprecated/SEO'
import { Main, Stack } from '../components_deprecated/Layout'
import Section from '../components_deprecated/Section'
import Divider from '../components_deprecated/Divider'

const Page404 = () => (
  <>
    <Seo title="Page Not Found" />
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
