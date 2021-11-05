import React from 'react'
import { Box } from 'theme-ui'
import { buildResponsiveVariant as rv } from '../../utils/buildResponsiveVariant'
import Status from '../Status'

const styles = {
  badge: {
    mb: 3,
  },
}

const CardBodyStatus = ({ variant, status, omitStatus }: any) =>
  !omitStatus && status ? (
    <Box sx={{ variant: rv(variant, `category`) }}>
      <Box sx={styles.badge}>
        <Status status={status} />
      </Box>
    </Box>
  ) : null

export default CardBodyStatus
