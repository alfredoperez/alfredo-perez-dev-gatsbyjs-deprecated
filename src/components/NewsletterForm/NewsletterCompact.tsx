import React from 'react'
import { Card, Text } from 'theme-ui'
import Section from '@components/Section'
import NewsletterForm from '@components/NewsletterForm/NewsletterForm'
import useConvertKit from '@utils/useConvertKit'

const NewsletterCompact: React.FunctionComponent = (props) => {
  const { handleSubmit, canSubmit, submitting, message, success } = useConvertKit()

  return (
    <Section aside title="Newsletter" {...props}>
      <Card variant="paper">
        <Text variant="p">
          Make sure to subscribe to the newsletter and be the first to know the news.
        </Text>
        <NewsletterForm {...{ handleSubmit, canSubmit, submitting, message, success }} />
      </Card>
    </Section>
  )
}

export default NewsletterCompact
