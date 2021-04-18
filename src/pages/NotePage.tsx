/** @jsx jsx */
import React from 'react'
import { Note } from '@models/note'
import SEO from '@components/SEO'
import { Card as CardComponent } from 'theme-ui'
import Card from '@components/Card'
import { PostBody, PostImage, PostTagsShare } from '../components/Post'
import PostComments from '../components/Post/Post.Comments'
import Divider from '@components/Divider'
import { Main } from '@layout/Main'
import { Stack } from '../components/Layout'

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
const NotePage = (props: NoteProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!props.data) {
    return null
  }
  const {
    data: { note /*tagCategoryPosts, tagPosts, categoryPosts, previous, next */ },
  } = props

  // const relatedPosts = [
  //   ...(tagCategoryPosts ? tagCategoryPosts.nodes : []),
  //   ...(tagPosts ? tagPosts.nodes : []),
  //   ...(categoryPosts ? categoryPosts.nodes : []),
  // ]

  return (
    <React.Fragment>
      <SEO
        title={note.title}
        description={note.description ? note.description : note.excerpt}
        image={note.banner ? note.banner.childImageSharp.resize.src : undefined}
        pathname={note.slug}
        canonicalUrl={note.canonicalUrl}
      />
      <Divider />
      <Stack effectProps={{ effect: 'fadeInDown' }}>
        <Main>
          <Card {...note} variant="horizontal-hero" omitExcerpt omitMedia />
        </Main>
      </Stack>
      <Divider space={3} />
      <Stack effectProps={{ fraction: 0 }}>
        <Main>
          <CardComponent variant="paper-lg">
            {/*<PostImage {...note} inCard />*/}
            <PostBody {...note} />
            <PostTagsShare {...note} location={props.location} />
            <PostComments {...note} />
          </CardComponent>
          <Divider />
          {/*{post.category && (*/}
          {/*  <CardList*/}
          {/*    title="Related Posts"*/}
          {/*    nodes={relatedPosts}*/}
          {/*    variant={['horizontal-aside']}*/}
          {/*    columns={[1, 2, 2, 2]}*/}
          {/*    limit={6}*/}
          {/*    distinct*/}
          {/*    omitMedia*/}
          {/*    omitCategory*/}
          {/*  />*/}
          {/*)}*/}
        </Main>
      </Stack>
    </React.Fragment>
  )
}

export default NotePage
