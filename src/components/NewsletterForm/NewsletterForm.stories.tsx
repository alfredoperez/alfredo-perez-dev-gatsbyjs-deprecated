import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import NewsletterCompact from './NewsletterCompact'

export default {
  title: `Components/Newsletter Compact`,
  component: NewsletterCompact,
} as ComponentMeta<typeof NewsletterCompact>

const Template: ComponentStory<typeof NewsletterCompact> = (args) => <NewsletterCompact {...args} />

export const Default = Template.bind({})
