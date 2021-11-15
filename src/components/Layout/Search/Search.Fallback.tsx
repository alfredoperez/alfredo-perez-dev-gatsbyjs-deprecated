import React from 'react'
import { Box, IconButton, Input, ThemeUICSSObject } from 'theme-ui'
import { FaSearch } from 'react-icons/fa'

const styles = {
  mobileTrigger: {
    display: [`block`, null, `none`],
  } as ThemeUICSSObject,
}
const SearchFallback = (
  <>
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
  </>
)

export default SearchFallback
