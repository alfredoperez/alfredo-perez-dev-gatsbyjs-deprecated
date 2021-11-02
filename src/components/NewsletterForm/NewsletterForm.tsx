import React from 'react'
import { Box, Input, Button, Message, Spinner } from 'theme-ui'
import { NewsletterProps } from './Newsletter.Model'

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

const NewsletterForm = ({
  handleSubmit,
  canSubmit,
  submitting,
  message,
  success,
}: NewsletterProps) => (
  <form onSubmit={handleSubmit}>
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

export default NewsletterForm
