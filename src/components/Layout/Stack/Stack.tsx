import React, { useContext } from 'react'
import { Container, Flex } from 'theme-ui'
import pageContextProvider from '@components/pageContextProvider'
import Section from '@components/Section'
import { PageContext } from '@models/page-context.model'
import { Property } from 'csstype'
import { Fade } from 'react-awesome-reveal'

type StackProps = {
  direction: Property.FlexDirection
  effectProps: unknown
}

export const Stack: React.FunctionComponent<StackProps> = ({
  children,
  direction,
  effectProps = {},
  ...props
}) => (
  // const context = useContext(pageContextProvider) as PageContext

  <Fade direction="up" triggerOnce {...effectProps}>
    <Container>
      <Section {...props}>
        <Flex sx={{ flexDirection: direction }}>{children}</Flex>
      </Section>
    </Container>
  </Fade>
)
