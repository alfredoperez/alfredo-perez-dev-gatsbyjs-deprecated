import React, { useState } from 'react'
import { NewsletterServiceInterface } from '@components/NewsletterForm'

const FORM_ID = `2581331` // process.env.CONVERTKIT_SIGNUP_FORM

interface ConvertKitResponseType {
  result: `success` | `error`
  msg: string
}

function getSubscriberTags(pageTags: Array<string>): Array<number> {
  const convertKitTags: { [id: string]: number } = {
    angular: 2613579,
    ngrx: 2613578,
  }
  const subscriberTags: Array<number> = []
  pageTags.forEach((tag): void => {
    if (convertKitTags[tag]) {
      subscriberTags.push(convertKitTags[tag])
    }
  })
  return subscriberTags
}

const userConvertKit = () => {
  const [response, setResponse] = React.useState<ConvertKitResponseType | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const handleSubmit = async (e: any, tags: Array<string>) => {
    e.preventDefault()
    setSubmitting(true)
    const data = new FormData(e.target)
    const email = data.get(`email`)
    const name = data.get(`first_name`)

    const subscriberTags = getSubscriberTags(tags)
    try {
      const apiResponse = await fetch(`https://app.convertkit.com/forms/${FORM_ID}/subscriptions`, {
        method: `post`,
        body: JSON.stringify(
          { email_address: email, first_name: name, tags: subscriberTags },
          null,
          2,
        ),
        headers: {
          Accept: `application/json`,
          'Content-Type': `application/json`,
        },
      })
      const responseJson = await apiResponse.json()
      if (responseJson.status === `failed`) {
        setSubmitting(false)
        setResponse({ result: `error`, msg: `There was an error submitting your email` })
      } else {
        setSubmitting(false)
        setResponse({ result: `success`, msg: `You are in 😎 Thanks!` })
      }
    } catch (error) {
      setSubmitting(false)
      setResponse({ result: `error`, msg: `There was an error submitting your email` })
    }
    setResponse(response)
    setSubmitting(false)
  }

  const success = response && response.result === `success`
  const error = response && response.result !== `success`
  const canSubmit = !response || error
  const message = response && response.msg

  return ({
    handleSubmit,
    canSubmit,
    submitting,
    message,
    success,
    error,
  } as unknown) as NewsletterServiceInterface
}

export default userConvertKit
