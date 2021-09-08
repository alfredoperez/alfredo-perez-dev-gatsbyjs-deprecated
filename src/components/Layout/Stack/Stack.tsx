import React, { useContext } from 'react'
import { Container, Flex } from 'theme-ui'
import Section from '@components/Section'
import { Property } from 'csstype'
import { Fade } from 'react-awesome-reveal'

interface StackProps {
  direction?: Property.FlexDirection
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction,

  ...props
}) => (
  // const context = useContext(pageContextProvider) as PageContext

  <Fade direction="up" triggerOnce>
    <Container>
      <Section {...props}>
        <Flex sx={{ flexDirection: direction }}>{children}</Flex>
      </Section>
    </Container>
  </Fade>
)
