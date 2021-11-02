/** @jsx jsx */
import { jsx } from 'theme-ui'

const styles = {
  emoji: {
    margin: 0,
  },
}

interface StatusProps {
  status: string
}

const Status = ({ status }: StatusProps) => {
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
