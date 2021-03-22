/** @jsx jsx */
/* @ts-expect-error-line */
import React from 'react'
import { jsx, Link as TLink } from 'theme-ui'
import { Box } from '@theme-ui/components'
import { Link } from 'gatsby'
import { NoteModel } from '../models/note.model'

type MocItemProps = {
  moc: NoteModel
}

const MocListItem = ({ moc }: MocItemProps) => {
  const noteLink = `/mocs${moc.slug.toLocaleLowerCase()}`
  return (
    <Box mb={4}>
      <TLink as={Link} to={noteLink} sx={{ fontSize: [1, 2, 3], color: `text` }}>
        {moc.title}
      </TLink>
      <p
        sx={{
          color: `secondary`,
          mt: 1,
          a: { color: `secondary` },
          fontSize: [1, 1, 2],
        }}
      >
        <time>{moc.date}</time>
      </p>
    </Box>
  )
}

export default MocListItem
