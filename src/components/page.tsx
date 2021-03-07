/** @jsx jsx */
import { Heading, jsx } from 'theme-ui'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import SEO from './seo'

type PageProps = {
  data: {
    page: {
      title: string
      slug: string
      excerpt: string
      body: string
    }
  }
  [key: string]: unknown
}

const Page = ({ data: { page } }: PageProps) => (
  <>
    <SEO title={page.title} description={page.excerpt} />
    <Heading as="h1" variant="styles.h1">
      {page.title}
    </Heading>
    <section sx={{ my: 5, variant: `layout.content` }}>
      <MDXRenderer>{page.body}</MDXRenderer>
    </section>
  </>
)

export default Page
