import React from 'react'
import { Card, Text } from 'theme-ui'
import Section from '@components/Section'
import NewsletterForm from '@components/NewsletterForm/NewsletterForm'
import { NewsletterBaseProps } from './Newsletter.Model'

const NewsletterCompact: React.FC<NewsletterBaseProps> = (props) => {
  const { tags } = props

  return (
    <Section aside title="Newsletter" {...props}>
      <Card variant="paper">
        <Text variant="p">
          Make sure to subscribe to the newsletter and be the first to know the news.
        </Text>
        <NewsletterForm tags={tags} />
      </Card>
    </Section>
  )
}

export default NewsletterCompact
