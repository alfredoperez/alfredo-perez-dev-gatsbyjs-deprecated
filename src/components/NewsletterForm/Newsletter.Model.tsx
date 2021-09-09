import { Tag } from '@models/note'

export enum LoadingState {
  INIT = `INIT`,
  REQUESTING = `REQUESTING`,
  REQUESTING_MORE = `REQUESTING_MORE`,
  PROCESSING = `PROCESSING`,
  RESOLVED = `RESOLVED`,
  FAILED = `FAILED`,
  REJECTED = `REJECTED`,
  STOPPING = `STOPPING`,
  STOPPED = `STOPPED`,
}

export interface ErrorState {
  errorMsg: string
}

export type RequestState = LoadingState | ErrorState

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
