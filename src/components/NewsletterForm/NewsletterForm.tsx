import React from 'react'
import { Box, Input, Button, Message, Spinner } from 'theme-ui'
import { NewsletterBaseProps } from '@components/NewsletterForm/Newsletter.Model'
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
  const { handleSubmit, canSubmit, submitting, message, success } = useConvertKit()

  const handleSubmitForm = (event: any) => {
    handleSubmit(
      event,
      tags?.map((tag) => tag.name),
    )
  }

  return (
    <form onSubmit={handleSubmitForm.bind(this)}>
      {message && (
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
