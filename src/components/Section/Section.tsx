import React, { PropsWithChildren } from 'react'
import { Container } from 'theme-ui'
import SectionTitle from './Section.Title'

const SECTION_VARIANT = 'section'
const SIDE_SECTION_VARIANT = 'section-aside'

interface SectionProps extends PropsWithChildren<any> {
  aside?: boolean
  title?: string
  titleLink?: string
  omitTitle?: boolean
}

const Section = ({ aside, children, ...props }: SectionProps) => {
  const sectionVariant = aside ? SIDE_SECTION_VARIANT : SECTION_VARIANT

  return (
    <Container variant={sectionVariant}>
      <SectionTitle variant={sectionVariant} {...props} />
      {children}
    </Container>
  )
}

export default Section
