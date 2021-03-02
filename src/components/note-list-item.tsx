/** @jsx jsx */
import React from 'react'
import { jsx, Link as TLink } from 'theme-ui'
import { Box } from '@theme-ui/components'
import { Link } from 'gatsby'
import ItemTags from './item-tags'
import { NoteEntity } from '../models/note.entity'

type NoteItemProps = {
  note: NoteEntity
  showTags?: boolean
}

const NoteListItem = ({ note, showTags = true }: NoteItemProps) => {
  const noteLink = `/notes${note.slug.toLocaleLowerCase()}`
  return (
    <Box mb={4}>
      <TLink
        as={Link}
        to={noteLink}
        sx={{ fontSize: [1, 2, 3], color: `text` }}
      >
        {note.title}
      </TLink>
      <p
        sx={{
          color: `secondary`,
          mt: 1,
          a: { color: `secondary` },
          fontSize: [1, 1, 2],
        }}
      >
        <time>{note.date}</time>
        {note.tags && showTags && (
          <React.Fragment>
            {` — `}
            <ItemTags tags={note.tags} />
          </React.Fragment>
        )}
      </p>
    </Box>
  )
}

export default NoteListItem
