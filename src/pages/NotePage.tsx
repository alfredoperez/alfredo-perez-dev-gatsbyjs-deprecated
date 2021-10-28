/** @jsx jsx */
import { Card as CardComponent, Flex, jsx } from 'theme-ui'
import React from 'react'
import { Note } from '@models/note'
import SEO from '@components/SEO'
import Card from '@components/Card'
import { PostBody } from '@components/Post'
import Divider from '@components/Divider'
import { Main, Stack } from '@components/Layout'
import NewsletterCompact from '@components/NewsletterForm/NewsletterCompact'

type NoteProps = {
  data: {
    note: Note
    location: any
    tagCategoryPosts: any
    tagPosts: any
    categoryPosts: any
    previous: any
    next: any
  }
}
const NotePage: React.FunctionComponent<NoteProps> = ({ data }: NoteProps) => {
  if (!data) {
    return null
  }

  /* tagCategoryPosts, tagPosts, categoryPosts, previous, next */
  const { note } = data

  const relatedNotes = [
    ...(note.parent.inboundReferences.length > 0
      ? note.parent.inboundReferences.map((ref) => {
          const { title, slug, id } = ref.childMdxNote
          return { title, slug, id }
        })
      : []),
    ...(note.parent.outboundReferences.length > 0
      ? note.parent.outboundReferences.map((ref) => {
          const { title, slug, id } = ref.childMdxNote
          return { title, slug, id }
        })
      : []),
  ]
  console.log({ relatedNotes })

  return (
    <>
      <SEO
        title={note.title}
        description={note.description ? note.description : note.excerpt}
        image={note.banner ? note.banner.childImageSharp.resize.src : undefined}
        pathname={note.slug}
        canonicalUrl={note.canonicalUrl}
      />
      <Divider />
      <Stack>
        <Main>
          <Card {...note} variant="horizontal-hero" omitExcerpt omitMedia />
        </Main>
      </Stack>
      <Divider space={3} />
      <Stack direction="column">
        <CardComponent variant="paper-lg">
          {/* <PostImage {...note} inCard /> */}
          <PostBody {...note} />`
        </CardComponent>

        {/* {relatedNotes.length > 0 && ( */}
        {/*  <CardList */}
        {/*    title="Related Notes" */}
        {/*    nodes={relatedNotes} */}
        {/*    variant={[`horizontal-aside`]} */}
        {/*    columns={[1, 2]} */}
        {/*    limit={6} */}
        {/*    distinct */}
        {/*    omitMedia */}
        {/*    omitCategory */}
        {/*  /> */}
        {/* )} */}

        {/* <PostShare {...note} location="TEST" /> */}
        <Divider space={3} />
        <Flex sx={{ maxWidth: `400px`, width: `400px`, justifyItems: `center` }}>
          <NewsletterCompact />
        </Flex>
      </Stack>
      <Divider space={3} />

      {/* <Stack> */}
      {/*  <PostComments {...note} /> */}
      {/* </Stack> */}
    </>
  )
}

export default NotePage
