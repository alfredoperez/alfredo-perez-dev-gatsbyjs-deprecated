import React, { useState } from 'react'

const FORM_ID = process.env.CONVERTKIT_SIGNUP_FORM

type ConvertKitResponseType = {
  result: `success` | `error`
  msg: string
}

export const useConvertKit = () => {
  const [response, setResponse] = React.useState<ConvertKitResponseType | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSubmitting(true)
    const data = new FormData(e.target)
    const email = data.get(`email`)
    const name = data.get(`first_name`)

    try {
      await fetch(`https://app.convertkit.com/forms/${FORM_ID}/subscriptions`, {
        method: `post`,
        body: JSON.stringify({ email_address: email, first_name: name }, null, 2),
        headers: {
          Accept: `application/json`,
          'Content-Type': `application/json`,
        },
      })
      // const responseJson = await apiResponse.json()
      setSubmitting(false)
      setResponse({
        result: `success`,
        msg: `A perfect time to check your email inbox.`,
      })
    } catch (error) {
      setSubmitting(false)
      setResponse({ result: `error`, msg: `There was a glitch in the matrix...` })
    }
    setResponse(response)
    setSubmitting(false)
  }

  const success = response?.result === `success`
  const error = response?.result !== `success`
  const canSubmit = !response || error
  const message = response?.msg

  return {
    handleSubmit,
    canSubmit,
    submitting,
    message,
    success,
    error,
  }
}
