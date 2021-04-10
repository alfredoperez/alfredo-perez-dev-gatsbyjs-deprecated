/** @jsx jsx */
import React, { useEffect, useState } from 'react'
import { Box, IconButton, jsx } from 'theme-ui'
import { Configure, InstantSearch } from 'react-instantsearch-dom'
import algoliasearch from 'algoliasearch/lite'
import { FaTimes } from 'react-icons/fa'
import SearchBox from './Search.Box'

import Results from './Search.Results'

const indexName = process.env.GATSBY_ALGOLIA_INDEX_NAME || 'Notes'
const searchDistinctLimit = 4

const styles = {
  overlay: {
    position: `fixed`,
    top: 0,
    left: 0,
    zIndex: 98,
    bg: `background`,
    opacity: 0.9,
    width: `full`,
    height: `full`,
  },
  close: {
    position: `fixed`,
    zIndex: 99,
    right: [`50%`, 4],
    top: [`95%`, 4],
    transform: [`translate(50%, -50%)`, `none`],
    textAlign: `center`,
    color: `omega`,
    fontSize: 1,
    // svg: {
    //   width: `24px`,
    //   height: `24px`,
    // },
  },
  esc: {
    display: [`none`, `block`],
  },
}
const Overlay = ({ onClick }) => (
  <>
    <Box sx={styles.overlay} onClick={onClick} />
    <Box sx={styles.close}>
      <IconButton onClick={onClick}>
        <FaTimes />
      </IconButton>
      <Box sx={styles.esc}>ESC</Box>
    </Box>
  </>
)

const Search = () => {
  const [focus, setFocus] = useState(false)

  const algoliaClient = algoliasearch(process.env.GATSBY_ALGOLIA_APP_ID, process.env.GATSBY_ALGOLIA_SEARCH_KEY)

  const searchClient = {
    search(requests) {
      const shouldSearch = requests.some(({ params: { query } }) => query !== '')
      if (focus && shouldSearch) {
        return algoliaClient.search(requests)
      }
      return Promise.resolve({
        results: [{ hits: [] }],
      })
    },
  }

  const handleClose = () => {
    return setFocus(false)
  }
  const handleFocus = () => {
    if (!focus) {
      setFocus(true)
    }
  }

  useEffect(() => {
    // focus && handleClose()
  }) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <InstantSearch indexName={indexName} searchClient={searchClient}>
        <Configure distinct={searchDistinctLimit} />
        <SearchBox focus={focus} handleFocus={handleFocus} handleClose={handleClose} />
        {focus && <Results />}
      </InstantSearch>
      {focus && (
        <React.Fragment>
          <Overlay onClick={handleClose} />
        </React.Fragment>
      )}
    </Box>
  )
}

export default Search
