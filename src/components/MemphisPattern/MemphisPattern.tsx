import React from 'react'
import { Box } from 'theme-ui'
// @ts-expect-error

import memphis from '../../../static/memphis.png'

const styles = {
  pattern: {
    size: `full`,
    backgroundImage: `url(${memphis})`,
    backgroundSize: `11rem`,
    position: `absolute`,
    opacity: 0.05,
    top: 0,
    left: 0,
  },
}

const MemphisPattern = ({ sx = {}, ...props }) => <Box sx={{ ...styles.pattern, ...sx }} {...props} />

export default MemphisPattern
