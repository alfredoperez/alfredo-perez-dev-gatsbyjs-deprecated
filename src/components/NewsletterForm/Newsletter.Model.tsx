import { Tag } from '@models/note'

export interface NewsletterBaseProps {
  tags?: Array<Tag>
}

export interface Subscriber {
  name: string
  email: string
  tags: Array<string>
}

export interface ConvertKitHookResponse {
  handleSubmit: (event: any, tags?: Array<string>) => Promise<void>
  canSubmit: boolean
  submitting: boolean
  message: string
  success: boolean
}
