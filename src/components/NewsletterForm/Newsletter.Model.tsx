export type NewsletterProps = {
  handleSubmit: () => Promise<void>
  canSubmit: boolean
  submitting: boolean
  message: string
  success: boolean
}
