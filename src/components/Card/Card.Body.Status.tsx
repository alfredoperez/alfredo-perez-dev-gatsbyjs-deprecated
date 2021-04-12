import React from 'react'
import { Link } from 'gatsby'
import { Badge, Box } from 'theme-ui'
import { buildResponsiveVariant as rv } from '@utils/buildResponsiveVariant'
import { getReadableColor } from '@utils/getReadableColor'
import Status from '@components/status'
import { Flex } from '@theme-ui/components'

const styles = {
  badge: {
    mb: 3,
  },
}

const CardBodyStatus = ({ variant, status, omitStatus }) =>
  !omitStatus && status ? (
    <Box sx={{ variant: rv(variant, 'category') }}>
      <Box sx={styles.badge}>
        <Status status={status} />
      </Box>
    </Box>
  ) : null

export default CardBodyStatus
