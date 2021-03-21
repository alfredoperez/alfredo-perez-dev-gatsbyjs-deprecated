import React, { useCallback, useEffect, useState } from 'react'
import { connectSearchBox, PoweredBy } from 'react-instantsearch-dom'
import { Box, IconButton, Input } from 'theme-ui'
import { FaSearch } from 'react-icons/fa'
import styles from './Search.styles'
import useDebounce from '@hooks/useDebounce'

type SearchBoxProps = { refine: any; delay; focus; handleFocus; handleClose }
const SearchBox = ({ refine, delay, focus, handleFocus, handleClose, ...rest }: SearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const searchCharacters = useCallback(
    (newSearchTerm) => {
      refine(newSearchTerm)
    },
    [refine],
  )

  // Effect for API call
  useEffect(() => {
    if (debouncedSearchTerm) {
      searchCharacters(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm, searchCharacters])

  const handleEsc = (e) => {
    //close on esc keypress
    if (e.keyCode === 27) {
      e.currentTarget.blur()
      handleClose()
    }
  }

  return (
    <React.Fragment>
      <IconButton sx={styles.mobileTrigger} onClick={handleFocus} aria-label="Search">
        <FaSearch />
      </IconButton>
      <Box
        sx={styles.form({
          focus,
        })}
      >
        <FaSearch style={styles.searchIcon} />
        <Input
          sx={styles.input}
          type="text"
          placeholder="Discover notes, guides, etc..."
          aria-label="Search"
          onFocus={handleFocus}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleEsc}
          {...rest}
        />
        {focus && (
          <Box sx={styles.poweredBy}>
            <PoweredBy />
          </Box>
        )}
      </Box>
    </React.Fragment>
  )
}

export default connectSearchBox(SearchBox)
