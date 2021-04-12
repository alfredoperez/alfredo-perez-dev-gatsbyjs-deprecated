/** @jsx jsx */
import { jsx } from 'theme-ui'
import NoteListItem from './note-list-item'
import { Note } from '@models/note'
import MocListItem from './moc-list-item'

type ListingProps = {
  notes?: Array<Note>
  mocs?: Array<Note>
  className?: string
  showTags?: boolean
}

const Listing = ({ notes, mocs, className = ``, showTags = true }: ListingProps) => (
  <section sx={{ mb: [3, 4, 5] }} className={className}>
    {notes?.map((note) => (
      <NoteListItem key={note.slug} note={note} showTags={showTags} />
    ))}
    {mocs?.map((moc) => (
      <MocListItem key={moc.slug} moc={moc} />
    ))}
  </section>
)

export default Listing
