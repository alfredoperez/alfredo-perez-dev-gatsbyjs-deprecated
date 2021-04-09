/** @jsx jsx */
import React from 'react'
import { jsx, Link as TLink } from 'theme-ui'
import { Card, Flex } from '@theme-ui/components'
import { Link } from 'gatsby'
import TagsList from './tags-list'
import { Note } from '@models/note'
import Status from './status'

type NoteItemProps = {
  note: Note
  showTags?: boolean
}

const NoteListItem = ({ note, showTags = true }: NoteItemProps) => {
  const noteLink = `/notes${note.slug.toLocaleLowerCase()}`
  return (
    <Card sx={{ marginBottom: `1rem` }}>
      <TLink as={Link} to={noteLink} sx={{ fontSize: [1, 2, 3], color: `text` }}>
        {note.title}
      </TLink>

      <p
        sx={{
          color: `secondary`,
          mt: 0.5,
          a: { color: `secondary` },
          fontSize: [1, 1, 1],
        }}
      />

      <p>{note.excerpt}</p>

      <Flex sx={{ alignItems: `center`, justifyContent: `space-between` }}>
        {note.tags && showTags && <TagsList tags={note.tags} />}
        <Flex>
          <Status status={note.status} />
          <time sx={{ marginLeft: `1rem` }}> Last Updated: {note.updated}</time>
        </Flex>
      </Flex>
    </Card>
  )
}

export default NoteListItem
