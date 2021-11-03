/** @jsx jsx */
import { Heading, jsx } from 'theme-ui'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import React from 'react'
import { Note } from '../models'
import Seo from '../components/SEO'
import TagsList from '../components/TagsList'

type MocProps = {
  data: {
    note: Note
  }
}
const MocPage = (props: MocProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!props.data) {
    return null
  }
  const {
    data: { note },
  } = props

  const px = [`32px`, `16px`, `8px`, `4px`]
  const shadow = px.map((v) => `rgba(0, 0, 0, 0.15) 0px ${v} ${v} 0px`)

  return (
    <React.Fragment>
      <Seo
        title={note.title}
        description={note.description ? note.description : note.excerpt}
        image={note.banner ? note.banner.childImageSharp.resize.src : undefined}
        pathname={note.slug}
        canonicalUrl={note.canonicalUrl}
      />
      <Heading as="h1" variant="styles.h1">
        {note.title}
      </Heading>
      <p
        sx={{
          color: `secondary`,
          mt: 3,
          a: { color: `secondary` },
          fontSize: [1, 1, 2],
        }}
      >
        <time>{note.created}</time>
        {note.tags && (
          <React.Fragment>
            {` — `}
            <TagsList tags={note.tags} />
          </React.Fragment>
        )}
        {note.timeToRead && ` — `}
        {note.timeToRead && <span>{note.timeToRead} min read</span>}
      </p>
      <section
        sx={{
          my: 5,
          '.gatsby-resp-image-wrapper': {
            my: [4, 4, 5],
            boxShadow: shadow.join(`, `),
          },
          variant: `layout.content`,
        }}
      >
        <MDXRenderer>{note.body}</MDXRenderer>
      </section>
    </React.Fragment>
  )
}

export default MocPage
