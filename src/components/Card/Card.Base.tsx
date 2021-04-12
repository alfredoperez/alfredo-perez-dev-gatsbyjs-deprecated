import React from 'react'
import { Box, Card, Flex } from 'theme-ui'
import Body from './Card.Body'
import Media from './Card.Media'
import Footer from './Card.Footer'
import { columnSizeMatcher } from '@utils/columnSizeMatcher'
import { buildResponsiveVariant as rv } from '@utils/buildResponsiveVariant'

const styles = {
  card: {
    overflow: `hidden`,
    height: `full`,
  },
  content: {
    alignItems: `stretch`,
    height: `full`,
  },
}

const CardBase = ({ columns, onMouseOver, ...props }) => (
  <Box className="blog_card" sx={columnSizeMatcher(columns)} onMouseOver={onMouseOver} onFocus={onMouseOver}>
    <Card
      variant="interactive"
      sx={{
        ...styles.card,
        variant: rv(props.variant, 'card'),
      }}
    >
      <Flex
        as="article"
        sx={{
          ...styles.content,
          variant: rv(props.variant, 'content'),
        }}
      >
        <Media {...props} />
        <Body {...props}>
          <Footer {...props} />
        </Body>
      </Flex>
    </Card>
  </Box>
)

export default CardBase
