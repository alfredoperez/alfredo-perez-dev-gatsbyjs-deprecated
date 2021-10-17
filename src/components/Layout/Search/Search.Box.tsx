/** @jsx jsx */
import React, { useCallback, useEffect, useState } from 'react'
import { connectSearchBox, PoweredBy } from 'react-instantsearch-dom'
import { Box, IconButton, Input, jsx } from 'theme-ui'
import { FaSearch } from 'react-icons/fa'
import useDebounce from '@hooks/useDebounce'

const styles = {
  mobileTrigger: {
    display: [`block`, null, `none`],
  },
  poweredBy: {
    position: [`fixed`, `static`],
    right: 0,
    top: `-100%`,
    transform: [`translateY(50%)`, `none`],
    textAlign: `right`,
    fontWeight: `medium`,
    fontSize: 1,
    width: 200,
    svg: {
      width: 60,
      height: 16,
      verticalAlign: `middle`,
    },
  },
  input: {
    ml: 1,
  },
  searchIcon: {
    flexShrink: 0,
    height: `20px`,
    width: `20px`,
  },
  searchIconFa: {
    height: `20px`,
    width: `20px`,
  },
  form: (focus: boolean) => ({
    display: [focus ? `flex` : `none`, focus ? `flex` : `none`, `flex`],
    alignItems: `center`,
    bg: `omegaLight`,
    borderRadius: `default`,
    position: focus ? `absolute` : `static`,
    top: 4,
    left: `50%`,
    transform: focus ? `translate(-50%, 0)` : `translate(0, 0)`,
    zIndex: 99,
    width: focus ? `80vw` : `auto`,
    maxWidth: focus ? `40em` : `none`,
    borderStyle: `solid`,
    borderColor: focus ? `omegaLight` : `headerBg`,
    borderWidth: `md`,
    px: 3,
  }),
}
type SearchBoxProps = { refine: any; delay: any; focus: any; handleFocus: any; handleClose: any }
const SearchBox = ({ refine, focus, handleFocus, handleClose, ...rest }: SearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState(``)
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
    // close on esc keypress
    if (e.keyCode === 27) {
      e.currentTarget.blur()
      handleClose()
    }
  }

  return (
    <React.Fragment>
      <IconButton sx={styles.mobileTrigger} onClick={handleFocus} aria-label="Search Button">
        <FaSearch sx={styles.searchIconFa} />
      </IconButton>
      <Box sx={styles.form(focus)}>
        <FaSearch style={styles.searchIcon} />
        <Input
          sx={styles.input}
          type="text"
          placeholder="Discover notes, guides, etc..."
          aria-label="Type what you want to search"
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
