/** @jsx jsx */
import { jsx } from 'theme-ui'
import NoteListItem from './note-list-item'
import { NoteEntity } from '../models/note.entity'
import MocListItem from './moc-list-item'

type ListingProps = {
  notes?: Array<NoteEntity>
  mocs?: Array<NoteEntity>
  className?: string
  showTags?: boolean
}

const Listing = ({ notes, mocs, className = ``, showTags = true }: ListingProps) => (
  <section sx={{ mb: [5, 6, 7] }} className={className}>
    {notes?.map((note) => (
      <NoteListItem key={note.slug} note={note} showTags={showTags} />
    ))}
    {mocs?.map((moc) => (
      <MocListItem key={moc.slug} moc={moc} />
    ))}
  </section>
)

export default Listing
