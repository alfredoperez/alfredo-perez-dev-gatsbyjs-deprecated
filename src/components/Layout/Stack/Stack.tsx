import React, { useContext } from 'react'
import { Container, Flex } from 'theme-ui'
import pageContextProvider from '@components/pageContextProvider'
import Section from '@components/Section'
import Reveal from '@components/Reveal'
import { PageContext } from '@models/page-context.model'

export const Stack = ({ children, direction, effectProps = {}, ...props }) => {
  const context = useContext(pageContextProvider) as PageContext

  const content = (
    <Container>
      <Section {...props}>
        <Flex sx={{ flexDirection: direction }}>{children}</Flex>
      </Section>
    </Container>
  )

  // Use Reveal animation only on route update
  return context.location && context.location.action === `PUSH` && effectProps.effect !== false ? (
    <Reveal {...effectProps}>{content}</Reveal>
  ) : (
    content
  )
}
