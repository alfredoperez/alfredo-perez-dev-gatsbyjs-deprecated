import React, { useState } from 'react'
import { Box, Button, ThemeUICSSObject } from 'theme-ui'
import { Configure, InstantSearch } from 'react-instantsearch-dom'
import algoliasearch from 'algoliasearch/lite'
import SearchBox from './Search.Box'
import Results from './Search.Results'

const indexName = process.env.GATSBY_ALGOLIA_INDEX_NAME || `Notes`
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
  } as ThemeUICSSObject,
  close: {
    position: `fixed`,

    zIndex: 99,
    right: [`50%`, 4],
    top: [`95%`, 4],
    transform: [`translate(50%, -50%)`, `none`],
    textAlign: `center`,
    color: `omega`,
    fontSize: 1,
  } as ThemeUICSSObject,
  esc: {
    display: [`none`, `block`],
  } as ThemeUICSSObject,
}
const Overlay = ({ onClick }) => (
  <>
    <Box sx={styles.overlay} onClick={onClick} />
    <Box sx={styles.close}>
      <Button onClick={onClick} variant="secondary">
        Close(ESC)
      </Button>
    </Box>
  </>
)

const Search = () => {
  const [focus, setFocus] = useState(false)

  const algoliaClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY,
  )

  const searchClient = {
    search(requests) {
      const shouldSearch = requests.some(({ params: { query } }) => query !== ``)
      if (focus && shouldSearch) {
        return algoliaClient.search(requests)
      }
      return Promise.resolve({
        results: [{ hits: [] }],
      })
    },
  }

  const handleClose = () => setFocus(false)
  const handleFocus = () => {
    if (!focus) {
      setFocus(true)
    }
  }

  return (
    <Box>
      <InstantSearch indexName={indexName} searchClient={searchClient}>
        <Configure distinct={searchDistinctLimit} />
        <SearchBox focus={focus} handleFocus={handleFocus} handleClose={handleClose} />
        {focus && <Results />}
      </InstantSearch>
      {focus && <Overlay onClick={handleClose} />}
    </Box>
  )
}

export default Search
