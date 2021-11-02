import React from 'react'
import { Box } from 'theme-ui'

interface DividerProps {
  space: number
  line: string
}

const Divider = ({ space, line }: DividerProps) => (
  <Box
    sx={{
      minWidth: `auto`,
      borderTopStyle: `solid`,
      borderTopColor: line ? `omegaLighter` : `transparent`,
      borderTopWidth: 2,
      height: 0,
      my: [space - 1, space],
    }}
  />
)

export default Divider
