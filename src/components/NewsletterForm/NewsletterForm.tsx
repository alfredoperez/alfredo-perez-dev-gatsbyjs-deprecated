import React, { useState } from 'react'
import { Box, Input, Button, Message, Spinner } from 'theme-ui'
import { NewsletterBaseProps, Subscriber } from '@components/NewsletterForm/Newsletter.Model'
import useConvertKit from '@utils/useConvertKit'

const styles = {
  msg: {
    mb: 0,
  },
  button: {
    display: `block`,
    mx: `auto`,
    marginTop: `12px`,
  },
}

const NewsletterForm: React.FC<NewsletterBaseProps> = ({ tags }) => {
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null)
  const { canSubmit, submitting, message, success } = useConvertKit(subscriber)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        const email = data.get(`email`)
        const name = data.get(`first_name`)
        const subscriberTags = tags?.map((tag) => tag.name)
        setSubscriber({ email, name, tags: subscriberTags } as Subscriber)
      }}
    >
      {message && !canSubmit && (
        <Message
          variant={success ? `success` : `error`}
          sx={styles.msg}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {canSubmit && (
        <>
          <Box variant="forms.row">
            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              aria-label="Add your email Address"
              required
            />
          </Box>
          <Box>
            <Input
              name="first_name"
              type="string"
              placeholder="First Name"
              aria-label="Add your first name"
              required
            />
          </Box>

          <Button
            type="submit"
            variant={success || submitting ? `disabled` : `primary`}
            disabled={success || submitting}
            sx={styles.button}
          >
            Subscribe {submitting && <Spinner size="20" />}
          </Button>
        </>
      )}
    </form>
  )
}

export default NewsletterForm
