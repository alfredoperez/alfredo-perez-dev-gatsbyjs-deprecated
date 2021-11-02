/** @jsx jsx * */
import React from 'react'
import { Box, Card, Flex, jsx } from 'theme-ui'
import { columnSizeMatcher, buildResponsiveVariant as rv } from '../../utils'
import Body from './Card.Body'
import Media from './Card.Media'
import Footer from './Card.Footer'

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

interface CardBaseProps {
  columns: Array<1 | 2 | 3 | 4 | 5>
  onMouseOver: React.MouseEventHandler<HTMLElement> | undefined
  variant: string
  id: string
}

const CardBase = ({ columns, onMouseOver, id, ...props }: CardBaseProps) => {
  const columnsSize = columnSizeMatcher(columns)
  const cardVariant = rv(props.variant, `card`)
  const contentVariant = rv(props.variant, `content`)
  return (
    <Box
      className="blog_card"
      sx={columnsSize}
      onMouseOver={onMouseOver}
      onFocus={onMouseOver as any}
    >
      <Card
        key={id}
        variant="interactive"
        sx={{
          ...styles.card,
          variant: cardVariant,
        }}
      >
        <Flex
          as="article"
          sx={{
            ...styles.content,
            variant: contentVariant,
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
}

export default CardBase
