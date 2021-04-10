import React from 'react'
import styled from 'styled-components'

type StatusProps = {
  status: string
}

const styles = {
  emoji: {
    margin: 0,
  },
}

const Status = ({ status }: StatusProps) => {
  switch (status) {
    case 'evergreen':
      return (
        <span role="img" aria-label="Evergreen note" sx={styles.emoji}>
          🌳
        </span>
      )
    case 'seed':
      return (
        <span role="img" aria-label="Seed Note" sx={styles.emoji}>
          🌱
        </span>
      )
    case 'bud':
      return (
        <span role="img" aria-label="Bud Note" sx={styles.emoji}>
          🌿
        </span>
      )
    case 'snag':
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
