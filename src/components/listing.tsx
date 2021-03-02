/** @jsx jsx */
import { jsx } from 'theme-ui'
import NoteListItem from './note-list-item'
import { NoteEntity } from '../models/note.entity'

type ListingProps = {
  notes: Array<NoteEntity>
  className?: string
  showTags?: boolean
}

const Listing = ({ notes, className = ``, showTags = true }: ListingProps) => (
  <section sx={{ mb: [5, 6, 7] }} className={className}>
    {notes.map((note) => (
      <NoteListItem key={note.slug} note={note} showTags={showTags} />
    ))}
  </section>
)

export default Listing
