import React, { useEffect } from 'react'
import {
  LoadingState,
  ConvertKitHookResponse,
  RequestState,
  Subscriber,
} from '@components/NewsletterForm'

const FORM_ID = `2581331` // process.env.CONVERTKIT_SIGNUP_FORM

function getSubscriberTags(pageTags: Array<string>): Array<number> {
  const convertKitTags: { [id: string]: number } = {
    angular: 2613579,
    ngrx: 2613578,
  }
  const subscriberTags: Array<number> = []
  pageTags?.forEach((tag): void => {
    if (convertKitTags[tag]) {
      subscriberTags.push(convertKitTags[tag])
    }
  })
  return subscriberTags
}

export function userConvertKit(subscriber: Subscriber | null): ConvertKitHookResponse {
  const [requestState, setRequestState] = React.useState<RequestState>(LoadingState.INIT)

  useEffect(() => {
    async function submitSubscriberForm() {
      setRequestState(LoadingState.REQUESTING)

      const subscriberTags = getSubscriberTags(subscriber.tags)
      try {
        const apiResponse = await fetch(
          `https://app.convertkit.com/forms/${FORM_ID}/subscriptions`,
          {
            method: `post`,
            body: JSON.stringify(
              {
                email_address: subscriber.email,
                first_name: subscriber.name,
                tags: subscriberTags,
              },
              null,
              2,
            ),
            headers: {
              Accept: `application/json`,
              'Content-Type': `application/json`,
            },
          },
        )
        const responseJson = await apiResponse.json()
        if (responseJson.status === `failed`) {
          setRequestState(LoadingState.FAILED)
        } else {
          setRequestState(LoadingState.RESOLVED)
        }
      } catch (error) {
        setRequestState(LoadingState.FAILED)
      }
    }

    if (subscriber) {
      submitSubscriberForm()
    }
  }, [subscriber])

  const success = requestState === LoadingState.RESOLVED
  const submitting = requestState === LoadingState.REQUESTING
  const error = requestState === LoadingState.FAILED
  const canSubmit = requestState === LoadingState.INIT
  const message = success ? `You are in 😎 Thanks!` : `There was an error submitting your email`

  return ({
    canSubmit,
    submitting,
    message,
    success,
    error,
  } as unknown) as ConvertKitHookResponse
}

export default userConvertKit
