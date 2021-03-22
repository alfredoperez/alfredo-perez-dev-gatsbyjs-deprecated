import React from 'react'
import { Box, IconButton, Input } from 'theme-ui'
import { FaSearch } from 'react-icons/fa'
import styles from './Search.styles'

const SearchFallback = (
  <React.Fragment>
    <IconButton sx={styles.mobileTrigger}>
      <FaSearch />
    </IconButton>
    <Box
      sx={{
        borderStyle: `solid`,
        borderWidth: `md`,
        borderColor: `headerBg`,
        borderRadius: `default`,
        display: [`none`, `none`, `block`],
      }}
    >
      <Input disabled />
    </Box>
  </React.Fragment>
)

export default SearchFallback
