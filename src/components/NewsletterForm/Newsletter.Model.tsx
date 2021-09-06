export type NewsletterProps = {
  handleSubmit: (event: any) => Promise<void>
  canSubmit?: boolean
  submitting?: boolean
  message?: string
  success?: boolean
}
