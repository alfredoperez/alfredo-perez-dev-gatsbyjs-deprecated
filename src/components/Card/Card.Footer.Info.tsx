import React from 'react'
import { Text } from 'theme-ui'
import { FaRegClock } from 'react-icons/fa'
import TextList from '../TextList'
import { buildResponsiveVariant as rv } from '../../utils/buildResponsiveVariant'

const CardFooterInfo = ({ variant, updated, timeToRead }) => (
  <TextList nowrap>
    {updated && <Text sx={{ variant: rv(variant, `date`) }}>Updated: {updated}</Text>}
    {timeToRead && (
      <Text sx={{ variant: rv(variant, `timeToRead`) }}>
        <FaRegClock css={{ verticalAlign: `middle` }} /> {timeToRead} min
      </Text>
    )}
  </TextList>
)

export default CardFooterInfo
