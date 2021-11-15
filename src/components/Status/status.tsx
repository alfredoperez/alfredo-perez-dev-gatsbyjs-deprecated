import { ThemeUICSSObject } from 'theme-ui'
import React from 'react'

interface StatusProps {
  status: 'evergreen' | 'seed' | 'bud' | 'snag'
}

const Status = ({ status }: StatusProps) => {
  const styles = {
    emoji: {
      margin: 0,
    } as ThemeUICSSObject,
  }

  switch (status) {
    case `evergreen`:
      return (
        <span role="img" aria-label="Evergreen note" sx={styles.emoji}>
          🌳
        </span>
      )
    case `seed`:
      return (
        <span role="img" aria-label="Seed Note" sx={styles.emoji}>
          🌱
        </span>
      )
    case `bud`:
      return (
        <span role="img" aria-label="Bud Note" sx={styles.emoji}>
          🌿
        </span>
      )
    case `snag`:
      return (
        <span role="img" aria-label="Snag Note" sx={styles.emoji}>
          🍂
        </span>
      )
    default:
      return null
  }
}

export default Status
