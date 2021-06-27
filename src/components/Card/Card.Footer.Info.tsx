import React from 'react'
import { Text } from 'theme-ui'
import TextList from '@components/TextList'
import { FaRegClock } from 'react-icons/fa'
import { buildResponsiveVariant as rv } from '@utils/buildResponsiveVariant'

const CardFooterInfo = ({ variant, updated, timeToRead }) => (
  <>
    <TextList nowrap>
      {updated && <Text sx={{ variant: rv(variant, `date`) }}>Updated: {updated}</Text>}
      {timeToRead && (
        <Text sx={{ variant: rv(variant, `timeToRead`) }}>
          <FaRegClock css={{ verticalAlign: `middle` }} /> {timeToRead} min
        </Text>
      )}
    </TextList>
  </>
)

export default CardFooterInfo
