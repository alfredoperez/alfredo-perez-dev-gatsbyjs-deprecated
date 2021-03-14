import React from 'react'
import { Heading } from 'theme-ui'
//import Divider from '@components/Divider'

/**
 * Shadow me to add your own content
 */

const styles = {
  heading: {
    background: `
      linear-gradient(
        45deg,
        #667eea 32.5%,
        #9f7aea 50.5%)
    `,

    color: `#9f7aea`,
    WebkitBackgroundClip: `text`,
    WebkitTextFillColor: `transparent`,
    fontWeight: `bold`,
    fontSize: `3rem`,
    marginBottom: `2rem`,
  },
  running: {
    color: `omegaDark`,
    fontWeight: `normal`,
    maxWidth: [`full`, `full`, `2/3`],
  },
}

const HeroContent = () => (
  <React.Fragment>
    <Heading variant="h1" sx={styles.heading}>
      Welcome to
      <br />
      my digital garden
    </Heading>

    <Heading variant="h3" sx={styles.running}>
      This is a place where you can find all the notes I capture and make
    </Heading>
  </React.Fragment>
)

export default HeroContent
