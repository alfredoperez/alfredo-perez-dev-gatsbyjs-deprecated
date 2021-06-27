/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import { Note } from '@models/note'
import SEO from '@components/SEO'
import CardList from '../components/CardList'

type DigitalGardenProps = {
  data: { allNote: { nodes: Array<Note> } }
  [key: string]: unknown
}

const DigitalGardenPage = (props: DigitalGardenProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!props.data) {
    return null
  }

  const notes = props.data.allNote.nodes

  return (
    <React.Fragment>
      <SEO title="Digital Garden" />
      <CardList
        variant={[`horizontal`]}
        title="Digital Garden"
        nodes={notes}
        columns={[1, 2]}
        omitMedia
      />
    </React.Fragment>
  )
}

export default DigitalGardenPage
