import React from 'react'
import { Link as GLink } from 'gatsby'
import { Link, Text } from 'theme-ui'
import TextList from '../TextList'
import PageTitle from '../PageTitle'

const styles = {
  item: {
    display: `inline-block`,
  },
}

type PostHeadProps = {
  title: string
  author: any
  date: string | Date
  timeToRead: number
  category: any
}

export const PostHead = ({ title, author, date, timeToRead, category }: PostHeadProps) => {
  const info = (
    <TextList>
      {author?.slug && (
        <Text sx={styles.item}>
          {`By `}
          <Link variant="mute" as={GLink} to={author.slug}>
            <strong>{author.name}</strong>
          </Link>
        </Text>
      )}
      {category?.slug && (
        <Text sx={styles.item}>
          {`Published in `}
          <Link variant="mute" as={GLink} to={category.slug}>
            <strong>{category.name}</strong>
          </Link>
        </Text>
      )}
      {date && <Text sx={styles.item}>{date}</Text>}
      {timeToRead && (
        <Text sx={{ ...styles.item, color: `error` }}>
          <strong>{timeToRead} min read</strong>
        </Text>
      )}
    </TextList>
  )

  return <PageTitle header={title} running={info} />
}
