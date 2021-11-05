/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import { Note } from '../models'
import Seo from '../components/SEO'
import CardList from '../components/CardList'

type DigitalGardenProps = {
  data: { allNote: { nodes: Array<Note> } }
  [key: string]: unknown
}

const DigitalGardenPage = ({ data }: DigitalGardenProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!data) {
    return null
  }

  const notes = data.allNote.nodes

  return (
    <React.Fragment>
      <Seo title="Digital Garden" />
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
