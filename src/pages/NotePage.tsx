/** @jsx jsx */
import { Flex, Heading, jsx } from 'theme-ui'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import React from 'react'
import TagsList from '@components/tags-list'
import SEO from '@components/seo'
import { NoteModel } from '@models/note.model'
import Comments from '@components/Comments/Comments'

const px = [`32px`, `16px`, `8px`, `4px`]
const shadow = px.map((v) => `rgba(0, 0, 0, 0.15) 0px ${v} ${v} 0px`)

type NoteProps = {
  data: {
    note: NoteModel
  }
}
const NotePage = (props: NoteProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!props.data) {
    return null
  }
  const {
    data: { note },
  } = props

  return (
    <React.Fragment>
      <SEO
        title={note.title}
        description={note.description ? note.description : note.excerpt}
        image={note.banner ? note.banner.childImageSharp.resize.src : undefined}
        pathname={note.slug}
        canonicalUrl={note.canonicalUrl}
      />
      <Heading as="h1" variant="styles.h1">
        {note.title}
      </Heading>
      <Flex
        sx={{
          color: `secondary`,
          mt: 3,
          a: { color: `secondary` },
          fontSize: [1, 1, 2],
        }}
      >
        {note.tags && note.tags.length > 0 && <TagsList tags={note.tags} />}
        <time>{note.created}</time>
        {note.timeToRead && `—`}
        {note.timeToRead && <span>{note.timeToRead} min read</span>}
      </Flex>
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
      <section>
        <Comments />
      </section>
    </React.Fragment>
  )
}

export default NotePage
