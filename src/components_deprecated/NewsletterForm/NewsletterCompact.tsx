import React from 'react'
import { Card, Text } from 'theme-ui'
import { useConvertKit } from '../../utils/'
import Section from '../Section'
import NewsletterForm from './NewsletterForm'

const NewsletterCompact = (props) => {
  const { handleSubmit, canSubmit, submitting, message, success } = useConvertKit()

  return (
    <Section aside title="Newsletter" {...props}>
      <Card variant="paper">
        <Text variant="p">Like what you see? Keep in touch and I'll send more your way.</Text>
        <NewsletterForm {...{ handleSubmit, canSubmit, submitting, message, success }} />
      </Card>
    </Section>
  )
}

export default NewsletterCompact
