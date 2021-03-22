import React from 'react'
import { Box } from 'theme-ui'

const styles = {
  wrapper: (separator: any) => ({
    '> *': {
      ':not(:last-child) + *:before': {
        content: `" ${separator} "`,
      },
    },
  }),
  nowrap: {
    overflow: `hidden`,
    textOverflow: `ellipsis`,
    whiteSpace: `nowrap`,
  },
}

type TextListProps = {
  separator: string
  nowrap: boolean
}

const TextList = ({ nowrap = false, separator = '・' }: TextListProps, children) => (
  <Box sx={{ ...(nowrap && styles.nowrap), ...styles.wrapper(separator) }}>{children}</Box>
)

export default TextList
