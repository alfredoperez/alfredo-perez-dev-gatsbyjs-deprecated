import React from 'react'
import { Container, Flex } from 'theme-ui'
import { Property } from 'csstype'
import { Fade } from 'react-awesome-reveal'
import Section from '../../Section'

interface StackProps {
  direction?: Property.FlexDirection
}

export const Stack: React.FunctionComponent<StackProps> = ({ children, direction, ...props }) => (
  <Fade direction="up" triggerOnce>
    <Container>
      <Section {...props}>
        <Flex sx={{ flexDirection: direction }}>{children}</Flex>
      </Section>
    </Container>
  </Fade>
)
