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
